/* eslint-disable no-console */
import path from 'node:path'
import fs from 'fs-extra'
import { versionBump } from 'bumpp'
import { getConfig } from './config'
import { isDryRun, runIfNotDry, step } from './utils'

export async function release() {
  const config = await getConfig()
  const rootDir = process.cwd()
  const { version: oldVersion } = fs.readJSONSync(path.join(rootDir, 'package.json'))
  if (!isDryRun) {
    if (config.release.modifyVersion)
      step('\n📦Updating package version...')
    await versionBump({
      commit: false,
      tag: false,
      push: false,
    })
  }

  const { version } = fs.readJSONSync(path.join(rootDir, 'package.json'))

  if (!isDryRun) {
    if (oldVersion === version && config.release.modifyVersion) {
      console.log('canceled')
      process.exit()
    }
  }

  gitRun(rootDir, version)
}

async function gitRun(rootDir: string, version: string) {
  const tag = `v${version}`
  try {
    await runIfNotDry('git diff', { stdio: 'pipe', cwd: rootDir })
    step('\n📦Committing changes...')

    await runIfNotDry('git add .', { stdio: 'inherit', cwd: rootDir })

    await runIfNotDry(`git commit -m "chore: release ${tag}"`, { stdio: 'inherit', cwd: rootDir })
    await runIfNotDry(`git tag -a ${tag} -m "${tag}"`, { stdio: 'inherit', cwd: rootDir })
  }
  catch (error) {
    console.log('No changes to commit.')
    return
  }

  step('\n📦Pushing to GitHub...')

  await runIfNotDry('git push', { stdio: 'inherit', cwd: rootDir })
  await runIfNotDry('git push --tags', { stdio: 'inherit', cwd: rootDir })
}
