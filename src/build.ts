import type { BuildConfig } from 'unbuild'
import { build as unbuild } from 'unbuild'
import { deepMerge, isObject, isString } from '@murongg/utils'
import { getConfig } from './config'
export async function build() {
  const config = await getConfig()
  const builds = Array.isArray(config.entries) ? config.entries : [config.entries]
  const buildConfigs: BuildConfig[] = builds.map((entry) => {
    let entries: BuildConfig['entries'] = []
    let build: Omit<BuildConfig, 'entries'> = {}
    if (isString(entry)) { entries = [entry] }
    else if (isObject(entry)) {
      if (entry.build)
        build = { ...entry.build }
      Reflect.deleteProperty(entry, 'build')
      entries = [entry]
    }

    else { entries = [entry] }
    const mergeConfig = deepMerge(config.build, build) as Omit<BuildConfig, 'entries'>
    return {
      entries,
      ...mergeConfig,
    }
  })
  buildConfigs.forEach(async (config) => {
    if (config)
      await unbuild(process.cwd(), !!config?.stub, { ...config })
  })
}

