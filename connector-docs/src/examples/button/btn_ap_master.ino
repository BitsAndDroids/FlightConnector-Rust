// This is needed when using another IDE than the Arduino IDE
#include <Arduino.h>
#include <BitsAndDroidsFlightConnector.h>
// Connect the button to pin 8
#define APBTNPIN 8

// Create a connector instance
auto connector = BitsAndDroidsFlightConnector();
// To check against if the state changed
int old_btn_state = HIGH;

void setup() {
  // Start serial coms at a rate of 115200 (this can be changed later)
  Serial.begin(115200);
  // Enable the internal pullup resistors
  pinMode(APBTNPIN, INPUT_PULLUP);
}

void loop() {
  const int btn_state = digitalRead(APBTNPIN);
  // To avoid unnescesary triggers
  if (old_btn_state != btn_state){
    if(btn_state == LOW){
      // A  full list of commands can be found in the inputs chapter 
      connector.send(sendApMasterOn);
    }
    old_btn_state = btn_state;
    // Add a delay to debounce noise
    delay(200);
  }
}

