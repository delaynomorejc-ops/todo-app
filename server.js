import express from 'express'
import { readFile, writeFile, rename } from 'fs/promises'
import { existsSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const DATA_FILE = resolve(__dirname, 'todos.json')
const STATIC_DIR = resolve(__dirname, 'frontend/dist')
const PORT = process.env.PORT ?? 3000

const app = express()
app.use(express.json({ limit: '10mb' }))

app.get('/api/todos', async (req, res) => {
  try {
    if (!existsSync(DATA_FILE)) return res.json({ tasks: [] })
    const raw = await readFile(DATA_FILE, 'utf8')
    const data = JSON.parse(raw)
    // migrate old format (array or { todos })
    if (Array.isArray(data) || (data.todos && !data.tasks)) return res.json({ tasks: [] })
    res.json(data)
  } catch {
    res.status(500).json({ error: 'Failed to read' })
  }
})

app.post('/api/todos', async (req, res) => {
  try {
    const { tasks } = req.body
    if (!Array.isArray(tasks)) return res.status(400).json({ error: 'tasks must be an array' })
    const tmp = DATA_FILE + '.tmp'
    await writeFile(tmp, JSON.stringify({ tasks }, null, 2), 'utf8')
    await rename(tmp, DATA_FILE)
    res.json({ ok: true })
  } catch {
    res.status(500).json({ error: 'Failed to save' })
  }
})

if (existsSync(STATIC_DIR)) {
  app.use(express.static(STATIC_DIR))
  app.get('*', (req, res) => res.sendFile(resolve(STATIC_DIR, 'index.html')))
} else {
  app.get('/', (req, res) => res.send('Run "npm run build" first, or use "npm run dev:client" for development.'))
}

app.listen(PORT, () => {
  console.log(`Todo app running on http://localhost:${PORT}`)
})
