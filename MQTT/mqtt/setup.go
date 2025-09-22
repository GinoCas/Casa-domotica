package mqttconfig

import (
	"fmt"
	"log"
	"os"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/joho/godotenv"
)

type MqttConfig struct {
	Broker   string
	Port     string
	ClientID string
	Username string
	Password string
}

func LoadConfig() (*MqttConfig, error) {
	err := godotenv.Load("mqtt/config.env")
	if err != nil {
		return nil, fmt.Errorf("error cargando archivo .env: %w", err)
	}

	config := &MqttConfig{
		Broker:   os.Getenv("BROKER"),
		Port:     os.Getenv("PORT"),
		ClientID: os.Getenv("CLIENT_ID"),
		Username: os.Getenv("MQTT_USER"),
		Password: os.Getenv("MQTT_PASSWORD"),
	}

	return config, nil
}

func CreateMqttClient(config *MqttConfig) (mqtt.Client, error) {
	opts := mqtt.NewClientOptions()
	opts.AddBroker(config.Broker + ":" + config.Port)
	opts.SetClientID(config.ClientID)
	
	if config.Username != "" {
		opts.SetUsername(config.Username)
		opts.SetPassword(config.Password)
	}

	// Configurar handlers
	opts.SetDefaultPublishHandler(messagePubHandler)
	opts.OnConnect = connectHandler
	opts.OnConnectionLost = connectLostHandler

	// Crear cliente
	client := mqtt.NewClient(opts)
	token := client.Connect()
	token.Wait()
	if token.Error() != nil {
		return nil, token.Error()
	}

	return client, nil
}

// Handlers para eventos MQTT
var messagePubHandler mqtt.MessageHandler = func(client mqtt.Client, msg mqtt.Message) {
	fmt.Printf("Received message: %s from topic: %s\n", msg.Payload(), msg.Topic())
}

var connectHandler mqtt.OnConnectHandler = func(client mqtt.Client) {
	fmt.Println("Connected to MQTT Broker")
}

var connectLostHandler mqtt.ConnectionLostHandler = func(client mqtt.Client, err error) {
	log.Printf("Connection lost: %v", err)
}

// MqttPublisher maneja la publicación de mensajes MQTT
type MqttPublisher struct {
    client mqtt.Client
}

// NewMqttPublisher crea una nueva instancia de MqttPublisher
func NewMqttPublisher(client mqtt.Client) *MqttPublisher {
    return &MqttPublisher{client}
}

// PublishMessage publica un mensaje en un tópico específico
func (m *MqttPublisher) Handle(topic string, message string) error {
	fmt.Println("Publicando mensaje:", message, "en topico:", topic)
    token := m.client.Publish(topic, 0, false, message)
    token.Wait()
    if token.Error() != nil {
        return token.Error()
    }
    return nil
}

// MqttReceiver maneja la suscripción a tópicos MQTT
type MqttReceiver struct {
    client mqtt.Client
}

// NewMqttReceiver crea una nueva instancia de MqttReceiver
func NewMqttReceiver(client mqtt.Client) *MqttReceiver {
    return &MqttReceiver{client}
}

// Subscribe se suscribe a un tópico específico
func (m *MqttReceiver) Handle(topic string) error {
    token := m.client.Subscribe(topic, 0, func(client mqtt.Client, msg mqtt.Message) {
        fmt.Printf("Received message: %s from topic: %s\n", msg.Payload(), msg.Topic())
    })
    token.Wait()
    if token.Error() != nil {
        return token.Error()
    }
    return nil
}