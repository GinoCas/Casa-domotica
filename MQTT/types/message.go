package types

type MessagePublisher interface {
	Handle(topic string, message string) error
}

type MessageReceiver interface {
	Handle(topic string) error
}
