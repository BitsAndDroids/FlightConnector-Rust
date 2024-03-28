## Your first flight with the Connector

Let's setup the connector and take it for a spin. The simplest action to perform is to connect a button to the connector and see if it works. We will use the simulator to see if the button press is registered.
So, let's get started.

Make sure you have the connector installed. If not, follow the instructions in the [Installation](./ch01-01-installation.md) section.

Open the connector and you will see the following screen:
//TODO add image

On this screen you're able to start/stop the connector and add/remove devices. For every peripheral you want to connect to the connector, you need to add a device. In this example we will add a single device to the connector.

To keep things simple, we will use a button to connect to the connector. The button will be used to trigger the parking brake in the simulator. The connector will send the signal to the simulator when the button is pressed. For this example we will be using an Arduino Uno but any other microcontroller will work as well. The code for the Arduino Uno can be found [here](./examples/button_input_code.md).
