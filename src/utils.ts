/* eslint-disable no-console */
import type { ExecSyncOptionsWithBufferEncoding } from 'node:child_process'
import { execSync } from 'node:child_process'
import { readFileSync } from 'node:fs'
import path from 'node:path'
import colors from 'picocolors'
import mri from 'mri'

export const args = mri(process.argv.slice(2))

export const isDryRun = !!args.dry
if (isDryRun) {
  console.log(colors.inverse(colors.yellow(' DRY RUN ')))
  console.log()
}

export async function run(
  bin: string,
  opts: ExecSyncOptionsWithBufferEncoding = {},
) {
  try {
    execSync(bin, { stdio: 'inherit', ...opts })
    Promise.resolve()
  }
  catch (error) {
    Promise.reject(error)
  }
}

export async function dryRun(
  bin: string,
  opts: ExecSyncOptionsWithBufferEncoding = {},
): Promise<void> {
  return console.log(
    colors.blue(`[dryrun] ${bin}`),
    opts || '',
  )
}

export const runIfNotDry = isDryRun ? dryRun : run

export function step(msg: string): void {
  return console.log(colors.cyan(msg))
}

export function getPackageInfo(
  root: string,
) {
  const pkgPath = path.resolve(root, 'package.json')
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8')) as {
    name: string
    version: string
    private?: boolean
  }

  if (pkg.private)
    throw new Error(`Package ${pkg.name} is private`)

  return { pkg, pkgPath, pkgName: pkg.name, version: pkg.version }
}

export async function publishPackage(
  pkgDir: string,
  tag?: string,
  provenance?: boolean,
  packageManager: 'npm' | 'pnpm' = 'npm',
): Promise<void> {
  const publicArgs = ['publish', '--access', 'public']
  if (tag)
    publicArgs.push('--tag', tag)

  if (provenance)
    publicArgs.push('--provenance')

  if (packageManager === 'pnpm')
    publicArgs.push('--no-git-checks')

  await runIfNotDry(`${packageManager} ${publicArgs.join(' ')}`, {
    cwd: pkgDir,
  })
}

export async function getActiveVersion(
  npmName: string,
): Promise<string | undefined> {
  try {
    await run(`npm info ${npmName} version`, { stdio: 'pipe' })
  }
  catch (e: any) {
    // Not published yet
    if (e.stderr.startsWith('npm ERR! code E404'))
      return
    throw e
  }
}
