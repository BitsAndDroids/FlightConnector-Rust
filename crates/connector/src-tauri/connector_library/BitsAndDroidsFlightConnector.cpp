#pragma clang diagnostic pop
#pragma clang diagnostic push
#pragma ide diagnostic ignored "OCUnusedGlobalDeclarationInspection"
#include "Arduino.h"

#include "BitsAndDroidsFlightConnector.h"

static const uint8_t ID_SIZE = 4;
static const uint8_t BUFFER_SIZE = 32;

char buffer[BUFFER_SIZE];
uint8_t bufferIndex = 0;

inline uint16_t parseId(const char *cmd) {
  return (cmd[0] - '0') * 1000 + (cmd[1] - '0') * 100 + (cmd[2] - '0') * 10 +
         (cmd[3] - '0');
}

BitsAndDroidsFlightConnector::BitsAndDroidsFlightConnector() {
  this->serial = &Serial;
}

#if defined(ARDUINO_SAM_DUE)
BitsAndDroidsFlightConnector::BitsAndDroidsFlightConnector(Serial_ *serial) {
  this->serial = serial;
}
#elif defined(ARDUINO_ARCH_ESP32) || defined(ESP8266) || defined(PICO_RP2040)
BitsAndDroidsFlightConnector::BitsAndDroidsFlightConnector(
    HardwareSerial *serial) {
  this->serial = &Serial;
}
#else
BitsAndDroidsFlightConnector::BitsAndDroidsFlightConnector(
    SoftwareSerial *serial) {
  this->serial = serial;
}
#endif

#ifndef DISABLE_INPUTS

// Set jitter algorithm EMA_a
void BitsAndDroidsFlightConnector::setEMA_a(float a) { EMA_a = a; }

void BitsAndDroidsFlightConnector::sendGetValueById(int id) {
  packagedData = sprintf(valuesBuffer, "%i %i", SEND_GET_COMMAND, id);
  this->serial->println(valuesBuffer);
}

void BitsAndDroidsFlightConnector::send(int command) {
  packagedData = sprintf(valuesBuffer, "%i", command);
  this->serial->println(valuesBuffer);
}

int BitsAndDroidsFlightConnector::smoothPot(int8_t potPin) {
  int readings[samples] = {};
  total = 0;
  for (int &reading : readings) {
    total = total - reading;
    reading = analogRead(potPin);
    total = total + reading;
    delay(1);
  }
  average = total / samples;
  return average;
}

void BitsAndDroidsFlightConnector::sendSetKohlmanAltimeterInHg(float value) {
  float mbValue = value * 33.8639;
  int valueToSend = mbValue * 16;
  packagedData = sprintf(valuesBuffer, "%s %d", "377", valueToSend);
  this->serial->println(valuesBuffer);
}

void BitsAndDroidsFlightConnector::sendSetKohlmanAltimeterMb(float value) {
  int valueToSend = value * 16;
  packagedData = sprintf(valuesBuffer, "%s %d", "377", valueToSend);
  this->serial->println(valuesBuffer);
}

int BitsAndDroidsFlightConnector::calculateAxis(int value, int minVal,
                                                int maxVal) {
  return map(value, minVal, maxVal, -16383, 16383);
}

void BitsAndDroidsFlightConnector::checkConnection() {
  this->sendGetValueById(1);
}
#endif //! DISABLE_INPUTS
//
#ifndef DISABLE_LIGHT_STATES
void BitsAndDroidsFlightConnector::setLight(uint8_t lightBit, bool state) {
  if (state) {
    lightStates |= (1 << lightBit);
  } else {
    lightStates &= ~(1 << lightBit);
  }
}
bool BitsAndDroidsFlightConnector::getLightState(uint8_t lightBit) {
  return lightStates & (1 << lightBit);
}
#endif // !DISABLE_LIGHTS
#ifndef DISABLE_AP_STATES
void BitsAndDroidsFlightConnector::setAPBit(uint8_t apBit, bool state) {
  if (apBit < 16) {
    if (state) {
      apStates1 |= (1 << apBit);
    } else {
      apStates1 &= ~(1 << apBit);
    }
  } else {
    apBit -= 16;
    if (state) {
      apStates2 |= (1 << apBit);
    } else {
      apStates2 &= ~(1 << apBit);
    }
  }
}

