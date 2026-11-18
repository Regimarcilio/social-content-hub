import { Hono } from 'hono'
import editorialRoutes from './editorial/routes'

const app = new Hono()

app.route('/editorial', editorialRoutes)

export default app
