export interface ConnectorSettings {
  use_trs: boolean;
  adc_resolution: number;
  launch_when_sim_starts: boolean;
  installed_wasm_version: string;
  last_custom_event_version: string;
  send_every_ms: number;
}
