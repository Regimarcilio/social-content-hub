import { Hono } from 'hono'
import editorialRoutes from './editorial/routes'
import researchRoutes from './research/routes'
import imagesRoutes from './images/routes'

const app = new Hono()

app.route('/editorial', editorialRoutes)
app.route('/research', researchRoutes)
app.route('/images', imagesRoutes)

export default app
