// @ts-nocheck
import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../shared/db'
import {
  custosPublicacao,
  limitesUso,
  cacheSemantico,
} from './schema'
import {
  registrarCustoSchema,
  atualizarLimiteUsoSchema,
  type RegistrarCustoInput,
  type AtualizarLimiteUsoInput,
} from './validation'
import {
  registrarCusto,
  calcularCustoPorProjeto,
  calcularCustoPorPublicacao,
  atualizarLimiteUso,
  verificarLimite,
  registrarCacheSemantico,
  buscarCacheSemantico,
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

// Registrar custo de publicação
app.post(
  '/custos',
  validarBody(registrarCustoSchema),
  async (c) => {
    const input = c.get('validatedBody') as RegistrarCustoInput

    const resultado = await registrarCusto(
      input.projetoId,
      input.plataforma,
      input.modeloUsado,
      input.tokensEntrada,
      input.tokensSaida,
      parseFloat(input.custo),
      input.latenciaMs,
      input.materialId
    )

    return c.json(resultado, 201)
  }
)

// Calcular custo por projeto
app.get('/custos/projeto/:projetoId', async (c) => {
  const projetoId = Number(c.req.param('projetoId'))
  const resultado = await calcularCustoPorProjeto(projetoId)
  return c.json(resultado)
})

// Calcular custo médio por publicação
app.get('/custos/media/:projetoId', async (c) => {
  const projetoId = Number(c.req.param('projetoId'))
  const resultado = await calcularCustoPorPublicacao(projetoId)
  return c.json(resultado)
})

// Atualizar limite de uso
app.post(
  '/limites',
  validarBody(atualizarLimiteUsoSchema),
  async (c) => {
    const input = c.get('validatedBody') as AtualizarLimiteUsoInput

    const resultado = await atualizarLimiteUso(
      input.projetoId,
      input.tipo,
      input.usado
    )

    return c.json(resultado, 201)
  }
)

// Verificar se limite foi excedido
app.get(
  '/limites/verificar/:projetoId/:tipo/:limite',
  async (c) => {
    const projetoId = Number(c.req.param('projetoId'))
    const tipo = c.req.param('tipo')
    const limite = Number(c.req.param('limite'))

    const resultado = await verificarLimite(projetoId, tipo, limite)
    return c.json(resultado)
  }
)

// Registrar cache semântico
app.post(
  '/cache',
  async (c) => {
    const body = await c.req.json().catch(() => ({}))
    const { chave, resposta, modeloUsado, tokens, expiraEm } = body

    if (!chave || !resposta || !modeloUsado) {
      return c.json({ error: 'chave, resposta e modeloUsado são obrigatórios' }, 400)
    }

    const resultado = await registrarCacheSemantico(
      chave,
      resposta,
      modeloUsado,
      tokens || 0,
      expiraEm ? new Date(expiraEm) : new Date(Date.now() + 3600000) // 1h padrão
    )

    return c.json(resultado, 201)
  }
)

// Buscar cache semântico
app.get('/cache/:chave', async (c) => {
  const chave = c.req.param('chave')
  const resultado = await buscarCacheSemantico(chave)
  return c.json(resultado)
})

export default app
