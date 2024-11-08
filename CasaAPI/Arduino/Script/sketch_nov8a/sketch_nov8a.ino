void setup() {
  Serial.begin(9600);
  pinMode(11, OUTPUT);

}

void loop() {
  if(Serial.available()){
    String command = Serial.readStringUntil('\n');
    if (command == "on") {
      digitalWrite(11, HIGH);
    } 
    else if (command == "off") {
      digitalWrite(11, LOW);
    }
  }
}
