import semver from 'semver'
import {
  getActiveVersion,
  getPackageInfo,
  publishPackage,
  step,
} from './utils'
import { getConfig } from './config'

export const publish = async () => {
  const config = await getConfig()
  const root = process.cwd()
  const { pkg, version } = getPackageInfo(process.cwd())

  const activeVersion = await getActiveVersion(pkg.name)

  step('Publishing package...')
  const releaseTag = version.includes('beta')
    ? 'beta'
    : version.includes('alpha')
      ? 'alpha'
      : activeVersion && semver.lt(pkg.version, activeVersion)
        ? 'previous'
        : undefined
  await publishPackage(root, releaseTag, config.publish.provenance, config.publish.packageManager)
}
