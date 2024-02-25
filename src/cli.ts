import cac from 'cac'
import { version } from '../package.json'
import { build } from './build'
import { release } from './release'
import { publish } from './publish'
export function run() {
  const cli = cac('scripts')
  cli.version(version)

  cli.option('--dry', 'dry run')
  cli.command('build', 'build project')
    .action(() => {
      build()
    })
  cli.command('release', 'release package')
    .action(() => {
      release()
    })
  cli.command('publish', 'publish package')
    .action(() => {
      publish()
    })
  cli.help()
  cli.parse()
}
