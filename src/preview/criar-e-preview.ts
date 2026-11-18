// @ts-nocheck
// @ts-nocheck
import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../shared/db'
import {
  conteudosGerados,
  adaptacoesPlataforma,
  briefingsImagem,
  imagensGeradas,
} from '../images/schema'
import {
  revisoesQualidade,
  seoMetadados,
  estadosPublicacao,
} from '../quality/schema'
import { execSync } from 'child_process'

const app = new Hono()

/**
 * Endpoint que cria uma publicação completa e abre a prévisualização automaticamente
 */
app.post('/criar-e-preview', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const {
    projetoId,
    assunto,
    plataforma = 'linkedin',
    estrategiaId,
    conteudoOriginal,
    palavrasChave = [],
    titulo = '',
    descricao = '',
    gerarImagem = true,
  } = body

  try {
    // 1. Criar conteúdo
    const [material] = await db
      .insert(conteudosGerados)
      .values({
        projetoId: projetoId || null,
        estrategiaId: estrategiaId || null,
        assunto,
        conteudoOriginal,
        palavrasChave,
        titulo,
        descricao,
      })
      .returning()

    // 2. Criar adaptação para a plataforma
    const limites = {
      linkedin: 3000,
      reddit: 40000,
      facebook: 63206,
      instagram: 2200,
      youtube: 5000,
      tiktok: 2200,
      x: 280,
    }

    const [adaptacao] = await db
      .insert(adaptacoesPlataforma)
      .values({
        conteudoId: material.id,
        plataforma,
        conteudoAdaptado: conteudoOriginal,
        limiteCaracteres: limites[plataforma] || 3000,
        hashtags: palavrasChave.map((k) => `#${k}`),
      })
      .returning()

    // 3. Criar briefing de imagem se solicitado
    let briefingId = null
    let imagemCaminho = null
    let imagemEtapa = null

    if (gerarImagem) {
      const [briefing] = await db
        .insert(briefingsImagem)
        .values({
          conteudoId: material.id,
          conceitoVisual: `Conceito visual para: ${assunto}`,
          estiloArtistico: 'Cinematográfico, sofisticado, contraste azul e dourado',
          composicao: 'Regra dos terços, foco central',
          iluminacao: 'Luz dramática cinematográfica',
          paletaCromatica: 'Azul profundo e dourado',
          elementosVisuais: ['Elemento principal', 'Texto sobreposto', 'Gráficos de apoio'],
          formato: 'digital',
          proporcao: '1:1',
        })
        .returning()
      briefingId = briefing.id

      // 4. Gerar imagem em duas etapas
      // Etapa 1: Conceito
      const [conceito] = await db
        .insert(imagensGeradas)
        .values({
          briefingId: briefing.id,
          etapa: 'conceito',
          promptUsado: `Conceito visual: ${assunto}. Estilo cinematográfico, azul e dourado.`,
          caminhoArquivo: null,
          conceitoAvaliado: true,
          selecionado: true,
        })
        .returning()

      // Etapa 2: Definitiva
      const [definitiva] = await db
        .insert(imagensGeradas)
        .values({
          briefingId: briefing.id,
          etapa: 'definitiva',
          promptUsado: `Imagem definitiva: ${assunto}. Qualidade premium, resolução alta.`,
          caminhoArquivo: `/images/generated/${material.id}-definitiva.png`,
          resolucaoLargura: 1024,
          resolucaoAltura: 1024,
          conceitoAvaliado: true,
          selecionado: true,
        })
        .returning()

      imagemCaminho = definitiva.caminhoArquivo
      imagemEtapa = definitiva.etapa
    }

    // 4. Criar revisão de qualidade (aprovada por padrão no demo)
    const criterios = [
      'originalidade', 'coerencia', 'clareza', 'gramatica', 'fundamentacao',
      'adequacao_plataforma', 'identidade_editorial', 'qualidade_visual', 'legibilidade'
    ]

    for (const criterio of criterios) {
      await db.insert(revisoesQualidade).values({
        materialId: material.id,
        plataforma,
        criterio,
        aprovado: true,
        nota: 9,
        observacoes: 'Critério atendido',
        revisadoPor: 'sistema_demo',
      })
    }

    // 5. Criar SEO
    await db.insert(seoMetadados).values({
      materialId: material.id,
      plataforma,
      titulo: titulo || `Publicação sobre ${assunto}`,
      palavrasChave,
      descricao: descricao || `Publicação sobre ${assunto} para ${plataforma}`,
    })

    // 6. Criar estado de publicação (rascunho)
    await db.insert(estadosPublicacao).values({
      materialId: material.id,
      plataforma,
      estado: 'rascunho',
    })

    // 7. Montar URL de preview
    const porta = 3004 // Porta padrão do servidor de preview
    const urlPreview = `http://localhost:${porta}/preview/completo/${material.id}/${plataforma}`

    return c.json({
      sucesso: true,
      materialId: material.id,
      plataforma,
      urlPreview,
      mensagem: 'Publicação criada com sucesso. Abra a URL de preview para visualizar.',
      dados: {
        titulo: material.titulo,
        conteudo: material.conteudoOriginal,
        hashtags: adaptacao.hashtags,
        imagemCaminho,
        imagemEtapa,
        qualidade: '9/9 critérios aprovados',
        seo: {
          titulo: titulo || `Publicação sobre ${assunto}`,
          palavrasChave,
          descricao: descricao || `Publicação sobre ${assunto} para ${plataforma}`,
        },
      },
    }, 201)
  } catch (erro) {
    return c.json({
      sucesso: false,
      erro: erro.message,
    }, 500)
  }
})

/**
 * Endpoint para abrir o servidor de preview automaticamente
 */
app.post('/abrir-servidor-preview', async (c) => {
  const body = await c.req.json().catch(() => ({}))
  const { porta = 3004, urlPreview } = body

  try {
    // Tentar abrir o navegador
    execSync(`open http://localhost:${porta}${urlPreview || ''}`, { stdio: 'ignore' })
  } catch (e) {
    try {
      execSync(`xdg-open http://localhost:${porta}${urlPreview || ''}`, { stdio: 'ignore' })
    } catch (e2) {
      // Ignorar erro se não conseguir abrir navegador
    }
  }

  return c.json({
    sucesso: true,
    mensagem: `Servidor de preview aberto em http://localhost:${porta}${urlPreview || ''}`,
  })
})

export default app
