export interface BugReport {
  discord_name?: string | null;
  github_issue_nr?: string | null;
  message: string;
  events: string;
  bundle_settings: string;
  presets: string;
  run_settings: string;
  logs: string;
}
