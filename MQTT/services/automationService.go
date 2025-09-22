package services

import (
	"mqtt-demo/types"
	"strconv"
)

type AutomationService struct {
	publisher types.MessagePublisher
	receiver  types.MessageReceiver
}

func NewAutomationService(publisher types.MessagePublisher, receiver types.MessageReceiver) *AutomationService {
	return &AutomationService{
		publisher: publisher,
		receiver:  receiver,
	}
}

func (s *AutomationService) PublishAutomationState(automation types.Automation) error {
	topic := "automations/" + strconv.Itoa(automation.ID)
	message := "{\"state\": \"" + automation.StateText + "\"}"
	return s.publisher.Handle(topic, message)
}