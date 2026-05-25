import { writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spec } from './spec.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outPath = resolve(__dirname, '..', '..', '..', 'public', 'api-spec.json')

writeFileSync(outPath, JSON.stringify(spec, null, 2), 'utf-8')
console.log(`✓ OpenAPI spec written to ${outPath}`)
