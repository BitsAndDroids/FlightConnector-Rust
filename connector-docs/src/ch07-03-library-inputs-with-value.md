# Inputs with values

Using SimConnect with Microsoft Flight Simulator 2020 allows sending values directly to the simulator. Some examples would be:

- Set the com frequency to 124.850
- Set the Kohlman altitude indicator to 29.98
- Set the nav frequency to 116.85

The format expected by the simulator might not always be the direct value. For example the Kohlman altitude indicator requires the value to be passed in Millibars multiplied by 16.

## Helper functions

The library has helper functions that parse the desired values into the correct format to simplify their use.

### connector.sendSetKohlmanAltimeterInHg(float value)

| Expects | The InHg value to set i.e. 29.92 as |
| Value type | float |
| Converts | Value _ 33.8639 (to mb) _ 16 |
| Sends | “377 16211” |

### connector.sendSetKohlmanAltimeterMb(float value)

| Expects | The mb value to set i.e. 1011 as |
| Value type | float |
| Converts | Value \* 16 |
| Sends | “377 162176” |
