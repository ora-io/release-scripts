import cac from 'cac'
import { version } from '../package.json'
import { build } from './build'
import { release } from './release'
export function run() {
  const cli = cac('scripts')
  cli.command('build', 'build project')
    .action(() => {
      build()
    })
  cli.command('release', 'build project')
    .action(() => {
      release()
    })
  cli.parse()
  cli.version(version)
  cli.help()
}
