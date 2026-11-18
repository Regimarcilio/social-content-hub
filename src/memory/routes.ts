// @ts-nocheck
import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../shared/db'
import {
  versoesMaterial,
  historicoPublicacoes,
  seriesEditoriais,
  conteudosGerados,
} from './schema'
import {
  criarVersaoSchema,
  registrarPublicacaoSchema,
  type CriarVersaoInput,
  type RegistrarPublicacaoInput,
} from './validation'
import {
  criarVersao,
  listarVersoes,
  registrarPublicacaoHistorico,
  listarHistoricoPublicacoes,
  criarOuAtualizarSerieEditorial,
  obterContinuidadeSerie,
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

// Criar versão de material
app.post(
  '/versoes',
  validarBody(criarVersaoSchema),
  async (c) => {
    const input = c.get('validatedBody') as CriarVersaoInput

    const resultado = await criarVersao(
      input.materialId,
      input.versao,
      input.conteudo,
      input.alteracoes || '',
      input.criadoPor
    )

    return c.json(resultado, 201)
  }
)

// Listar versões de um material
app.get('/versoes/:materialId', async (c) => {
  const materialId = Number(c.req.param('materialId'))
  const lista = await listarVersoes(materialId)
  return c.json(lista)
})

// Registrar publicação no histórico
app.post(
  '/historico',
  validarBody(registrarPublicacaoSchema),
  async (c) => {
    const input = c.get('validatedBody') as RegistrarPublicacaoInput

    const resultado = await registrarPublicacaoHistorico(
      input.projetoId,
      input.materialId,
      input.plataforma,
      input.estado,
      input.urlPublicacao
    )

    return c.json(resultado, 201)
  }
)

// Listar histórico de publicações de um projeto
app.get('/historico/:projetoId', async (c) => {
  const projetoId = Number(c.req.param('projetoId'))
  const lista = await listarHistoricoPublicacoes(projetoId)
  return c.json(lista)
})

// Criar ou atualizar série editorial
app.post(
  '/series',
  async (c) => {
    const body = await c.req.json().catch(() => ({}))
    const { projetoId, nome, descricao, numeroEpisodio } = body

    if (!projetoId || !nome) {
      return c.json({ error: 'projetoId e nome são obrigatórios' }, 400)
    }

    const resultado = await criarOuAtualizarSerieEditorial(
      projetoId,
      nome,
      descricao || '',
      numeroEpisodio || 1
    )

    return c.json(resultado, 201)
  }
)

// Obter continuidade de uma série
app.get('/series/:projetoId/:nomeSerie', async (c) => {
  const projetoId = Number(c.req.param('projetoId'))
  const nomeSerie = c.req.param('nomeSerie')

  const resultado = await obterContinuidadeSerie(projetoId, nomeSerie)
  return c.json(resultado)
})

export default app
