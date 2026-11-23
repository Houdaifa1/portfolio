import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { build } from 'vite'

const output = new URL('../dist/index.html', import.meta.url)
const outlet = '<!--app-html-->'
const html = await readFile(output, 'utf8')

if (!html.includes(outlet)) {
  throw new Error('Missing portfolio render outlet in dist/index.html')
}

const serverOutput = await mkdtemp(new URL('../node_modules/.portfolio-ssr-', import.meta.url))
try {
  await build({
    logLevel: 'warn',
    build: {
      ssr: 'src/App.jsx',
      outDir: serverOutput,
      copyPublicDir: false,
      rollupOptions: { output: { entryFileNames: 'App.mjs' } },
    },
  })
  const { default: App } = await import(pathToFileURL(join(serverOutput, 'App.mjs')))
  const content = renderToString(createElement(App))
  await writeFile(output, html.replace(outlet, () => content))
} finally {
  await rm(serverOutput, { recursive: true, force: true })
}
