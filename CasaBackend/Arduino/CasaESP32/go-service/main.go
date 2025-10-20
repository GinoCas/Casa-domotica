package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"os"
	"strconv"
	"strings"
	"sync"
	"time"

	mqtt "github.com/eclipse/paho.mqtt.golang"
)

// DTOs compatibles con el backend
type ArduinoDeviceDto struct{ Id int; State bool; Type string; Brightness *int; Speed *int }
type AutomationDeviceDto struct{ Id int; State bool }
type ArduinoAutomationDto struct{ Id int; StartHour, StartMinute, EndHour, EndMinute int; Days byte; State bool; Devices []AutomationDeviceDto }
type ArduinoAutomationEraseDto struct{ Id int }
type ArduinoModeDto struct{ Name string; State bool }
type Envelope[T any] struct{ Data T `json:"Data"` }

// Estado del servicio
const (
	TypeLed = "Led"
	TypeFan = "Fan"
	TypeTv  = "Tv"
)

type Device struct{ Pin int; State bool; Type string; Brightness int; Speed int }
type Automation struct{ StartHour, StartMinute, EndHour, EndMinute int; Days byte; State bool; Devices []AutomationDeviceDto; LastTriggered time.Time; Active bool }

type SimClock struct{ Hour, Minute, Second, Weekday int; lastTick time.Time }
func (s *SimClock) Init(h, m, wd int) { s.Hour, s.Minute, s.Second, s.Weekday = h, m, 0, wd; s.lastTick = time.Now() }
func (s *SimClock) Tick() { now := time.Now(); if now.Sub(s.lastTick) >= time.Second { s.lastTick = now; s.Minute++; if s.Minute>=60 { s.Minute=0; s.Hour++; if s.Hour>=24 { s.Hour=0; s.Weekday=(s.Weekday+1)%7 }}} }

var (
	mu sync.Mutex
	devices []Device
	automations []Automation
	saveEnergyMode bool
	activityMode bool
	ledPreSave = map[int]int{} // id->brightness
	activityPreState = map[int]bool{}
	activityPreLed = map[int]int{}
	activityPreFan = map[int]int{}
	activitySnapshotValid bool
	activityNextEventAt time.Time
	activityCurrentDevice = -1
	sim SimClock
	client mqtt.Client
	mqttHost = envOr("MQTT_BROKER", "test.mosquitto.org")
	mqttPort = mustAtoi(envOr("MQTT_PORT", "1883"))
)

func envOr(k, d string) string { if v:=os.Getenv(k); v!="" { return v }; return d }
func mustAtoi(s string) int { i, _ := strconv.Atoi(s); return i }

// MQTT helpers
func mustConnectMQTT() mqtt.Client {
	opts := mqtt.NewClientOptions().AddBroker(fmt.Sprintf("tcp://%s:%d", mqttHost, mqttPort)).SetClientID("CasaGoService").SetKeepAlive(60*time.Second)
	c := mqtt.NewClient(opts)
	if t:=c.Connect(); t.Wait() && t.Error()!=nil { log.Fatalf("MQTT connect error: %v", t.Error()) }
	return c
}
func publish[T any](topic string, data T) {
	payload, _ := json.Marshal(Envelope[T]{Data: data})
	client.Publish(topic, 0, false, payload)
}

// Publicaciones
func publishDevices() {
	mu.Lock(); defer mu.Unlock()
	list := make([]ArduinoDeviceDto, 0, len(devices))
	for i, d := range devices {
		var brPtr, spPtr *int
		if d.Type==TypeLed { br:=d.Brightness; brPtr=&br }
		if d.Type==TypeFan { sp:=d.Speed; spPtr=&sp }
		list = append(list, ArduinoDeviceDto{ Id: i+1, State: d.State, Type: d.Type, Brightness: brPtr, Speed: spPtr })
	}
	publish("casa/devices", list)
}
func publishAutomation(a Automation, id int) {
	dto := ArduinoAutomationDto{ Id:id, StartHour:a.StartHour, StartMinute:a.StartMinute, EndHour:a.EndHour, EndMinute:a.EndMinute, Days:a.Days, State:a.State, Devices:a.Devices }
	publish("casa/automations", dto)
}
func publishAutomationErase(id int) { publish("casa/automations/erase", ArduinoAutomationEraseDto{ Id:id }) }
func publishMode(name string, state bool) { publish("casa/modes", ArduinoModeDto{ Name:name, State:state }) }

