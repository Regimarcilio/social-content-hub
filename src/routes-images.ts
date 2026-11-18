import { Hono } from 'hono'
import imagesRoutes from './images/routes'

const app = new Hono()

app.route('/images', imagesRoutes)

export default app
