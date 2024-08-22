#include <BitsAndDroidsFlightConnector.h>
#include <LiquidCrystal_I2C.h>

BitsAndDroidsFlightConnector conn = BitsAndDroidsFlightConnector();
LiquidCrystal_I2C lcd(0x27,20,4);

long currentActiveCom = 0;
int currentIndicatedAltitude = 0;

void setup() {
  lcd.init();
  lcd.backlight();
  Serial.begin(115200);
}

void displayCom1(long com){
  lcd.setCursor(0,0);
  lcd.print(com);
}

void displayIndicatedAlt(int alt){
  lcd.setCursor(0,1);
  lcd.print(alt);
}

void loop() {
  //This polls the serial line for incomming messages
  conn.dataHandling();
  long activeCom = conn.getActiveCom1();
  int  indicatedAltitude = conn.getIndicatedAltitude();

  if (activeCom != currentActiveCom){
    currentActiveCom = activeCom;
    displayCom1(activeCom);
  }
  if (currentIndicatedAltitude != indicatedAltitude){
    currentIndicatedAltitude = indicatedAltitude;
    displayIndicatedAlt(indicatedAltitude);
  }
}