// Lógica de dispositivos
func applyDeviceChange(id int, state bool, typ string, brightness, speed *int) {
	mu.Lock(); defer mu.Unlock()
	if id<=0 || id>len(devices) { return }
	d := &devices[id-1]
	if typ!="" { d.Type = typ }
	d.State = state
	if d.Type==TypeLed {
		if brightness!=nil { d.Brightness=*brightness }
		br := d.Brightness
		out := br
		if saveEnergyMode && d.State { ledPreSave[id] = br; if br>128 { out=128 } }
		_ = out // simulación de PWM
	} else if d.Type==TypeFan {
		if speed!=nil { d.Speed=*speed }
	} else { /* TV u otros */ }
}

// Modos
func onSaveEnergyModeChanged(enabled bool) {
	mu.Lock(); defer mu.Unlock()
	for i, d := range devices {
		if d.Type==TypeLed {
			if enabled {
				if _,ok:=ledPreSave[i+1]; !ok { ledPreSave[i+1]=d.Brightness }
				if d.Brightness>128 && d.State { /* limitar */ }
			} else {
				if prev,ok:=ledPreSave[i+1]; ok { d.Brightness=prev; delete(ledPreSave, i+1) }
			}
		}
	}
}
func scheduleNextActivityEvent() { activityNextEventAt = time.Now().Add(time.Duration(8+rand.Intn(12)) * time.Second) }
func onActivityModeChanged(enabled bool) {
	mu.Lock(); defer mu.Unlock()
	activityCurrentDevice = -1
	if enabled {
		activitySnapshotValid = true
		for i, d := range devices {
			activityPreState[i+1] = d.State
			if d.Type==TypeLed { activityPreLed[i+1] = d.Brightness } else if d.Type==TypeFan { activityPreFan[i+1] = d.Speed }
			d.State=false
		}
		publishDevices(); scheduleNextActivityEvent()
	} else {
		if activitySnapshotValid {
			for i, d := range devices {
				ps := activityPreState[i+1]
				if d.Type==TypeLed { br:=activityPreLed[i+1]; applyDeviceChange(i+1, ps, TypeLed, &br, nil) } else if d.Type==TypeFan { sp:=activityPreFan[i+1]; applyDeviceChange(i+1, ps, TypeFan, nil, &sp) } else { applyDeviceChange(i+1, ps, d.Type, nil, nil) }
				delete(activityPreState,i+1); delete(activityPreLed,i+1); delete(activityPreFan,i+1)
			}
			publishDevices()
		}
		activitySnapshotValid=false
	}
}
func handleActivityModeLoop() {
	if !activityMode { return }
	if time.Now().After(activityNextEventAt) {
		if activityCurrentDevice>=0 && activityCurrentDevice<len(devices) { devices[activityCurrentDevice].State=false }
		if len(devices)>0 {
			idx := rand.Intn(len(devices)); if len(devices)>1 && idx==activityCurrentDevice { idx=(idx+1)%len(devices) }
			d := &devices[idx]; activityCurrentDevice=idx
			if d.Type==TypeLed { br:=d.Brightness; if saveEnergyMode { ledPreSave[idx+1]=br; if br>128 { br=128 } }; d.State=true } else if d.Type==TypeFan { d.State=true } else { d.State=true }
		}
		publishDevices(); scheduleNextActivityEvent()
	}
}

// Automations
func isDayActive(bitmask byte, weekday int) bool { return (bitmask & (1<<weekday)) != 0 }
func checkAutomations() {
	sim.Tick(); if activityMode { return }
	mu.Lock(); defer mu.Unlock()
	current := sim.Hour*60 + sim.Minute
	for i := range automations {
		a := &automations[i]
		if !isDayActive(a.Days, sim.Weekday) { continue }
		start := a.StartHour*60 + a.StartMinute; end := a.EndHour*60 + a.EndMinute
		active := current>=start && current<end
		if active && !a.Active {
			a.Active=true; a.LastTriggered=time.Now()
			for _,ad := range a.Devices { applyDeviceChange(ad.Id, a.State, "", nil, nil) }
			publishDevices()
		} else if !active && a.Active {
			a.Active=false
			for _,ad := range a.Devices { applyDeviceChange(ad.Id, !a.State, "", nil, nil) }
			publishDevices()
		}
	}
}

