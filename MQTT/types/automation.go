package types

type Automation struct {
	ID          int      `json:"id"`
	State       bool     `json:"state"`
	StateText   string   `json:"stateText"`
	Name        string   `json:"name"`
	Description string   `json:"description"`
	InitTime    string   `json:"initTime"`
	EndTime     string   `json:"endTime"`
	Devices     []Device `json:"devices"`
}
