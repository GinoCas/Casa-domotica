package main

import (
	"log"
	mqttconfig "mqtt-demo/mqtt"
	"mqtt-demo/services"
	"mqtt-demo/types"
	"time"
)

func main() {
	// Cargar configuración MQTT
	config, err := mqttconfig.LoadConfig()
	if err != nil {
		log.Fatalf("Error al cargar configuración: %v", err)
	}

	// Crear cliente MQTT
	client, err := mqttconfig.CreateMqttClient(config)
	if err != nil {
		log.Fatalf("Error al crear cliente MQTT: %v", err)
	}
	defer client.Disconnect(250)

	publisher := mqttconfig.NewMqttPublisher(client)
	receiver := mqttconfig.NewMqttReceiver(client)

	automationService := services.NewAutomationService(publisher, receiver)
	
	lucesSalon := types.Automation{
		ID:          1,
		State:       true,
		StateText:   "on",
		Name:        "Luces del Salón",
		Description: "Luces principales del salón",
		InitTime:    "19:00",
		EndTime:     "23:00",
		Devices:     []types.Device{{ID: 1}},
	}

	log.Printf("Publicando estado para la automatización: %s", lucesSalon.Name)
	err = automationService.PublishAutomationState(lucesSalon)
	if err != nil {
		log.Fatalf("Error al publicar estado: %v", err)
	}
	log.Println("Estado publicado correctamente.")

	time.Sleep(5 * time.Second)

	lucesSalon.State = false
	lucesSalon.StateText = "off"

	log.Printf("Publicando nuevo estado para la automatización: %s", lucesSalon.Name)
	err = automationService.PublishAutomationState(lucesSalon)
	if err != nil {
		log.Fatalf("Error al publicar estado: %v", err)
	}
	log.Println("Estado actualizado publicado correctamente.")
}