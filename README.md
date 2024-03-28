## Flight connector

This is a rewrite of the original connector written in C++.
The original repo can be found at:
[https://github.com/BitsAndDroids/Bits-and-Droids-flight-connector](https://github.com/BitsAndDroids/Bits-and-Droids-flight-connector)

## Documentation

The documentation can be found in the open-source docs [Flightconnector Docs book](https://bitsanddroids.github.io/FlightConnector-Rust/).

The documentation is made using [mdbooks](https://rust-lang.github.io/mdBook/). You can find the documentation files in the connector-docs folder if you want to contribute.

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
