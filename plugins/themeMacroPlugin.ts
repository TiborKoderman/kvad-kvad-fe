import type { Plugin } from 'vite'
import fs from 'node:fs'
import path from 'node:path'

function extractThemeColors(scss: string): Record<string, string> {
  const mapRegex = /\$theme-colors:\s*\(([\s\S]*?)\);/m
  const match = scss.match(mapRegex)

  if (!match) {
    throw new Error('Could not find $theme-colors map in theme.scss')
  }

  const body = match[1]
    .trim()
    .split(',')
    .map(line => line.trim())
    .filter(Boolean)

  const result: Record<string, string> = {}

  for (const line of body) {
    const [rawKey, rawVal] = line.split(':')
    if (!rawKey || !rawVal) continue

    const key = rawKey.trim().replace(/['"]/g, '')
    const val = rawVal.trim()
    result[key] = val
  }

  return result
}

export interface ThemeMacroPluginOptions {
  themeFile?: string // default: src/styles/theme.scss
  virtualId?: string // default: virtual:theme
}

export function themeMacroPlugin(
  options: ThemeMacroPluginOptions = {},
): Plugin {
  const virtualId = options.virtualId ?? 'virtual:theme'
  const resolvedVirtualId = '\0' + virtualId

  const themePath = path.resolve(
    process.cwd(),
    options.themeFile ?? 'src/styles/theme.scss',
  )

  let themeData: Record<string, string> = {}

  function loadTheme() {
    const scss = fs.readFileSync(themePath, 'utf8')
    themeData = extractThemeColors(scss)
  }

  return {
    name: 'theme-macro',
    enforce: 'pre',

    configResolved() {
      loadTheme()
    },

    configureServer(server) {
      // watch theme.scss and reload when it changes
      server.watcher.add(themePath)
      server.watcher.on('change', file => {
        if (file === themePath) {
          loadTheme()
          const mod = server.moduleGraph.getModuleById(resolvedVirtualId)
          if (mod) {
            server.moduleGraph.invalidateModule(mod)
            server.ws.send({
              type: 'full-reload',
              path: '*',
            })
          }
        }
      })
    },

    resolveId(id) {
      if (id === virtualId) {
        return resolvedVirtualId
      }
      return null
    },

    load(id) {
      if (id === resolvedVirtualId) {
        const json = JSON.stringify(themeData, null, 2)
        return `
          export const theme = ${json} as const;
          export type ThemeColorName = keyof typeof theme;
          export const themeColorNames = Object.keys(theme) as ThemeColorName[];
        `
      }
      return null
    },
  }
}
