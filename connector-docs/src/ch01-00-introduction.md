## Introduction

These are the docs for the Flightconnector.

### Supported simulators

- Microsoft Flight Simulator 2020
- (will work on compatibility ASAP) Microsoft Flight Simulator 2024

### How does the connector work

The connector uses Serial communication to communicate with your peripherals. It listens for data transmitted by your devices (we call them inputs) and at the same time it can send data to your devices (we call these outputs).
ID's are used to match inputs and outputs to the correct simulation variables.

### Input flow

![Input flow](../assets/input_flow.png)

### Output flow

![Output flow](../assets/output_flow.png)
