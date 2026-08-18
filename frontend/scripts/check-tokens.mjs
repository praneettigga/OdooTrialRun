// Fails if docs/DESIGN.md and src/index.css disagree on a colour token.
// Plan §12: "a doc that describes the app is not the app."
import { readFileSync } from 'node:fs'

const css = readFileSync(new URL('../src/index.css', import.meta.url), 'utf8')
const doc = readFileSync(new URL('../../docs/DESIGN.md', import.meta.url), 'utf8')

const live = new Map(
  [...css.matchAll(/--color-([\w-]+):\s*(#[0-9a-f]{6})/gi)].map(([, k, v]) => [k, v.toLowerCase()]),
)
const documented = new Map(
  [...doc.matchAll(/^\|\s*`([\w-]+)`\s*\|\s*`(#[0-9a-f]{6})`/gim)].map(([, k, v]) => [k, v.toLowerCase()]),
)

const problems = []
for (const [name, hex] of documented) {
  if (!live.has(name)) problems.push(`DESIGN.md documents "${name}" but @theme has no --color-${name}`)
  else if (live.get(name) !== hex) problems.push(`"${name}": DESIGN.md says ${hex}, @theme says ${live.get(name)}`)
}
for (const name of live.keys()) {
  if (!documented.has(name)) problems.push(`@theme defines --color-${name} but DESIGN.md does not document it`)
}

if (problems.length) {
  console.error('Token drift between docs/DESIGN.md and src/index.css:')
  for (const p of problems) console.error('  - ' + p)
  process.exit(1)
}
console.log(`Tokens match: ${live.size} colours in @theme and docs/DESIGN.md agree.`)
