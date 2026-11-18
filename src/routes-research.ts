import { Hono } from 'hono'
import researchRoutes from './research/routes'

const app = new Hono()

app.route('/research', researchRoutes)

export default app
