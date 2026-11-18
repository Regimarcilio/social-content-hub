import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../shared/db'
import {
  mcpIntegracao,
  publicacaoPlataforma,
} from './schema'
import {
  configurarMCPSchema,
  configurarPlataformaSchema,
  type ConfigurarMCPInput,
  type ConfigurarPlataformaInput,
} from './validation'
import {
  configurarMCP,
  listarMCPs,
  configurarPlataformaPublicacao,
  listarPlataformasPublicacao,
  publicarEmPlataforma,
} from './agent'

const app = new Hono()

// Middleware simples de validação Zod para body JSON
const validarBody = (schema: any) => async (c: any, next: any) => {
  const body = await c.req.json().catch(() => null)
  const resultado = schema.safeParse(body)
  if (!resultado.success) {
    return c.json(
      { error: 'Erro de validação', detalhes: resultado.error.flatten().fieldErrors },
      400
    )
  }
  c.set('validatedBody', resultado.data)
  await next()
}

// Configurar MCP
app.post(
  '/mcp',
  validarBody(configurarMCPSchema),
  async (c) => {
    const input = c.get('validatedBody') as ConfigurarMCPInput

    const resultado = await configurarMCP(
      input.nome,
      input.tipo,
      input.endpoint,
      input.autenticacao,
      input.permissoes
    )

    return c.json(resultado, 201)
  }
)

// Listar MCPs
app.get('/mcp', async (c) => {
  const lista = await listarMCPs()
  return c.json(lista)
})

// Configurar plataforma de publicação
app.post(
  '/plataformas',
  validarBody(configurarPlataformaSchema),
  async (c) => {
    const input = c.get('validatedBody') as ConfigurarPlataformaInput

    const resultado = await configurarPlataformaPublicacao(
      input.nome,
      input.ativo,
      input.apiUrl,
      input.autenticacao,
      input.credenciaisCriptografadas,
      input.limiteCaracteres,
      input.proporcoesImagem,
      input.permitePublicacaoAutomatica
    )

    return c.json(resultado, 201)
  }
)

// Listar plataformas de publicação
app.get('/plataformas', async (c) => {
  const lista = await listarPlataformasPublicacao()
  return c.json(lista)
)

// Publicar em plataforma social (acesso ao site de publicação)
app.post(
  '/plataformas/:nome/publicar',
  async (c) => {
    const nome = c.req.param('nome')
    const body = await c.req.json().catch(() => ({}))
    const { conteudo, credenciais } = body

    if (!conteudo || !credenciais) {
      return c.json({ error: 'conteudo e credenciais são obrigatórios' }, 400)
    }

    const resultado = await publicarEmPlataforma(nome, conteudo, credenciais)

    if (!resultado.sucesso) {
      return c.json({ error: resultado.erro }, 400)
    }

    return c.json(resultado, 201)
  }
)

export default app
