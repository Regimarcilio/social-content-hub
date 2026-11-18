import { Hono } from 'hono'
import editorialRoutes from './editorial/routes'
import researchRoutes from './research/routes'
import imagesRoutes from './images/routes'
import qualityRoutes from './quality/routes'
import memoryRoutes from './memory/routes'
import costsRoutes from './costs/routes'
import platformsRoutes from './platforms/routes'
import previewRoutes from './preview/completo'
import demoRoutes from './preview/demo'
import criarEPReviewRoutes from './preview/criar-e-preview'
import gerarImagemRealRoutes from './preview/gerar-imagem-real'

const app = new Hono()

app.route('/editorial', editorialRoutes)
app.route('/research', researchRoutes)
app.route('/images', imagesRoutes)
app.route('/quality', qualityRoutes)
app.route('/memory', memoryRoutes)
app.route('/costs', costsRoutes)
app.route('/platforms', platformsRoutes)
app.route('/preview', previewRoutes)
app.route('/preview', demoRoutes)
app.route('/preview', criarEPReviewRoutes)
app.route('/preview', gerarImagemRealRoutes)

export default app