// HTTP
func parseBody(r *http.Request, v any) error { defer r.Body.Close(); return json.NewDecoder(r.Body).Decode(v) }
func handlePutDevice(w http.ResponseWriter, r *http.Request) {
	var raw any; if err:=parseBody(r,&raw); err!=nil { http.Error(w, "invalid JSON", 400); return }
	b, _ := json.Marshal(raw)
	if strings.HasPrefix(string(b), "[") { var arr []ArduinoDeviceDto; _=json.Unmarshal(b,&arr); for _,it:=range arr { var br, sp *int; if it.Brightness!=nil { br=it.Brightness }; if it.Speed!=nil { sp=it.Speed }; applyDeviceChange(it.Id, it.State, it.Type, br, sp) }; publishDevices() } else { var it ArduinoDeviceDto; _=json.Unmarshal(b,&it); var br, sp *int; if it.Brightness!=nil { br=it.Brightness }; if it.Speed!=nil { sp=it.Speed }; applyDeviceChange(it.Id, it.State, it.Type, br, sp) }
	w.Header().Set("Content-Type","application/json"); w.Write([]byte(`{"status":"true"}`))
}
func handlePutAutomation(w http.ResponseWriter, r *http.Request) {
	var dto ArduinoAutomationDto; if err:=parseBody(r,&dto); err!=nil { http.Error(w, "invalid JSON", 400); return }
	id := dto.Id
	mu.Lock()
	if id==-1 { automations = append(automations, Automation{ StartHour:dto.StartHour, StartMinute:dto.StartMinute, EndHour:dto.EndHour, EndMinute:dto.EndMinute, Days:dto.Days, State:dto.State, Devices:dto.Devices }); id=len(automations); publishAutomation(automations[id-1], id); mu.Unlock(); w.Write([]byte(`{"status":"automation added"}`)); return }
	if id>0 && id<=len(automations) { automations[id-1] = Automation{ StartHour:dto.StartHour, StartMinute:dto.StartMinute, EndHour:dto.EndHour, EndMinute:dto.EndMinute, Days:dto.Days, State:dto.State, Devices:dto.Devices }; publishAutomation(automations[id-1], id); mu.Unlock(); w.Write([]byte(`{"status":"automation updated"}`)); return }
	mu.Unlock(); http.Error(w, "automation not found", 404)
}
func handleDeleteAutomation(w http.ResponseWriter, r *http.Request) {
	parts := strings.Split(strings.TrimPrefix(r.URL.Path, "/automation/"), "/"); id, _ := strconv.Atoi(parts[0]);
	mu.Lock(); defer mu.Unlock()
	idx := id-1; if idx>=0 && idx<len(automations) { automations = append(automations[:idx], automations[idx+1:]...); publishAutomationErase(id); w.Write([]byte(`{"data":true}`)); return }
	http.Error(w, "automation not found", 404)
}
func handlePutTime(w http.ResponseWriter, r *http.Request) {
	var body struct{ Hour, Minute, Second, WeekDay int }
	if err:=parseBody(r,&body); err!=nil || body.Hour<0 || body.Minute<0 || body.WeekDay<0 { http.Error(w, "missing fields", 400); return }
	sim.Hour, sim.Minute, sim.Second = body.Hour, body.Minute, body.Second
	sim.Weekday = body.WeekDay
	w.Write([]byte(`{"data":true}`))
}
func handlePutMode(w http.ResponseWriter, r *http.Request) {
	var dto ArduinoModeDto; if err:=parseBody(r,&dto); err!=nil { http.Error(w, "Invalid JSON", 400); return }
	nm := strings.ToLower(dto.Name)
	if nm=="activity" { activityMode=dto.State; onActivityModeChanged(activityMode); publishMode("Activity", activityMode); w.Write([]byte(`{"success":true}`)); return }
	if nm=="save-energy" || nm=="saveenergy" || nm=="save_energy" { saveEnergyMode=dto.State; onSaveEnergyModeChanged(saveEnergyMode); publishMode("SaveEnergy", saveEnergyMode); w.Write([]byte(`{"success":true}`)); return }
	http.Error(w, "Mode Not Found", 404)
}
func handleAlive(w http.ResponseWriter, r *http.Request) { w.Write([]byte("OK")) }
func handleNotFound(w http.ResponseWriter, r *http.Request) { if r.Method==http.MethodDelete && strings.HasPrefix(r.URL.Path, "/automation/") { handleDeleteAutomation(w,r); return }; http.Error(w, "not found", 404) }

