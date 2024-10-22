export interface Output {
  simvar: string;
  metric: string;
  update_every: number;
  cb_text: string;
  id: number;
  output_type: string;
  category: string;
  selected?: boolean;
}
export const OutputFormats = [
  { value: "integer", label: "Integer (1)" },
  { value: "float", label: "Float (1.0)" },
  { value: "boolean", label: "Boolean (true, false)" },
  { value: "string", label: 'String ("string")' },
  { value: "secondsaftermidnight", label: "Time" },
];
