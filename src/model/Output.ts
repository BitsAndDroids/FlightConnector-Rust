export interface Output {
  output_name: string,
  metric: string,
  update_every: number,
  cb_text: string,
  id: number,
  output_type: number,
  selected?: boolean,
}
