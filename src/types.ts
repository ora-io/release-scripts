import { BuildConfig } from "unbuild";

export interface UserConfig {
  entries: BuildConfig['entries']
  build?: Omit<BuildConfig, 'entries'>
}
