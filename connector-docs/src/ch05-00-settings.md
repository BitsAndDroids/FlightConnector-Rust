# Settings

In this chapter, we'll go over the connector's available settings.
The settings menu can be accessed from the main menu in the settings tab.

## Connection settings

These settings affect the way the connector interacts with your devices.

### Enable TRS

|         |          |
| ------- | -------- |
| Iput    | checkbox |
| Type    | boolean  |
| Default | false    |

The terminal-ready signal is a signal that can be sent to your devices when the connector connects to your controller.
Specific microcontrollers like the Arduino use this signal to prepare the controller for incoming data.
The behavior of this signal depends on the microcontroller manufacturer's implementation.
For example, an Arduino Due uses the signal to reset the controller before establishing a serial connection.

If your microcontrollers reset, pay attention to the order of your devices.
For example, the Arduino Due has 2 USB ports (programmer and default).
When these ports are reset, the order in which the connectors are reset can affect whether the connection is established or dropped.
For the Due, it’s recommended that the programming port be placed at the top of the connection rows.
