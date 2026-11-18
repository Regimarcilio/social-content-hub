/**
 * Agregador de rotas da Sprint 2 (Pesquisa e Estratégia)
 */

import { Hono } from 'hono'
import researchRoutes from './research/routes'

const app = new Hono()

app.route('/research', researchRoutes)

export default app
