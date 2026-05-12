import dotenv from 'dotenv'
import { createApp, logJwtWarningsIfNeeded } from './app.js'
import { InMemoryStore } from './persistence/InMemoryStore.js'
import { defaultMuseumSeed } from './persistence/seedData.js'

dotenv.config()

const port = Number(process.env.PORT) || 3001
const seed = defaultMuseumSeed()
const store = new InMemoryStore(seed)
const app = createApp(store)

app.listen(port, () => {
  logJwtWarningsIfNeeded()
  console.log(`API listening on http://localhost:${port}`)
})
