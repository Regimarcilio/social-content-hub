import { Hono } from 'hono'
import qualityRoutes from './quality/routes'

const app = new Hono()

app.route('/quality', qualityRoutes)

export default app
