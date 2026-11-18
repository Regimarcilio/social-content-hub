// @ts-nocheck
import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { execSync } from 'child_process'
import net from 'net'

const app = new Hono()

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
          <code class="bg-gray-100 p-2 rounded block mb-4 text-sm">GET http://localhost:${PORT}/preview/demo/:plataforma</p>
          <p class="text-gray-600 text-sm">Exemplo: <code>http://localhost:${PORT}/preview/demo/linkedin</code></p>
          <p class="mt-4 text-sm text-gray-500">O servidor tenta porta 3001 primeiro, depois 3002-3009 se necessário.</p>
        </div>
      </div>
    </body>
    </html>
  `)
})

// Carregar rotas de forma segura
let previewRoutes = null
try {
  previewRoutes = require('./completo').default
} catch (e) {
  console.log('⚠️  Rotas completas não disponíveis (banco de dados não configurado)')
}

let demoRoutes = null
try {
  demoRoutes = require('./demo').default
} catch (e) {
  console.log('⚠️  Rotas de demo não disponíveis')
}

if (previewRoutes) {
  app.route('/preview', previewRoutes)
}
if (demoRoutes) {
  app.route('/preview', demoRoutes)
}

// Função para verificar se uma porta está disponível
function portaDisponivel(port) {
  return new Promise((resolve) => {
    const servidor = net.createServer()
    servidor.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false)
      } else {
        resolve(false)
      }
    })
    servidor.once('listening', () => {
      servidor.close()
      resolve(true)
    })
    servidor.listen(port)
  })
}

// Encontrar a primeira porta disponível a partir de 3001
async function encontrarPortaDisponivel(portaInicial = 3001) {
  let porta = portaInicial
  while (porta < 3010) {
    if (await portaDisponivel(porta)) {
      return porta
    }
    porta++
  }
  throw new Error('Nenhuma porta disponível entre 3001 e 3009')
}

let PORT = 3001

encontrarPortaDisponivel(3001).then((portaEncontrada) => {
  PORT = portaEncontrada
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
}).catch((err) => {
  console.error('❌ Erro ao encontrar porta disponível:', err.message)
  process.exit(1)
})
