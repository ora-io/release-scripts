import { createConfigLoader } from 'unconfig'
import type { UserConfig } from './types'
import { defaultConfig } from './constants'

export async function loadConfigFromFile(configFile?: string, configRoot: string = process.cwd()) {
  async function rewrite(config: any) {
    const resolved = await (typeof config === 'function' ? config() : config)
    return resolved
  }

  const loader = createConfigLoader<UserConfig>({
    cwd: configRoot,
    sources: [configFile
      ? {
          files: configFile || '',
          extensions: [],
          rewrite: rewrite as any,
        }
      : {
          files: 'scripts.config',
          extensions: ['ts', 'mts', 'cts', 'js', 'mjs', 'cjs', 'json'],
          rewrite: rewrite as any,
        }],
    defaults: defaultConfig,
  })
  const result = await loader.load()
  return result.config
}

export async function getConfig(configFile?: string, configRoot?: string) {
  const userConfig = await loadConfigFromFile(configFile, configRoot)
  return userConfig as Required<UserConfig>
}
