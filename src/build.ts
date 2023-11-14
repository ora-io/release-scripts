import { build as unbuild } from 'unbuild'
import { getConfig } from './config'
export async function build() {
  const config = await getConfig()
  await unbuild(process.cwd(), !!config.build?.stub, { ...config.build, entries: config.entries })
}

