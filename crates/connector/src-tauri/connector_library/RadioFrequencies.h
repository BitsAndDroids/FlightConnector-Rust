#include <cstdint>
#include <cstring>
class RadioFrequencies {
private:
  static const uint8_t FREQ_SIZE = 8; // "xxx.xxx\0"
  char active[FREQ_SIZE];
  char standby[FREQ_SIZE];

public:
  RadioFrequencies() {
    // Initialize with default frequencies
    strcpy(active, "118.000");
    strcpy(standby, "118.000");
  }

  void setActive(const char *freq) {
    if (strlen(freq) < FREQ_SIZE) {
      strcpy(active, freq);
    }
  }

  void setStandby(const char *freq) {
    if (strlen(freq) < FREQ_SIZE) {
      strcpy(standby, freq);
    }
  }

  const char *getActive() const { return active; }

  const char *getStandby() const { return standby; }
};
