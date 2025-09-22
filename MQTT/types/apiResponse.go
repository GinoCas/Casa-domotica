package types

type ApiResponse struct {
	Data      []Automation `json:"data"`
	IsSuccess bool         `json:"isSuccess"`
	Errors    []string     `json:"errors"`
}