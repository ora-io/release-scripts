/* eslint-disable no-console */
import path from 'node:path'
import fs from 'fs-extra'
import { getConfig } from './config'
import { exec, step } from './utils'

export async function release() {
  const config = await getConfig()
  const rootDir = process.cwd()
  const { version: oldVersion } = fs.readJSONSync(path.join(rootDir, 'package.json'))
  if (config.release.modifyVersion) {
    step('\n📦Updating package version...')
    exec('bumpp --no-commit --no-tag --no-push', { cwd: rootDir })
  }
  const { version } = fs.readJSONSync(path.join(rootDir, 'package.json'))

  if (oldVersion === version && config.release.modifyVersion) {
    console.log('canceled')
    process.exit()
  }
  gitRun(rootDir, version)
}

async function gitRun(rootDir: string, version: string) {
  const { stdout } = await exec('git diff', { stdio: 'pipe' })
  if (stdout) {
    step('\n📦Committing changes...')

    exec('git add .', { stdio: 'inherit' })

    exec(`git commit -m "chore: release v${version}"`, { stdio: 'inherit', cwd: rootDir })
    exec(`git tag -a v${version} -m "v${version}"`, { stdio: 'inherit', cwd: rootDir })
  }
  else {
    console.log('No changes to commit.')
    return
  }

  step('\n📦Pushing to GitHub...')

  exec('git push', { stdio: 'inherit', cwd: rootDir })
  exec('git push --tags', { stdio: 'inherit', cwd: rootDir })
}