// MQTT comandos
func onMQTTMessage(c mqtt.Client, m mqtt.Message) {
	var raw any; if err:=json.Unmarshal(m.Payload(), &raw); err!=nil { return }
	b, _ := json.Marshal(raw)
	topic := m.Topic()
	if topic=="casa/devices/cmd" {
		if len(b)>0 && b[0]=='[' { var arr []ArduinoDeviceDto; _=json.Unmarshal(b,&arr); for _,it:=range arr { var br, sp *int; if it.Brightness!=nil { br=it.Brightness }; if it.Speed!=nil { sp=it.Speed }; applyDeviceChange(it.Id, it.State, it.Type, br, sp) }; publishDevices() } else { var it ArduinoDeviceDto; _=json.Unmarshal(b,&it); var br, sp *int; if it.Brightness!=nil { br=it.Brightness }; if it.Speed!=nil { sp=it.Speed }; applyDeviceChange(it.Id, it.State, it.Type, br, sp) }
	} else if topic=="casa/automations/cmd" {
		var dto map[string]any; _=json.Unmarshal(b,&dto); if cmd,ok:=dto["Cmd"].(string); ok && (cmd=="erase" || cmd=="delete") { id := int(dto["Id"].(float64)); mu.Lock(); idx:=id-1; if idx>=0 && idx<len(automations) { automations=append(automations[:idx], automations[idx+1:]...); publishAutomationErase(id) }; mu.Unlock(); return }
		var a ArduinoAutomationDto; _=json.Unmarshal(b,&a); id := a.Id; mu.Lock(); if id==-1 { automations=append(automations, Automation{ StartHour:a.StartHour, StartMinute:a.StartMinute, EndHour:a.EndHour, EndMinute:a.EndMinute, Days:a.Days, State:a.State, Devices:a.Devices }); id=len(automations); publishAutomation(automations[id-1], id) } else if id>0 && id<=len(automations) { automations[id-1]=Automation{ StartHour:a.StartHour, StartMinute:a.StartMinute, EndHour:a.EndHour, EndMinute:a.EndMinute, Days:a.Days, State:a.State, Devices:a.Devices }; publishAutomation(automations[id-1], id) } ; mu.Unlock()
	} else if topic=="casa/modes/cmd" {
		var dto ArduinoModeDto; _=json.Unmarshal(b,&dto); nm:=strings.ToLower(dto.Name); if nm=="activity" { activityMode=dto.State; onActivityModeChanged(activityMode); publishMode("Activity", activityMode) } else if nm=="save-energy" || nm=="saveenergy" || nm=="save_energy" { saveEnergyMode=dto.State; onSaveEnergyModeChanged(saveEnergyMode); publishMode("SaveEnergy", saveEnergyMode) }
	}
}

func main() {
	rand.Seed(time.Now().UnixNano())
	client = mustConnectMQTT()
	if token := client.Subscribe("casa/devices/cmd", 0, onMQTTMessage); token.Wait() && token.Error()!=nil { log.Println("sub error:", token.Error()) }
	if token := client.Subscribe("casa/automations/cmd", 0, onMQTTMessage); token.Wait() && token.Error()!=nil { log.Println("sub error:", token.Error()) }
	if token := client.Subscribe("casa/modes/cmd", 0, onMQTTMessage); token.Wait() && token.Error()!=nil { log.Println("sub error:", token.Error()) }

	// Inicializar estado
	sim.Init(8,0,1) // 1=Lunes
	devices = []Device{
		{2,true,TypeLed,255,0}, {4,true,TypeFan,0,2}, {5,true,TypeLed,255,0}, {15,true,TypeLed,255,0}, {18,true,TypeLed,255,0}, {19,true,TypeLed,255,0}, {21,true,TypeLed,255,0}, {23,true,TypeLed,255,0}, {22,true,TypeTv,0,0},
	}
	for i,d := range devices { typ := d.Type; var br, sp *int; if typ==TypeLed { b:=d.Brightness; br=&b } ; if typ==TypeFan { s:=d.Speed; sp=&s } ; applyDeviceChange(i+1, d.State, typ, br, sp) }
	publishDevices()
	automations = append(automations, Automation{ StartHour:8, StartMinute:0, EndHour:18, EndMinute:0, Days:127, State:true, Devices: []AutomationDeviceDto{{Id:1,State:true},{Id:2,State:true}} })
	publishAutomation(automations[0], 1)

	// HTTP
	port := envOr("PORT","8080")
	http.HandleFunc("/device", func(w http.ResponseWriter, r *http.Request){ if r.Method==http.MethodPut { handlePutDevice(w,r) } else { handleNotFound(w,r) } })
	http.HandleFunc("/automation", func(w http.ResponseWriter, r *http.Request){ if r.Method==http.MethodPut { handlePutAutomation(w,r) } else { handleNotFound(w,r) } })
	http.HandleFunc("/mode", func(w http.ResponseWriter, r *http.Request){ if r.Method==http.MethodPut { handlePutMode(w,r) } else { handleNotFound(w,r) } })
	http.HandleFunc("/time", func(w http.ResponseWriter, r *http.Request){ if r.Method==http.MethodPut { handlePutTime(w,r) } else { handleNotFound(w,r) } })
	http.HandleFunc("/", handleAlive)
	go func(){ ticker := time.NewTicker(1*time.Second); for range ticker.C { checkAutomations(); handleActivityModeLoop() } }()
	log.Printf("Go service escuchando en :%s", port)
	log.Fatal(http.ListenAndServe(":"+port, nil))
}