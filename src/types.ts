import type { BuildConfig, BuildEntry } from 'unbuild'

export type UserConfigEntries = ((BuildEntry & {
  build?: Omit<BuildConfig, 'entries'>
}) | string)[]

export interface UserConfig {
  entries: UserConfigEntries
  build?: Omit<BuildConfig, 'entries'>
  release?: ReleaseConfig
  publish?: PublishConfig
}

export interface ReleaseConfig {
  modifyVersion?: boolean
  changelog?: boolean
}
export interface PublishConfig {
  packageManager?: 'npm' | 'pnpm'
  provenance?: boolean
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
