/* eslint-disable no-console */
import { execa } from 'execa'
import type { Options as ExecaOptions, ExecaReturnValue } from 'execa'
import colors from 'picocolors'

export async function exec(
  bin: string,
  opts: ExecaOptions = {},
): Promise<ExecaReturnValue> {
  return execa(bin, { stdio: 'inherit', ...opts })
}

export function step(msg: string): void {
  return console.log(colors.cyan(msg))
}
