# Crates

To make the code more modular the functionality is divided into seperate Crates.

For example it's possible to use the same event file parsing functionality
to generate docs as used in the connector itself.

## src-tauri

This is the main crate that contains the core connector logic.

## types

This crate contains all the Rust types and can be shared over multiple packages.

## file_parsers

This crate contains all logic that parses external files.

I.e. Input.json, output.json wasm_events.json.

## build_utils

This crate contains utillities used during the build or generating docs.