bool BitsAndDroidsFlightConnector::getAPState(uint8_t apBit) {
  if (apBit < 16) {
    return apStates1 & (1 << apBit);
  } else {
    apBit -= 16;
    return apStates2 & (1 << apBit);
  }
}
#endif

#ifndef DISABLE_PRIMARY_CONTROLS
void BitsAndDroidsFlightConnector::propsInputHandling(int propPin1,
                                                      int propPin2,
                                                      int propPin3,
                                                      int propPin4) {
  bool changed = false;
  propValue1 = smoothPot(propPin1);
  propValue2 = smoothPot(propPin2);
  propValue3 = smoothPot(propPin3);
  propValue4 = smoothPot(propPin4);
  if (propValue1 != oldPropValue1 || propValue2 != oldPropValue2) {

    if (abs(propValue1 - oldPropValue1) > 2) {
      props[0] = propValue1;
      oldPropValue1 = propValue1;
      changed = true;
    }
    if (abs(propValue2 - oldPropValue2) > 2) {
      props[1] = propValue2;
      oldPropValue2 = propValue2;
      changed = true;
    }
    if (abs(propValue3 - oldPropValue3) > 2) {
      props[2] = propValue3;
      oldPropValue3 = propValue3;
      changed = true;
    }
    if (abs(propValue4 - oldPropValue4) > 2) {
      props[3] = propValue4;
      oldPropValue4 = propValue4;
      changed = true;
    }
    if (changed) {
      sendCombinedPropValues();
    }
  }
}

void BitsAndDroidsFlightConnector::mixtureInputHandling(int mixturePin1,
                                                        int mixturePin2,
                                                        int mixturePin3,
                                                        int mixturePin4) {
  bool changed = false;
  mixtureValue1 = smoothPot(mixturePin1);
  mixtureValue2 = smoothPot(mixturePin2);
  mixtureValue3 = smoothPot(mixturePin3);
  mixtureValue4 = smoothPot(mixturePin4);
  if (mixtureValue1 != oldMixtureValue1 || mixtureValue2 != oldMixtureValue2) {

    if (abs(mixtureValue1 - oldMixtureValue1) > 2) {
      mixturePercentage[0] = mixtureValue1;
      oldMixtureValue1 = mixtureValue1;
      changed = true;
    }
    if (abs(mixtureValue2 - oldMixtureValue2) > 2) {
      mixturePercentage[1] = mixtureValue2;
      oldMixtureValue2 = mixtureValue2;
      changed = true;
    }
    if (abs(mixtureValue3 - oldMixtureValue3) > 2) {
      mixturePercentage[2] = mixtureValue3;
      oldMixtureValue3 = mixtureValue3;
      changed = true;
    }
    if (abs(mixtureValue4 - oldMixtureValue4) > 2) {
      mixturePercentage[3] = mixtureValue4;
      oldMixtureValue4 = mixtureValue4;
      changed = true;
    }
    if (changed) {
      sendCombinedMixtureValues();
    }
  }
}

void BitsAndDroidsFlightConnector::simpleInputHandling(int throttlePin) {
  value = smoothPot(throttlePin);

  if (value != oldValue && abs(oldValue - value) > 1) {
    oldValue = value;

    engines[0] = value;
    engines[1] = value;
    engines[2] = value;
    engines[3] = value;

    sendCombinedThrottleValues();
  }
}

void BitsAndDroidsFlightConnector::setPotFlaps(int8_t flapsPin) {
  flaps = smoothPot(flapsPin);
  if (flaps != oldFlaps && abs(oldFlaps - flaps) > 2) {
    oldFlaps = flaps;
    sendFlaps();
  }
}

void BitsAndDroidsFlightConnector::advancedInputHandling(int eng1Pin,
                                                         int eng2Pin,
                                                         int eng3Pin,
                                                         int eng4Pin) {
  valueEng1 = smoothPot(eng1Pin);
  valueEng2 = smoothPot(eng2Pin);
  valueEng3 = smoothPot(eng3Pin);
  valueEng4 = smoothPot(eng4Pin);
  bool changed = false;

  if (valueEng1 != oldValueEng1) {
    oldValueEng1 = valueEng1;
    engines[0] = valueEng1;
    changed = true;
  }
  if (valueEng2 != oldValueEng2) {
    oldValueEng2 = valueEng2;
    engines[1] = valueEng2;
    changed = true;
  }
  if (valueEng3 != oldValueEng3) {
    oldValueEng3 = valueEng3;
    engines[2] = valueEng3;
    changed = true;
  }
  if (valueEng4 != oldValueEng4) {
    oldValueEng4 = valueEng4;
    engines[3] = valueEng4;
    changed = true;
  }

  if (changed) {
    sendCombinedThrottleValues();
  }
}

