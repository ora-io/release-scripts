/* eslint-disable no-console */
import path from 'node:path'
import fs from 'fs-extra'
import { getConfig } from './config'
import { runIfNotDry, step } from './utils'

export async function release() {
  const config = await getConfig()
  const rootDir = process.cwd()
  const { version: oldVersion } = fs.readJSONSync(path.join(rootDir, 'package.json'))
  if (config.release.modifyVersion) {
    step('\n📦Updating package version...')
    await runIfNotDry('npx bumpp --no-commit --no-tag --no-push', { cwd: rootDir })
  }
  const { version } = fs.readJSONSync(path.join(rootDir, 'package.json'))

  if (oldVersion === version && config.release.modifyVersion) {
    console.log('canceled')
    process.exit()
  }
  gitRun(rootDir, version)
}

async function gitRun(rootDir: string, version: string) {
  try {
    await runIfNotDry('git diff', { stdio: 'pipe' })
    step('\n📦Committing changes...')

    await runIfNotDry('git add .', { stdio: 'inherit' })

    await runIfNotDry(`git commit -m "chore: release v${version}"`, { stdio: 'inherit', cwd: rootDir })
    await runIfNotDry(`git tag -a v${version} -m "v${version}"`, { stdio: 'inherit', cwd: rootDir })
  }
  catch (error) {
    console.log('No changes to commit.')
    return
  }

  step('\n📦Pushing to GitHub...')

  await runIfNotDry('git push', { stdio: 'inherit', cwd: rootDir })
  await runIfNotDry('git push --tags', { stdio: 'inherit', cwd: rootDir })
}
