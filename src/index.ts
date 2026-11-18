import { Hono } from 'hono'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', cors())

// Health check
app.get('/health', (c) => {
  return c.json({
    status: 'ok',
    service: 'social-content-hub',
    version: '0.1.0',
    environment: process.env.NODE_ENV || 'development',
  })
})

// Rota raiz
app.get('/', (c) => {
  return c.json({
    name: 'Social Content Hub',
    description: 'Sistema de criação e gerenciamento de publicações digitais integrado ao OpenCode',
    status: 'planejamento_concluido',
    etapa: 'implementacao_sprint_0',
  })
})

export default app
