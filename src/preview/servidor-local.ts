// @ts-nocheck
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import previewCompletoRoutes from './completo'
import { execSync } from 'child_process'

const app = new Hono()

app.route('/preview', previewCompletoRoutes)

app.get('/', (c) => {
  return c.html(`
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <title>Social Content Hub - Prévisualização</title>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-gray-50 p-8">
      <div class="max-w-2xl mx-auto">
        <h1 class="text-2xl font-bold text-gray-900 mb-6">Social Content Hub</h1>
        <p class="text-gray-600 mb-6">Servidor de prévisualização rodando em localhost</p>
        <div class="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <h2 class="text-lg font-semibold mb-4">Como usar</h2>
          <p class="mb-4">Acesse a prévisualização de uma publicação:</p>
          <code class="bg-gray-100 p-2 rounded block mb-4 text-sm">GET http://localhost:3001/preview/completo/:materialId/:plataforma</p>
          <p class="text-gray-600 text-sm">Exemplo: <code>http://localhost:3001/preview/completo/1/linkedin</code></p>
        </div>
      </div>
    </body>
    </html>
  `)
})

const PORT = 3001
serve({
  fetch: app.fetch,
  port: PORT,
}, (info) => {
  console.log(`🚀 Servidor de prévisualização rodando em http://localhost:${info.port}`)
  
  // Abrir navegador automaticamente
  try {
    execSync(`open http://localhost:${info.port}`, { stdio: 'ignore' })
  } catch (e) {
    try {
      execSync(`xdg-open http://localhost:${info.port}`, { stdio: 'ignore' })
    } catch (e2) {
      console.log('Não foi possível abrir o navegador automaticamente. Acesse manualmente.')
    }
  }
})
