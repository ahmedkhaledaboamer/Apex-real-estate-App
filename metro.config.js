// Metro config: shares data/logic with the website (one source of truth).
//
// `@/x` resolves to `mobile/src/x` if it exists, otherwise to `website/src/x`. So the app reuses the
// website's types, mock data, formatting, fee constants, filters, Redux slices and calculator math,
// while it can override a module by creating the same path here (e.g. `@/assets/images` → native images).
//
// Bare package imports coming from website files are resolved from *this* project's node_modules,
// so there is only ever one copy of react / react-redux / @reduxjs/toolkit in the bundle.
const path = require('path')
const fs = require('fs')
const { getDefaultConfig } = require('expo/metro-config')

const config = getDefaultConfig(__dirname)

const MOBILE_SRC = path.resolve(__dirname, 'src')
const WEB_SRC = path.resolve(__dirname, '../website/src')
const EXTS = ['.ts', '.tsx', '.js', '.jsx', '.json']
const APP_ENTRY = path.join(__dirname, 'package.json')

function existsModule(base) {
  for (const ext of ['', ...EXTS]) {
    const f = base + ext
    if (fs.existsSync(f) && fs.statSync(f).isFile()) return true
  }
  for (const ext of EXTS) if (fs.existsSync(path.join(base, 'index' + ext))) return true
  return false
}

// The website lives outside this project root, so Metro must watch it explicitly (the on-demand
// filesystem doesn't cover sibling folders that aren't workspace packages). Its node_modules and build
// output are excluded: packages always come from this app's node_modules (see below).
const WEB_ROOT = path.resolve(__dirname, '../website')
config.watchFolders = [...(config.watchFolders ?? []), WEB_ROOT]
const esc = (p) => p.replace(/[/\\]/g, '[/\\\\]').replace(/\./g, '\\.')
const blocked = ['node_modules', 'dist', '.tanstack', 'assets-src', 'docs', 'public'].map((d) => new RegExp(`^${esc(path.join(WEB_ROOT, d))}([/\\\\].*)?$`))
const existingBlock = config.resolver.blockList
config.resolver.blockList = [...(Array.isArray(existingBlock) ? existingBlock : existingBlock ? [existingBlock] : []), ...blocked]

const upstream = config.resolver.resolveRequest

config.resolver.resolveRequest = (context, moduleName, platform) => {
  const next = upstream ?? context.resolveRequest

  if (moduleName.startsWith('@/')) {
    const rest = moduleName.slice(2)
    const local = path.join(MOBILE_SRC, rest)
    const target = existsModule(local) ? local : path.join(WEB_SRC, rest)
    return context.resolveRequest(context, target, platform)
  }

  const isBare = !moduleName.startsWith('.') && !path.isAbsolute(moduleName)
  if (isBare && context.originModulePath.startsWith(WEB_SRC)) {
    return next({ ...context, originModulePath: APP_ENTRY }, moduleName, platform)
  }

  return next(context, moduleName, platform)
}

module.exports = config
