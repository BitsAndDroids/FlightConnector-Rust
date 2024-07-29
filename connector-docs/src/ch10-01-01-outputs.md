# Outputs

Outputs are events that retrieve data from the simulator and gets send to your microcontroller.
There are two types of outputs:

1. Simconnect events
2. WASM events

## Simconnect events

Simconnect events are events provided by Microsoft Flight Simulator. These events can be subscribed to and the simulator will send an update if the value has changed.

```JSON
  {
    "simvar": "ADF ACTIVE FREQUENCY:1",
    "metric": "Hz",
    "update_every": 0,
    "cb_text": "ADF 1 active",
    "id": 954,
    "output_type": "adf",
    "category": "NAV and COMS"
  },

```

### Simvar

The event itself is declared in the simvar field. This field dictates which event is subscribed to in the Simconnect SDK. Most events are documented in [the Simconnect SDK docs of Microsoft Flight Simulator](https://docs.flightsimulator.com/html/Programming_Tools/Event_IDs/Event_IDs.htm). In practice some events aren't documented properly. The ingame dev tools can provide more information on the implementation of events.

### Metric

The metric value is the value format requested from the simulator. This usually is documented in the Simconnect docs. It's possible to experiment with different values that aren't documented.
I.e. events that accept Hz might also accept Khz and Mhz as metric values.

### Update rate / Epsilon

The interval at which these events get transmitted can be altered using the epsilon parameter (update_every). The epsilon parameter indicates at which float interval an update has to be sent. I.e. when retrieving the height you're able to receive an update every 0.00001 feet, 1 feet or 10 feet. These values can be tweaked to a sensible treshold. Currently the treshold is set by the connector. At a later point it will be possible to override these values by users of the connector.
Try to set these values at a sensible treshold for most users. I.e. most people don't need to receive an heading update every millimeter. It makes more sense to set the update value to either 0.5 or 1.

### Checkbox text

The cb_text field is a descriptive text that describes the event. This is also the text that will be displayed in bundle editor. This field can also be postfixed with a minor description if nescessary. Try to use descriptors to a minimum. Short and to the point is the target.

### ID

The ID field is an identifier used to identify events when transmitting them to your controllers. The reserved ID range for Simconnect events is 100-1000.

### Output type

Output type dictates the registration and formatting of events. Possible values are:

```Rust
            "adf" => Ok(OutputType::ADF),
            "boolean" => Ok(OutputType::Boolean),
            "integer" => Ok(OutputType::Integer),
            "float" => Ok(OutputType::Float),
            "float1decplaces" => Ok(OutputType::Float1DecPlaces),
            "float2decplaces" => Ok(OutputType::Float2DecPlaces),
            "seconds" => Ok(OutputType::Seconds),
            "secondsaftermidnight" => Ok(OutputType::Secondsaftermidnight) // Parsed to 15:34:15,
            "percentage" => Ok(OutputType::Percentage) // Parsed to 80 for 80%,
            "degrees" => Ok(OutputType::Degrees) // Retrieved as radians parsed to degrees,
            "inhg" => Ok(OutputType::INHG),
            "meterspersecond" => Ok(OutputType::Meterspersecond),
            "meterspersecondtoknots" => Ok(OutputType::MeterspersecondToKnots),
            "string" => Ok(OutputType::String),
```

The first distinction is wether the output is a string or a number. Both types have sepperate registration logic in the connector.
The second part determined by the output type is the output format.
If the value is a number the output format gets determined by the type belonging to the event. In theory all numbers are received as float values by the connector. The parsing logic can be found in the sim_utils/output_converters module.

### Category

The bundle edit menu categorizes outputs based on the category provided in the category field.
Custom/WASM events get their own seperate category.

## WASM Outputs

Third party developpers might find that the provided Simconnect events don't cover all their needs. They can expose a deeper event layer in a gauge API that the connector hooks into through a WASM module. With Simconnect events the Simconnect SDK tells us when a new update is available. The WASM flow is a bit more complex in the logic flow. We are in full control of the entire data flow. We ask for the current value of the event -> store that value -> check if that value is bigger than the indicated treshold/epsilon and send it to the connector. Due to this polling mechanism there is a slight chance we miss certain intervals of fast changing values (but the current value will always reflect the latest and up to date value).
