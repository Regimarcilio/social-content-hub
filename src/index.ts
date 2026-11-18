import { Hono } from 'hono'
import { cors } from 'hono/cors'
import routes from './routes'

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
    status: 'implementacao_em_andamento',
    etapa: 'sprint_3_redacao_adaptacao_imagens',
  })
})

app.route('/api', routes)

export default app