void BitsAndDroidsFlightConnector::superAdvancedInputHandling(
    int8_t eng1Percentage, int8_t eng2Percentage, int8_t eng3Percentage,
    int8_t eng4Percentage) {
  engines[0] = eng1Percentage;
  engines[1] = eng2Percentage;
  engines[2] = eng3Percentage;
  engines[3] = eng4Percentage;
  sendCombinedThrottleValues();
}

void BitsAndDroidsFlightConnector::sendSetYokeAxis(int8_t elevatorPin,
                                                   int8_t aileronPin) {

  elevator = smoothPot(elevatorPin);

  aileron = smoothPot(aileronPin);

  if (abs(elevator - oldElevator) > analogDiff ||
      abs(oldAileron - aileron) > analogDiff) {
    packagedData = sprintf(valuesBuffer, "%s %i %i", "103", elevator, aileron);
    oldElevator = elevator;
    oldAileron = aileron;
    this->serial->println(valuesBuffer);
  }
}

void BitsAndDroidsFlightConnector::sendCombinedThrottleValues() {
  packagedData = sprintf(valuesBuffer, "%s %i %i %i %i", "199", engines[0],
                         engines[1], engines[2], engines[3]);
  this->serial->println(valuesBuffer);
}

void BitsAndDroidsFlightConnector::sendCombinedPropValues() {
  packagedData = sprintf(valuesBuffer, "%s %i %i %i %i", "198", props[0],
                         props[1], props[2], props[3]);
  this->serial->println(valuesBuffer);
}

void BitsAndDroidsFlightConnector::sendCombinedMixtureValues() {
  packagedData =
      sprintf(valuesBuffer, "%s %i %i %i %i", "115", mixturePercentage[0],
              mixturePercentage[1], mixturePercentage[2], mixturePercentage[3]);
  this->serial->println(valuesBuffer);
}

void BitsAndDroidsFlightConnector::sendFlaps() {
  packagedData = sprintf(valuesBuffer, "%s %i", "421", flaps);
  this->serial->println(valuesBuffer);
}

void BitsAndDroidsFlightConnector::sendSetElevatorTrimPot(int8_t potPin,
                                                          int minVal,
                                                          int maxVal) {
  currentTrim = (EMA_a * analogRead(potPin)) + ((1 - EMA_a) * currentTrim);
  if (currentTrim != oldTrim) {
    int trimFormatted = calculateAxis(currentTrim, 0, 1023);
    packagedData = sprintf(valuesBuffer, "%s %i", "900", trimFormatted);
    oldTrim = currentTrim;
    this->serial->println(valuesBuffer);
  }
}

void BitsAndDroidsFlightConnector::sendSetBrakePot(int8_t leftPin,
                                                   int8_t rightPin) {
  currentLeftBrake = smoothPot(leftPin);
  currentRightBrake = smoothPot(rightPin);

  bool changed = false;
  if (abs(oldLeftBrake - currentLeftBrake) > analogDiff) {
    oldLeftBrake = currentLeftBrake;
    changed = true;
  }
  if (abs(oldRightBrake - currentRightBrake) > analogDiff) {
    oldRightBrake = currentRightBrake;
    changed = true;
  }
  if (changed) {
    packagedData = sprintf(valuesBuffer, "%s %i %i", "902", currentLeftBrake,
                           currentRightBrake);
    this->serial->println(valuesBuffer);
  }
}

void BitsAndDroidsFlightConnector::sendSetRudderPot(int8_t potPin) {
  currentRudder = smoothPot(potPin);
  if (abs(currentRudder - oldRudderAxis) > analogDiff) {
    packagedData = sprintf(valuesBuffer, "%s %i", "901", currentRudder);
    oldRudderAxis = currentRudder;
    this->serial->println(valuesBuffer);
  }
}
void BitsAndDroidsFlightConnector::sendSetElevatorTrim(int value) {
  packagedData = sprintf(valuesBuffer, "%s %i", "900", value);
  this->serial->println(valuesBuffer);
}
#endif //! DISABLE_PRIMARY_CONTROLS

