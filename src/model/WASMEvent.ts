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
  plane_or_category: string[];
}
