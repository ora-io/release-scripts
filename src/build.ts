import type { BuildConfig } from 'unbuild'
import { build as unbuild } from 'unbuild'
export function build(options?: BuildConfig) {
  unbuild(process.cwd(), false, options)
}