#ifndef DISABLE_OUTPUTS

static inline bool convBool(const char *value) { return value[0] != '0'; }
void BitsAndDroidsFlightConnector::dataHandling() {
  while (this->serial->available() > 0) {
    char c = this->serial->read();
    if (c == '\n') {
      buffer[bufferIndex] = '\0';
      switchHandling();
      bufferIndex = 0;
    } else if (bufferIndex < BUFFER_SIZE - 1) {
      buffer[bufferIndex++] = c;
    }
  }
}

void BitsAndDroidsFlightConnector::switchHandling() {

  if (bufferIndex < 5 || buffer[4] != ' ') {
    return;
  }
  uint16_t id = parseId(buffer);
  const char *value = &buffer[5];

  lastPrefix = id;

  switch (id) {
  case 1: {
    connected = atoi(value);
    break;
  }
  // Ap
  case 4000: {
    fuelLevel = atoi(value);
    break;
  }
#ifndef DISABLE_LIGHT_STATES
  // lights
  case 133: {
    setLight(LIGHT_TAXI, convBool(value));
    break;
  }
  case 134: {
    setLight(LIGHT_STROBE, convBool(value));
    break;
  }

  case 135: {
    setLight(LIGHT_PANEL, convBool(value));
    break;
  }
  case 136: {
    setLight(LIGHT_RECOGNITION, convBool(value));
    break;
  }
  case 137: {
    setLight(LIGHT_WING, convBool(value));
    break;
  }
  case 138: {
    setLight(LIGHT_LOGO, convBool(value));
    break;
  }
  case 139: {
    setLight(LIGHT_CABIN, convBool(value));
    break;
  }
  case 140: {
    setLight(LIGHT_HEAD, convBool(value));
    break;
  }
  case 141: {
    setLight(LIGHT_BRAKE, convBool(value));
    break;
  }
  case 142: {
    setLight(LIGHT_NAV, convBool(value));
    break;
  }
  case 143: {
    setLight(LIGHT_BEACON, convBool(value));
    break;
  }
  case 144: {
    setLight(LIGHT_LANDING, convBool(value));
    break;
  }
#endif // !DISABLE_LIGHTS
  case 275: {
    fuelTotalPercentage = atoi(value);
    break;
  }
  case 312: {
    feetAboveGround = atoi(value);
    break;
  }
  case 323: {
    onGround = convBool(value);
    break;
  }
  // ambient
  case 650: {
    ambientPressure = atoi(value);
    break;
  }
  case 651: {
    ambientTemperature = atof(value);
    break;
  }
  case 652: {
    ambientWindVelocity = atof(value);
    break;
  }
  case 653: {
    ambientWindDirection = atoi(value);
    break;
  }
  case 654: {
    ambientPrecipRate = atoi(value);
    break;
  }
  case 655: {
    ambientPrecipState = atoi(value);
    break;
  }
  case 656: {
    headingGyro = atoi(value);
    break;
  }
  case 657: {
    headingMag = atoi(value);
    break;
  }
  case 658: {
    headingTrue = atoi(value);
    break;
  }
  case 659: {
    indicatedAltitudeCalibrated = atoi(value);
    break;
  }

  // time
  case 338: {
    localTime = value;
    break;
  }
  case 339: {
    timezoneOffset = atoi(value);
    break;
  }
  case 340: {
    zuluTime = value;
    break;
  }
  // warnings
  case 333: {
    stallWarning = convBool(value);
    break;
  }
  case 334: {
    overspeedWarning = convBool(value);
    break;
  }
    // GPS
  case 454: {
    gpsCourseToSteer = atoi(value);
  }

    // Flaps
  case 510: {
    flapsHandlePct = atoi(value);
    break;
  }
  case 511: {
    flapsHandleIndex = atoi(value);
    break;
  }
  case 512: {
    flapsNumHandlePos = atoi(value);
    break;
  }
  case 513: {
    trailingEdgeFlapsLeftPercent = atoi(value);
    break;
  }
  case 514: {
    trailingEdgeFlapsRightPercent = atoi(value);
    break;
  }
  case 515: {
    trailingEdgeFlapsLeftAngle = atoi(value);
    break;
  }
  case 516: {
    trailingEdgeFlapsRightAngle = atoi(value);
    break;
  }
  case 517: {
    leadingEdgeFlapsLeftPct = atoi(value);
    break;
  }
  case 518: {
    leadingEdgeFlapsRightPct = atoi(value);
    break;
  }
  case 519: {
    leadingEdgeFlapsLeftAngle = atoi(value);
    break;
  }
  case 520: {
    leadingEdgeFlapsRightAngle = atoi(value);
    break;
  }

    // Gears
  case 526: {
    gearHandlePos = convBool(value);
    break;
  }
  case 527: {
    gearHydraulicPressure = atoi(value);
    break;
  }
  case 528: {
    tailWheelLock = convBool(value);
    break;
  }
  case 529: {
    gearCenterPositionPct = atoi(value);
    break;
  }
  case 530: {
    gearLeftPositionPct = atoi(value);
    break;
  }
  case 531: {
    gearRightPositionPct = atoi(value);
    break;
  }
  case 532: {
    gearTailPositionPct = atoi(value);
    break;
  }
  case 533: {
    gearAuxPosition = atoi(value);
    gearAuxPosition = atoi(value);
    break;
  }
  case 536: {
    gearTotalPct = atoi(value);
    break;
  }
#ifndef DISABLE_AP_STATES
    // AP
  case 576: {
    setAPBit(AP_AVAILABLE, convBool(value));
    break;
  }
  case 577: {
    setAPBit(AP_MASTER, convBool(value));
    break;
  }
  case 579: {
    setAPBit(AP_WING_LEVELER, convBool(value));
    break;
  }
  case 580: {
    setAPBit(AP_NAV1_HOLD, convBool(value));
    break;
  }
  case 581: {
    setAPBit(AP_HEADING_HOLD, convBool(value));
    break;
  }
  case 583: {
    setAPBit(AP_ALTITUDE_HOLD, convBool(value));
    break;
  }

  case 585: {
    setAPBit(AP_ATTITUDE_HOLD, convBool(value));
    break;
  }
  case 586: {
    setAPBit(AP_GLIDESLOPE_HOLD, convBool(value));
    break;
  }
  case 588: {
    setAPBit(AP_APPROACH_HOLD, convBool(value));
    break;
  }
  case 589: {
    setAPBit(AP_BACKCOURSE_HOLD, convBool(value));
    break;
  }
  case 591: {
    setAPBit(AP_FLIGHT_DIRECTOR, convBool(value));
    break;
  }
  case 594: {
    setAPBit(AP_AIRSPEED_HOLD, convBool(value));
    break;
  }
  case 596: {
    setAPBit(AP_MACH_HOLD, convBool(value));
    break;
  }
  case 598: {
    setAPBit(AP_YAW_DAMPENER, convBool(value));
    break;
  }
  case 600: {
    setAPBit(AP_AUTO_THROTTLE_ARM, convBool(value));
    break;
  }
  case 601: {
    setAPBit(AP_TAKEOFF_POWER, convBool(value));
    break;
  }
  case 602: {
    setAPBit(AP_AUTO_THROTTLE, convBool(value));
    break;
  }
  case 604: {
    setAPBit(AP_VERTICAL_HOLD, convBool(value));
    break;
  }
  case 605: {
    setAPBit(AP_RPM_HOLD, convBool(value));
    break;
  }
#endif
    // Rudder trim
  case 498: {
    elevatorTrimPos = atoi(value);
    break;
  }
  case 500: {
    elevatorTrimPct = atoi(value);
    break;
  }
  case 562: {
    aileronTrimDegr = atoi(value);
    break;
  }
  case 563: {
    aileronTrimPct = atoi(value);
    break;
  }
  case 566: {
    rudderTrimDegr = atoi(value);
    break;
  }
  case 567: {
    rudderTrimPct = atoi(value);
    break;
  }

  case 330: {
    trueVerticalSpeed = atoi(value);
    break;
  }

  case 326: {
    indicatedAirspeed = atoi(value);
    break;
  }
  case 335: {
    indicatedAltitude = atoi(value);
    break;
  }
  case 336: {
    indicatedAltitude2 = atoi(value);
    break;
  }

  case 337: {
    kohlmanAltimeter = atoi(value);
    break;
  }
  case 344: {
    indicatedHeading = atoi(value);
    break;
  }
  case 345: {
    varometerRate = atoi(value);
    break;
  }
  case 430: {
    indicatedGPSGroundspeed = atoi(value);
    break;
  }
  case 582: {
    apHeadingLock = atoi(value);
    break;
  }
  case 584: {
    apAltLock = atoi(value);
    break;
  }
  case 590: {
    apVerticalSpeed = atoi(value);
    break;
  }
  case 632: {
    barPressure = atoi(value);
    break;
  }
#ifndef DISABLE_COM_FREQUENCIES

  case 900: {
    com1.setActive(&buffer[5]);
    break;
  }
  case 901: {
    com1.setStandby(&buffer[5]);
    break;
  }
  case 902: {
    com2.setActive(&buffer[5]);
    break;
  }
  case 903: {
    com2.setActive(&buffer[5]);
    break;
  }
  case 910: {
    nav1.setActive(&buffer[5]);
    break;
  }
  case 911: {
    nav1.setStandby(&buffer[5]);
    break;
  }
  case 912: {
    nav2.setActive(&buffer[5]);
    break;
  }
  case 913: {
    nav2.setStandby(&buffer[5]);
    break;
  }

#endif // !DISABLE_COM_FREQUENCIES
  case 914: {
    navRadialError1 = value;
    break;
  }
  case 915: {
    navVorLationalt1 = value;
    break;
  }
    // DME
  case 950: {
    navDme1 = cutValue;
    break;
  }
  case 951: {
    navDme2 = cutValue;
    break;
  }
  case 952: {
    navDmeSpeed1 = cutValue;
    break;
  }
  case 953: {
    navDmeSpeed2 = cutValue;
    break;
  }

    // ADF
  case 954: {
    adfActiveFreq1 = atoi(value);
    break;
  }
  case 955: {
    adfStandbyFreq1 = atoi(value);
    break;
  }
  case 956: {
    adfRadial1 = cutValue;
    break;
  }
  case 957: {
    adfSignal1 = cutValue;
    break;
  }
  case 958: {
    adfActiveFreq2 = atoi(value);
    break;
  }
  case 959: {
    adfStandbyFreq2 = atoi(value);
    break;
  }
  // case 960: {
  //   adfRadial2 = cutValue;
  //   break;
  // }
  // case 961: {
  //   adfSignal2 = cutValue;
  //   break;
  // }
  //
  //   // Transponder
  // case 962: {
  //   transponderCode1 = cutValue;
  //   break;
  // }
  // case 963: {
  //   transponderCode2 = cutValue;
  //   break;
  // }
  case 608: {
    transponderIdent1 = atoi(value) != 0;
    break;
  }
  case 609: {
    transponderState1 = atoi(value);
    break;
  }
  case 610: {
    transponderIdent2 = atoi(value) != 0;
    break;
  }
  case 611: {
    transponderState2 = atoi(value);
    break;
  }

    //   // PLANE DATA
    // case 999: {
    //   planeName = cutValue;
    //   break;
    // }

  case 606: {
    navObs1 = atoi(value);
    break;
  }
  case 607: {
    navObs2 = atoi(value);
    break;
  }
  case 234: {
    fuelTankCenterLevel = atoi(value);
    break;
  }
  case 235: {
    fuelTankCenter2Level = atoi(value);
    break;
  }

  case 236: {
    fuelTankCenter3Level = atoi(value);
    break;
  }

  case 237: {
    fuelTankLeftMainLevel = atoi(value);
    break;
  }

  case 238: {
    fuelTankLeftAuxLevel = atoi(value);
    break;
  }

  case 239: {
    fuelTankLeftTipLevel = atoi(value);
    break;
  }

  case 240: {
    fuelTankRightMainLevel = atoi(value);
    break;
  }

  case 241: {
    fuelTankRightAuxLevel = atoi(value);
    break;
  }

  case 242: {
    fuelTankRightTipLevel = atoi(value);
    break;
  }

  case 243: {
    fuelTankExternal1Level = atoi(value);
    break;
  }

  case 244: {
    fuelTankExternal2Level = atoi(value);
    break;
  }

  case 245: {
    fuelTankCenterCapacity = atoi(value);
    break;
  }

  case 246: {
    fuelTankCenter2Capacity = atoi(value);
    break;
  }

  case 247: {
    fuelTankCenter3Capacity = atoi(value);
    break;
  }

  case 248: {
    fuelTankLeftMainCapacity = atoi(value);
    break;
  }

  case 249: {
    fuelTankLeftAuxCapacity = atoi(value);
    break;
  }

  case 250: {
    fuelTankLeftTipCapacity = atoi(value);
    break;
  }

  case 251: {
    fuelTankRightMainCapacity = atoi(value);
    break;
  }

  case 252: {
    fuelTankRightAuxCapacity = atoi(value);
    break;
  }

  case 253: {
    fuelTankRightTipCapacity = atoi(value);
    break;
  }

  case 254: {
    fuelTankExternal1Capacity = atoi(value);
    break;
  }

  case 255: {
    fuelTankExternal2Capacity = atoi(value);
    break;
  }

  case 256: {
    fuelTankLeftCapacity = atof(value);
    break;
  }
  case 257: {
    fuelTankRightCapacity = atof(value);
    break;
  }
  case 258: {
    fuelTankCenterQuantity = atoi(value);
    break;
  }
  case 259: {
    fuelTankCenter2Quantity = atoi(value);
    break;
  }
  case 260: {
    fuelTankCenter3Quantity = atoi(value);
    break;
  }
  case 261: {
    fuelTankLeftMainQuantity = atoi(value);
    break;
  }

  case 262: {
    fuelTankLeftAuxQuantity = atoi(value);
    break;
  }

  case 263: {
    fuelTankLeftTipQuantity = atoi(value);
    break;
  }

  case 264: {
    fuelTankRightMainQuantity = atoi(value);
    break;
  }

  case 265: {
    fuelTankRightAuxCapacity = atoi(value);
    break;
  }

  case 266: {
    fuelTankRightTipQuantity = atoi(value);
    break;
  }

  case 267: {
    fuelTankExternal1Quantity = atoi(value);
    break;
  }
  case 268: {
    fuelTankExternal2Quantity = atoi(value);
    break;
  }

  case 269: {
    fuelTankLeftQuantity = atof(value);
    break;
  }
  case 270: {
    fuelTankRightQuantity = atof(value);
    break;
  }
  case 271: {
    fuelTankTotalQuantity = atoi(value);
    break;
  }
  case 505: {
    parkingBrakeIndicator = convBool(value);
    break;
  }

  // DO NOT REMOVE THIS COMMENT ITS USED BY THE CONNECTOR TO GENERATE CUSTOM
  // EVENTS
  // START CASE TEMPLATE

  // END CASE TEMPLATE
  default:
    break;
  }
}
#endif
#ifndef DISABLE_OUTPUTS
const char *
BitsAndDroidsFlightConnector::convertToFreq(const char *unprocFreq) {
  // Check input validity
  if (!unprocFreq || strlen(unprocFreq) < 4)
    return "000.000";

  // Clear buffer
  memset(freqBuffer, 0, FREQ_BUFFER_SIZE);

  // Copy first 3 digits
  strncpy(freqBuffer, unprocFreq, 3);
  // Add decimal point
  freqBuffer[3] = '.';
  // Copy remaining digits
  strcpy(freqBuffer + 4, unprocFreq + 3);

  return freqBuffer;
}

const char *
BitsAndDroidsFlightConnector::convertToNavFreq(const char *unprocFreq) {
  // Check input validity
  if (!unprocFreq || strlen(unprocFreq) < 5)
    return "000.00";

  // Clear buffer
  memset(freqBuffer, 0, FREQ_BUFFER_SIZE);

  // Copy first 3 digits
  strncpy(freqBuffer, unprocFreq, 3);
  // Add decimal point
  freqBuffer[3] = '.';
  // Copy exactly 2 digits for NAV freq
  strncpy(freqBuffer + 4, unprocFreq + 3, 2);

  return freqBuffer;
}
#endif

// RECEIVING VALUES
// GPS

//----------------------
// TRANSMIT FUNCTIONS
// AP
char BitsAndDroidsFlightConnector::freqBuffer[FREQ_BUFFER_SIZE];
