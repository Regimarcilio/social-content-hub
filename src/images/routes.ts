import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../shared/db'
import {
  conteudosGerados,
  adaptacoesPlataforma,
  briefingsImagem,
  imagensGeradas,
} from './schema'
import {
  gerarConteudoSchema,
  adaptarConteudoSchema,
  criarBriefingImagemSchema,
  gerarImagemSchema,
  type GerarConteudoInput,
  type AdaptarConteudoInput,
  type CriarBriefingImagemInput,
  type GerarImagemInput,
} from './validation'
import {
  gerarConteudoOriginal,
} from '../agents/writer'
import {
  adaptarConteudoParaPlataformas,
} from '../agents/platform-adapter'
import {
  criarBriefingImagem,
} from '../agents/art-director'
import {
  gerarImagemDuasEtapas,
  avaliarConceito,
  selecionarConceito,
} from '../agents/image-creator'

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

// Gerar conteúdo original (Writer)
app.post(
  '/conteudos',
  validarBody(gerarConteudoSchema),
  async (c) => {
    const input = c.get('validatedBody') as GerarConteudoInput

    const resultado = await gerarConteudoOriginal(
      input.estrategiaId,
      input.assunto,
      input.profundidade
    )

    return c.json(resultado, 201)
  }
)

// Obter conteúdo por ID
app.get('/conteudos/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const [conteudo] = await db
    .select()
    .from(conteudosGerados)
    .where(eq(conteudosGerados.id, id))

  if (!conteudo) {
    return c.json({ error: 'Conteúdo não encontrado' }, 404)
  }

  return c.json(conteudo)
)

// Adaptar conteúdo para plataformas (Platform Adapter)
app.post(
  '/conteudos/:id/adaptar',
  validarBody(adaptarConteudoSchema),
  async (c) => {
    const id = Number(c.req.param('id'))
    const input = c.get('validatedBody') as AdaptarConteudoInput

    const resultado = await adaptarConteudoParaPlataformas(id, input.plataformas)

    return c.json(resultado, 201)
  }
)

// Obter adaptações de um conteúdo
app.get('/conteudos/:id/adaptacoes', async (c) => {
  const id = Number(c.req.param('id'))
  const lista = await db
    .select()
    .from(adaptacoesPlataforma)
    .where(eq(adaptacoesPlataforma.conteudoId, id))

  return c.json(lista)
})

// Criar briefing de imagem (Art Director)
app.post(
  '/briefings',
  validarBody(criarBriefingImagemSchema),
  async (c) => {
    const input = c.get('validatedBody') as CriarBriefingImagemInput

    const resultado = await criarBriefingImagem(input.conteudoId, {
      estiloImagens: input.estiloArtistico,
      paletaCores: input.paletaCromatica.split(','),
    })

    return c.json(resultado, 201)
  }
)

// Obter briefing por ID
app.get('/briefings/:id', async (c) => {
  const id = Number(c.req.param('id'))
  const [briefing] = await db
    .select()
    .from(briefingsImagem)
    .where(eq(briefingsImagem.id, id))

  if (!briefing) {
    return c.json({ error: 'Briefing não encontrado' }, 404)
  }

  return c.json(briefing)
)

// Gerar imagem em duas etapas (Image Creator)
app.post(
  '/imagens',
  validarBody(gerarImagemSchema),
  async (c) => {
    const input = c.get('validatedBody') as GerarImagemInput

    const resultado = await gerarImagemDuasEtapas(
      input.briefingId,
      input.etapa,
      input.selecionarConceito
    )

    return c.json(resultado, 201)
  }
)

// Avaliar conceito visual
app.patch(
  '/imagens/:id/avaliar',
  async (c) => {
    const id = Number(c.req.param('id'))
    const body = await c.req.json().catch(() => ({}))
    const aprovado = body.aprovado === true

    const resultado = await avaliarConceito(id, aprovado)

    return c.json(resultado)
  }
)

// Selecionar conceito para imagem definitiva
app.patch(
  '/imagens/:id/selecionar',
  async (c) => {
    const id = Number(c.req.param('id'))
    const resultado = await selecionarConceito(id)

    return c.json(resultado)
  }
)

// Obter imagens de um briefing
app.get('/briefings/:id/imagens', async (c) => {
  const id = Number(c.req.param('id'))
  const lista = await db
    .select()
    .from(imagensGeradas)
    .where(eq(imagensGeradas.briefingId, id))

  return c.json(lista)
})

export default app
