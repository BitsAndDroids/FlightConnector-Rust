# Installation

## Connector

The connector can be installed using the [latest installer](https://github.com/bitsAndDroids/flightConnector-Rust/releases/latest).
During startup the connector will automatically check for updates on Github. A pop-up will appear if a new version is available.

## WASM

The WASM module unlocks more simulation variables to interact with. You can read a full explanation in the [WASM chapter](./ch06-00-wasm.md).
You're able to install the module by copying the entire wasm_module into the MFS2020 community package folder.

If you wan't to ensure the module is properly installed you're able to follow these steps:

- Start MFS2020
- Open the option menu
- Enable developer mode
- Open the debug menu
- Open the console
- Search for BitsAndDroids

If the search results show messages that the module was initialized the module loaded properly.

> I'm working on porting over the installer to the new connector to make installing the module as easy as pressing a button.
