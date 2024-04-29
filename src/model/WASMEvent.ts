export interface WASMEvent {
  id: number;
  action: string;
  action_text: string;
  action_type: string;
  output_format: string;
  update_every: number;
  min: number;
  max: number;
  value: number;
  offset: number;
  plane_or_category: string;
}
// pub struct WasmEvent {
//     pub id: u32,
//     pub action: String,
//     pub action_text: String,
//     pub action_type: String,
//     pub output_format: String,
//     pub update_every: f32,
//     pub min: f32,
//     pub max: f32,
//     pub value: f64,
//     pub offset: u32,
// }
