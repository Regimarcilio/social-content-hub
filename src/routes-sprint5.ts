import { Hono } from 'hono'
import memoryRoutes from './memory/routes'
import costsRoutes from './costs/routes'
import platformsRoutes from './platforms/routes'

const app = new Hono()

app.route('/memory', memoryRoutes)
app.route('/costs', costsRoutes)
app.route('/platforms', platformsRoutes)

export default app
