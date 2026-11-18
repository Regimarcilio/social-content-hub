import { Hono } from 'hono'
import editorialRoutes from './editorial/routes'
import researchRoutes from './research/routes'

const app = new Hono()

app.route('/editorial', editorialRoutes)
app.route('/research', researchRoutes)

export default app
