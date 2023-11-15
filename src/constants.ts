import type { UserConfig } from '.'

export const defaultConfig: UserConfig = {
  entries: ['./src/index'],
  build: {
    declaration: true,
    clean: true,
    rollup: {
      emitCJS: true,
    },
  },
  release: {
    modifyVersion: true,
    changelog: false,
  },
  publish: {
    packageManager: 'npm',
  },
}
