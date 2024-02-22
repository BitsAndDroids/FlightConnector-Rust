## Flight connector

This is a rewrite of the original connector written in C++.
The original repo can be found at:
[https://github.com/BitsAndDroids/Bits-and-Droids-flight-connector](https://github.com/BitsAndDroids/Bits-and-Droids-flight-connector)
## Documentation

The documentation can be found in the open source docs [Flightconnector Docs book](https://bitsanddroids.github.io/ConnectorDocs/).

If you want to contribute to the docs head on over to the [Flightconnector Docs repo](https://github.com/BitsAndDroids/ConnectorDocs).

## Install

- Install the prerequisites [using the official Tauri docs](https://tauri.app/v1/guides/getting-started/prerequisites)
- Install [Node](https://nodejs.org/en) (version > 18.17.0)

## Running the application

The application is structured to run on Windows and Linux. Linux is only usable for development purposes. All SimConnect logic has been excluded when using Linux.

- Navigate to the root folder of your project
- *Run in the root of the project (or the terminal of your editor): npm i
- Run in the root of your project (or the terminal of your editor): npm run tauri dev

  
\* This only has to be done when you start the application for the first time or when packages have been changed/added (in the package.json file)


## Nextjs
I've chosen to use Next (a React framework) for the front end of the connector. This enables us to expose API routes that can be accessed from other applications. This gives us a fully functional local web server out of the box that can be accessed from our browser/other apps.

## Learn More
To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

