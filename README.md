## Flight connector

This is a rewrite of the original connector written in C++.
The original repo can be found at:
[https://github.com/BitsAndDroids/Bits-and-Droids-flight-connector](https://github.com/BitsAndDroids/Bits-and-Droids-flight-connector)

![image](https://github.com/BitsAndDroids/FlightConnector-Rust/assets/77780263/f932f6ed-90a4-4802-972f-a3f82b851962)

## Documentation

The documentation can be found in the open-source docs [Flightconnector Docs book](https://bitsanddroids.github.io/FlightConnector-Rust/).

The documentation is made using [mdbooks](https://rust-lang.github.io/mdBook/). You can find the documentation files in the connector-docs folder if you want to contribute.

## How does it work

The connector makes use of serial communication to communicate between your microcontrollers.

### Outputs

![image](https://github.com/BitsAndDroids/FlightConnector-Rust/assets/77780263/515a7e2f-1f8c-4775-bc03-2059d094dafb)
The connector receives commands from Microsoft Flight Simulator 2020 and translates these commands to serial messages. These messages are formatted as "{ID} {VALUE}". Your able to write your own translation layer to decode the messages on your microcontrollers. Your also able to utilize the Flight sim library to do the heavy lifting for you.

### Inputs

![image](https://github.com/BitsAndDroids/FlightConnector-Rust/assets/77780263/c61f46c2-cb8b-461d-8fed-7b629e33c7ec)
The connector also listens to inputs from your microcontrollers. This makes use of an ID system to translate incomming messages to simulation events. The flight sim library can be used to simplify this process.

## Library

The library can be installed from the official Arduino IDE. You can also download the library from the [Github repo](https://github.com/BitsAndDroids/BitsAndDroidsFlightSimLibrary).

## Install

- Install the prerequisites [using the official Tauri docs](https://tauri.app/v1/guides/getting-started/prerequisites)
- Install [Node](https://nodejs.org/en) (version > 18.17.0)

## Running the application

The application is structured to run on Windows and Linux. Linux is only usable for development purposes. All SimConnect logic has been excluded when using Linux.

- Navigate to the root folder of your project
- \*Run in the root of the project (or the terminal of your editor): npm i
- Run in the root of your project (or the terminal of your editor): npm run tauri dev

\* This only has to be done when you start the application for the first time or when packages have been changed/added (in the package.json file)

## React

The frontend is developed in React. It uses the React-router-dom package for internal navigation.

## Learn More

To learn more about React, take a look at the following resources:

- [React Documentation](https://react.dev/) - learn about React features and API.

## Component library (Storybook)

Storybook is a powerful tool for developing and showcasing components in isolation. It serves as a component library, allowing you to browse a collection of components and interact with them in isolation from the rest of the application. This can greatly enhance the development and testing process, as well as provide a useful reference for the team.

In this repository, Storybook is used to:

- Develop components in isolation, making it easier to focus on the component without worrying about app-specific dependencies and requirements.
- Document the different states of each component, providing a guide for developers and designers.
- Showcase the components , providing a clear picture of the available UI elements in the project.

To run Storybook, use the following command in your terminal:

```bash
pnpm run storybook
```

This will start the Storybook server and open it in your default web browser.
