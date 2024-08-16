# Outputs

In this chapter we'll go over the information needed to retrieve data from Microsoft Flight Simulator 2020 and send it to your controller.
The simulator requires us to indicate which data we want to subscribe to.
This enables us to only focus on the relevant data without having to filter out unwanted data.
It would be a waste of logic having to handle your indicated altitude when you only want to access the latest nav frequency.
That is why the first step will be to create a bundle of outputs.
//TODO: link to pages i.e. custom events

## Bundle creation

A bundle is a group of outputs that tell the connector which data to request from the simulator.
To receive data on your controller we first have to create a bundle.
It's recommended to create a bundle for each controller that you want to connect.
Let's go over the steps required to receive your indicated altitude and the current com frequency 1.

1. Go to the bundle menu (in the top navbar events -> bundle settings)
2. Click the green encircled + button to create your first bundle
3. Give it a descriptive name
4. Your new bundle should now appear in the available bundles
5. Click the pencil on the right side of your new bundle
6. Navigate to the Nav and Coms tab
7. Select com active frequency 1
8. Navigate to the instruments tab
9. Select indicated altitude
10. Hit the save icon next to the title of your bundle

//TODO: Add images

In this example we've created a rather minimalistic set.
If your use case requires different events you now know where to look.

## Starting the connection

Each controller can subscribe to a single bundle.
On the other hand multiple controllers are able to subscribe to the same bundle.
But in order for the connector to send the right data to the right controller we have to link them together.
This will be done from the home screen.
Lets go over the steps required to send your first data.

1. From the home screen select your controller from the com port selector.
2. Select your newly created bundle in the bundle column.
3. Press the green start button

If you've already connected multiple controllers that you'd like to connect you can add a new row by clicking the green add button.
Repeat these steps for the amount of controllers required.

//TODO: Add images

## Receiving the data

Now we've got everything setup to transmit data we need to setup the receiver.
In this example we will connect an I2C LCD screen to our controller in order to display our data.

```cpp
{{#include ./examples/lcd_i2c/lcd_i2c_example.ino}}
```
