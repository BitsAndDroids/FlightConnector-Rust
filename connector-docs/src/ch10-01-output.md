# Outputs

Outputs are simvars that will be matched to an unique ID. The structure of an output:

```rust
#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct Output {
    pub simvar: String,
    pub metric: String,
    pub update_every: f32,
    pub cb_text: String,
    pub id: u32,
    pub output_type: i8,
    pub category: String,
}
```

Depending on the output_type the simvar is registered as a string or float.
The metric determines the return value returned from the game. These can sometimes be altered from the official simconnect docs.
