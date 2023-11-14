import type { BuildConfig } from 'unbuild'

export interface UserConfig {
  entries: BuildConfig['entries']
  build?: Omit<BuildConfig, 'entries'>
  release?: ReleaseConfig
}

export interface ReleaseConfig {
  modifyVersion?: boolean
  changelog?: boolean
}

export type UserConfigFnObject = (...args: any[]) => UserConfig
export type UserConfigFnPromise = (...args: any[]) => Promise<UserConfig>
export type UserConfigFn = (...args: any[]) => UserConfig | Promise<UserConfig>
export type UserConfigExport = UserConfig | UserConfigFnObject | UserConfigFnPromise | Promise<UserConfig> | UserConfigFn

export function defineConfig(config: UserConfig): UserConfig
export function defineConfig(config: Promise<UserConfig>): Promise<UserConfig>
export function defineConfig(config: UserConfigFnObject): UserConfigFnObject
export function defineConfig(config: UserConfigFn): UserConfigFn
export function defineConfig(config: UserConfigExport): UserConfigExport {
  return config
}
