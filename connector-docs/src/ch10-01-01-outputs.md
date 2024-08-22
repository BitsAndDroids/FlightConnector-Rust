# Outputs

Outputs are events that retrieve data from the simulator and get sent to your microcontroller.
There are two types of outputs:

1. Simconnect events
2. WASM events

## Simconnect events

Simconnect events are provided by Microsoft Flight Simulator. They can be subscribed to, and the simulator will send an update if the value has changed.

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

The event itself is declared in the same field. This field dictates which event is subscribed to in the Simconnect SDK. Most events are documented in [the Simconnect SDK docs of Microsoft Flight Simulator](https://docs.flightsimulator.com/html/Programming_Tools/Event_IDs/Event_IDs.htm). In practice, some events aren't appropriately documented. The ingame dev tools can provide more information on the implementation of events.

### Metric

The metric value is the value format requested from the simulator. This is usually documented in the Simconnect docs, but it's possible to experiment with different values that aren't documented.
For example, events that accept Hz might also accept Khz and Mhz as metric values.

### Update rate / Epsilon

The interval at which these events are transmitted can be altered using the epsilon parameter (update_every). The epsilon parameter indicates at which float interval an update has to be sent. For example, when retrieving the height, you can receive an update every 0.00001 feet, 1 foot, or 10 feet. These values can be tweaked to a sensible threshold. Currently, the threshold is set by the connector. At a later point, it will be possible for users of the connector to override these values.
Try to set these values at a sensible threshold for most users. For example, most people don't need to receive a heading update every millimeter. Setting the update value to either 0.5 or 1 makes more sense.

### Checkbox text

The cb_text field describes the event. This is also the text that will be displayed in the bundle editor. If necessary, this field can be postfixed with a minor description. Try to use descriptors as little as possible. The target is short and to the point.

### ID

The ID field is an identifier used to identify events when transmitting them to your controllers. The reserved ID range for Simconnect events is 100-1000.

### Output type

Output type dictates the registration and formatting of events. Possible values are:

```Rust
            "adf" => Ok(OutputType::ADF),
            "boolean" => Ok(OutputType::Boolean),
            "integer" => Ok(OutputType::Integer),
            "float" => Ok(OutputType::Float) // Retrieved as float send as is,
            "float1decplaces" => Ok(OutputType::Float1DecPlaces) // Retrieved as float rounded to 1 dec place,
            "float2decplaces" => Ok(OutputType::Float2DecPlaces) // Retrieved as float rounded to 2 dec places,
            "seconds" => Ok(OutputType::Seconds) // Parsed to time hh:mm:ss,
            "secondsaftermidnight" => Ok(OutputType::Secondsaftermidnight) // Parsed to 15:34:15 (time of day),
            "percentage" => Ok(OutputType::Percentage) // Parsed to 80 for 80%,
            "degrees" => Ok(OutputType::Degrees) // Retrieved as radians parsed to degrees,
            "inhg" => Ok(OutputType::INHG),
            "meterspersecond" => Ok(OutputType::Meterspersecond) // retrieved as mps converted to kmh,
            "meterspersecondtoknots" => Ok(OutputType::MeterspersecondToKnots) // Retrieved as mps converted to knots,
            "string" => Ok(OutputType::String),
```

The first distinction is whether the output is a string or a number. Both types have separate registration logic in the connector.
The second part determined by the output type is the output format.
If the value is a number, the output format is determined by the type belonging to the event. In theory, the connector receives all numbers as float values. The parsing logic can be found in the sim_utils/output_converters module.

### Category

The bundle edit menu categorizes outputs based on the category provided in the category field.
Custom/WASM events get their own separate category.
At a later point users will be able to add their own custom categories.

## WASM Outputs

Third-party developers might find that the provided Simconnect events only cover some of their needs. They can expose a deeper event layer in a gauge API that the connector hooks into through a WASM module. With Simconnect events, the Simconnect SDK tells us when a new update is available. The WASM logic flow is more complex than Simconnect events. We are in complete control of the entire data flow. We ask for the current value of the event -> store that value -> check if that value is more significant than the indicated threshold/epsilon and send it to the connector. Due to this polling mechanism, there is a slight chance we miss certain intervals of fast-changing values (but the current value will always reflect the latest and up-to-date value).

```JSON
    {
      "id": 1000,
      "action": "(L:Generic_Master_Caution_Active)",
      "action_text": "Master caution on",
      "action_type": "output",
      "output_format": "time",
      "update_every": 0.0,
      "min": 0.0,
      "max": 100.0,
      "plane_or_category": "generic"
    },
```

### ID ranges

<div class="warning">
  The ID ranges currently are scattered everywhere, coming from the previous connector. 
  In an attempt to organize the events, I'm working on an update that might change the current IDs of WASM events.
  The reserved ID range is, therefore, still being contemplated.
  For contributors of the FBW and PMDG sets, the below-mentioned ranges can be seen as final.  
</div>

Please note the following text:

Custom WebAssembly (WASM) events can be provided as a base set by the connector or as custom events by users. The base set uses an ID range between 1000 and 7000, while IDs 7000 - 10000 are reserved for custom user events. This differentiation is important to prevent ID conflicts.

Certain default ID ranges have been reserved for event groups of popular aircraft. If you want to contribute to the event list, please open a pull request (PR) to edit the file with a reserved ID block.

- Flybywire: 2000-2500
- PMDG: 3000-3500

If you want to reserve a block, please update this page.

<div class="warning">
The current custom WebAssembly (WASM) set is expanding rapidly. We are designing a new interface to guarantee an intuitive flow for users when navigating all events.
</div>
