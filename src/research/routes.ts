// @ts-nocheck
import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../shared/db'
import { pesquisas, estrategias } from './schema'
import {
  criarPesquisaSchema,
  criarEstrategiaSchema,
  type CriarPesquisaInput,
  type CriarEstrategiaInput,
} from './validation'

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

// Criar pesquisa
app.post(
  '/',
  validarBody(criarPesquisaSchema),
  async (c) => {
    const input = c.get('validatedBody') as CriarPesquisaInput

    const [pesquisa] = await db
      .insert(pesquisas)
      .values({
        projetoId: input.projetoId,
        assunto: input.assunto,
        fontes: input.fontes,
        resumo: null,
      })
      .returning()

    return c.json(pesquisa, 201)
  }
)

// Obter pesquisa por ID
app.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const [pesquisa] = await db.select().from(pesquisas).where(eq(pesquisas.id, id))

  if (!pesquisa) {
    return c.json({ error: 'Pesquisa não encontrada' }, 404)
  }

  return c.json(pesquisa)
})

// Criar estratégia
app.post(
  '/estrategias',
  validarBody(criarEstrategiaSchema),
  async (c) => {
    const input = c.get('validatedBody') as CriarEstrategiaInput

    const [estrategia] = await db
      .insert(estrategias)
      .values({
        pesquisaId: input.pesquisaId,
        publicoAlvo: input.publicoAlvo,
        objetivo: input.objetivo,
        abordagem: input.abordagem,
        tomVoz: input.tomVoz ?? null,
        plataformas: input.plataformas,
      })
      .returning()

    return c.json(estrategia, 201)
  }
)

// Obter estratégia por ID
app.get('/estrategias/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const [estrategia] = await db.select().from(estrategias).where(eq(estrategias.id, id))

  if (!estrategia) {
    return c.json({ error: 'Estratégia não encontrada' }, 404)
  }

  return c.json(estrategia)
})

// Listar pesquisas de um projeto
app.get('/projeto/:projetoId', async (c) => {
  const projetoId = Number(c.req.param('projetoId'))
  const lista = await db
    .select()
    .from(pesquisas)
    .where(eq(pesquisas.projetoId, projetoId))

  return c.json(lista)
})

export default app
