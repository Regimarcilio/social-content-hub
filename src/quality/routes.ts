// @ts-nocheck
import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../shared/db'
import {
  revisoesQualidade,
  seoMetadados,
  exportacoesPublicacao,
  estadosPublicacao,
  conteudosGerados,
} from './schema'
import {
  revisarQualidadeSchema,
  definirSeoSchema,
  aprovarPublicacaoSchema,
  exportarPublicacaoSchema,
  type RevisarQualidadeInput,
  type DefinirSeoInput,
  type AprovarPublicacaoInput,
  type ExportarPublicacaoInput,
} from './validation'
import { revisarQualidade, todosCritériosAprovados } from '../agents/quality-reviewer'
import { definirSeo } from '../agents/seo-specialist'

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

// Revisar qualidade (Quality Reviewer)
app.post(
  '/revisao',
  validarBody(revisarQualidadeSchema),
  async (c) => {
    const input = c.get('validatedBody') as RevisarQualidadeInput

    const resultados = await revisarQualidade(
      input.materialId,
      input.plataforma,
      input.revisadoPor
    )

    const todosAprovados = await todosCritériosAprovados(input.materialId, input.plataforma)

    return c.json({
      resultados,
      todosCritériosAprovados,
      podeAvançar: todosAprovados,
    }, 201)
  }
)

// Obter revisões de qualidade de um material
app.get('/revisao/:materialId/:plataforma', async (c) => {
  const materialId = Number(c.req.param('materialId'))
  const plataforma = c.req.param('plataforma')

  const lista = await db
    .select()
    .from(revisoesQualidade)
    .where(eq(revisoesQualidade.materialId, materialId))
    .where(eq(revisoesQualidade.plataforma, plataforma))

  return c.json(lista)
});

// Definir SEO (SEO Specialist)
app.post(
  '/seo',
  validarBody(definirSeoSchema),
  async (c) => {
    const input = c.get('validatedBody') as DefinirSeoInput

    const resultado = await definirSeo(
      input.materialId,
      input.plataforma,
      input.titulo,
      input.palavrasChave,
      input.descricao
    )

    return c.json(resultado, 201)
  }
)

// Obter SEO de um material
app.get('/seo/:materialId/:plataforma', async (c) => {
  const materialId = Number(c.req.param('materialId'))
  const plataforma = c.req.param('plataforma')

  const seo = await db
    .select()
    .from(seoMetadados)
    .where(eq(seoMetadados.materialId, materialId))
    .where(eq(seoMetadados.plataforma, plataforma))

  return c.json(seo)
});

// Aprovar publicação (aprovação humana)
app.post(
  '/aprovar',
  validarBody(aprovarPublicacaoSchema),
  async (c) => {
    const input = c.get('validatedBody') as AprovarPublicacaoInput

    // Verificar se todos os critérios de qualidade foram aprovados (se estado for 'aprovado' ou 'publicado')
    if (input.estado === 'aprovado' || input.estado === 'publicado') {
      const qualidadeOk = await todosCritériosAprovados(input.materialId, input.plataforma)
      if (!qualidadeOk) {
        return c.json(
          { error: 'Não é possível aprovar: critérios de qualidade não atendidos' },
          400
        )
      }
    }

    const [estado] = await db
      .insert(estadosPublicacao)
      .values({
        materialId: input.materialId,
        plataforma: input.plataforma,
        estado: input.estado,
        aprovadoPor: input.aprovadoPor,
        aprovadoEm: input.estado === 'aprovado' || input.estado === 'publicado' ? new Date() : null,
        publicadoEm: input.estado === 'publicado' ? new Date() : null,
      })
      .returning()

    return c.json(estado, 201)
  }
)

// Obter estado de publicação de um material
app.get('/estado/:materialId/:plataforma', async (c) => {
  const materialId = Number(c.req.param('materialId'))
  const plataforma = c.req.param('plataforma')

  const lista = await db
    .select()
    .from(estadosPublicacao)
    .where(eq(estadosPublicacao.materialId, materialId))
    .where(eq(estadosPublicacao.plataforma, plataforma))

  return c.json(lista)
})

// Exportar para publicação manual
app.post(
  '/exportar',
  validarBody(exportarPublicacaoSchema),
  async (c) => {
    const input = c.get('validatedBody') as ExportarPublicacaoInput

    const [material] = await db
      .select()
      .from(conteudosGerados)
      .where(eq(conteudosGerados.id, input.materialId))

    if (!material) {
      return c.json({ error: 'Material não encontrado' }, 404)
    }

    const conteudoExportado = {
      materialId: material.id,
      assunto: material.assunto,
      conteudoOriginal: material.conteudoOriginal,
      plataforma: input.plataforma,
      formato: input.formato,
      exportadoEm: new Date().toISOString(),
      exportadoPor: input.exportadoPor,
    }

    let conteudoString: string
    let caminhoArquivo: string | null = null

    if (input.formato === 'json') {
      conteudoString = JSON.stringify(conteudoExportado, null, 2)
    } else if (input.formato === 'markdown') {
      conteudoString = `# ${material.assunto}\n\n${material.conteudoOriginal}\n\n---\n*Exportado para ${input.plataforma} em ${new Date().toISOString()}*`
    } else {
      conteudoString = `${material.assunto}\n\n${material.conteudoOriginal}`
    }

    const [exportacao] = await db
      .insert(exportacoesPublicacao)
      .values({
        materialId: input.materialId,
        plataforma: input.plataforma,
        formato: input.formato,
        caminhoArquivo,
        conteudoExportado,
        exportadoPor: input.exportadoPor,
      })
      .returning()

    return c.json({
      id: exportacao.id,
      plataforma: input.plataforma,
      formato: input.formato,
      conteudo: conteudoExportado,
      caminhoArquivo,
      exportadoEm: exportacao.exportadoEm,
      exportadoPor: input.exportadoPor,
    }, 201)
  }
)

// Obter exportações de um material
app.get('/exportacoes/:materialId', async (c) => {
  const materialId = Number(c.req.param('materialId'))

  const lista = await db
    .select()
    .from(exportacoesPublicacao)
    .where(eq(exportacoesPublicacao.materialId, materialId))

  return c.json(lista)
})

export default app
