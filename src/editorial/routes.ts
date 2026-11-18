import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../shared/db'
import {
  projetosEditoriais,
  plataformas,
  materiais,
} from './schema'
import {
  criarProjetoEditorialSchema,
  atualizarProjetoEditorialSchema,
  listarProjetosEditoriaisSchema,
  type CriarProjetoEditorialInput,
  type AtualizarProjetoEditorialInput,
  type ListarProjetosEditoriaisInput,
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

// Middleware simples de validação Zod para query params
const validarQuery = (schema: any) => async (c: any, next: any) => {
  const query: Record<string, string> = {}
  for (const [key, value] of c.req.raw.url.split('?')[1]?.split('&') || []) {
    const [k, v] = key.split('=')
    if (k) query[k] = v ? decodeURIComponent(v) : ''
  }
  const resultado = schema.safeParse(query)
  if (!resultado.success) {
    return c.json(
      { error: 'Erro de validação', detalhes: resultado.error.flatten().fieldErrors },
      400
    )
  }
  c.set('validatedQuery', resultado.data)
  await next()
}

// Listar projetos editoriais
app.get(
  '/',
  validarQuery(listarProjetosEditoriaisSchema),
  async (c) => {
    const input = c.get('validatedQuery') as ListarProjetosEditoriaisInput
    const { page, limit } = input
    const offset = (page - 1) * limit

    const [projetos, total] = await Promise.all([
      db.select().from(projetosEditoriais).limit(limit).offset(offset),
      db.select({ count: projetosEditoriais.id }).from(projetosEditoriais),
    ])

    return c.json({
      data: projetos,
      meta: {
        page,
        limit,
        total: total.length,
        totalPages: Math.ceil(total.length / limit),
      },
    })
  }
)

// Obter um projeto editorial por ID
app.get('/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const [projeto] = await db
    .select()
    .from(projetosEditoriais)
    .where(eq(projetosEditoriais.id, id))

  if (!projeto) {
    return c.json({ error: 'Projeto editorial não encontrado' }, 404)
  }

  return c.json(projeto)
})

// Criar projeto editorial
app.post(
  '/',
  validarBody(criarProjetoEditorialSchema),
  async (c) => {
    const input = c.get('validatedBody') as CriarProjetoEditorialInput

    const [projeto] = await db
      .insert(projetosEditoriais)
      .values({
        nome: input.nome,
        objetivo: input.objetivo ?? null,
        publicoAlvo: input.publicoAlvo ?? null,
        tomVoz: input.tomVoz ?? null,
        paletaCores: input.paletaCores,
        estiloImagens: input.estiloImagens ?? null,
        regrasRedacao: input.regrasRedacao,
        plataformas: input.plataformas,
        series: input.series,
        referencias: input.referencias,
      })
      .returning()

    return c.json(projeto, 201)
  }
)

// Atualizar projeto editorial
app.patch(
  '/:id',
  validarBody(atualizarProjetoEditorialSchema),
  async (c) => {
    const id = Number(c.req.param('id'))
    const input = c.get('validatedBody') as AtualizarProjetoEditorialInput

    const [existente] = await db
      .select()
      .from(projetosEditoriais)
      .where(eq(projetosEditoriais.id, id))

    if (!existente) {
      return c.json({ error: 'Projeto editorial não encontrado' }, 404)
    }

    const [projeto] = await db
      .update(projetosEditoriais)
      .set({
        ...input,
        atualizadoEm: new Date(),
      })
      .where(eq(projetosEditoriais.id, id))
      .returning()

    return c.json(projeto)
  }
)

// Deletar projeto editorial
app.delete('/:id', async (c) => {
  const id = Number(c.req.param('id'))

  const [existente] = await db
    .select()
    .from(projetosEditoriais)
    .where(eq(projetosEditoriais.id, id))

  if (!existente) {
    return c.json({ error: 'Projeto editorial não encontrado' }, 404)
  }

  await db.delete(projetosEditoriais).where(eq(projetosEditoriais.id, id))

  return c.json({ message: 'Projeto editorial removido com sucesso' })
})

// Listar plataformas disponíveis
app.get('/plataformas', async (c) => {
  const lista = await db.select().from(plataformas)
  return c.json(lista)
})

// Obter materiais de um projeto
app.get('/:id/materiais', async (c) => {
  const id = Number(c.req.param('id'))

  const [projeto] = await db
    .select()
    .from(projetosEditoriais)
    .where(eq(projetosEditoriais.id, id))

  if (!projeto) {
    return c.json({ error: 'Projeto editorial não encontrado' }, 404)
  }

  const lista = await db
    .select()
    .from(materiais)
    .where(eq(materiais.projetoId, id))

  return c.json(lista)
})

export default app
