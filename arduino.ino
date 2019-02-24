#include <Adafruit_Sensor.h>
#include <DHT.h>
#include <DHT_U.h>
#include <ArduinoJson.h>

#define DHTPIN            7         // Pin which is connected to the DHT sensor.
#define DHTTYPE           DHT11

DHT_Unified dht(DHTPIN, DHTTYPE);

//{"led1":true,"led2":false,"led3":true,"data":"led"}
//{"data":"led"}
uint32_t delayMS = 1000;
const int capacity = JSON_OBJECT_SIZE(4);
char output[256];

void setup() {
  Serial.begin(9600);
  dht.begin();
  pinMode(2, OUTPUT);
  pinMode(3, OUTPUT);
  pinMode(4, OUTPUT);
}

void loop() {
  if (Serial.available() > 0) {
    StaticJsonBuffer<200> jsonBuffer;
    JsonObject& root = jsonBuffer.parseObject(Serial.readString());

    bool led1 = root["led1"];
    bool led2 = root["led2"];
    bool led3 = root["led3"];
    const char* data = root["data"];

    digitalWrite(2, led1);
    digitalWrite(3, led2);
    digitalWrite(4, led3);

    JsonObject& obj = jsonBuffer.createObject();
    if (0 == strcmp(data, "led")) {
      obj["led1"] = digitalRead(2);
      obj["led2"] = digitalRead(3);
      obj["led3"] = digitalRead(4);
    } else {
      sensors_event_t event; 
      obj["value"] = event.temperature;
      obj["unit"] = "celicus";
      obj["type"] = "temperature";
      obj["name"] = "arduino alexis";
    }

    obj.printTo(output);
    Serial.println(output);
  }
}
