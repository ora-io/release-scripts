import cac from 'cac'
import { version} from '../package.json'
export function run() {
  const cli = cac()
  cli.parse()
  cli.version(version)
  cli.help()
}
