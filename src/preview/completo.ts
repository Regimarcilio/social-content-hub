// @ts-nocheck
import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../shared/db'
import {
  conteudosGerados,
  adaptacoesPlataforma,
  briefingsImagem,
  imagensGeradas,
  revisoesQualidade,
  seoMetadados,
  estadosPublicacao,
} from '../images/schema'
import { qualitySchema } from '../quality/schema'

const app = new Hono()

/**
 * Endpoint de prévisualização completa
 * Agrega: conteúdo, adaptação, imagem, qualidade, SEO, estado de publicação
 */
app.get('/completo/:materialId/:plataforma', async (c) => {
  const materialId = Number(c.req.param('materialId'))
  const plataforma = c.req.param('plataforma')

  // 1. Buscar material
  const [material] = await db
    .select()
    .from(conteudosGerados)
    .where(eq(conteudosGerados.id, materialId))

  if (!material) {
    return c.json({ error: 'Material não encontrado' }, 404)
  }

  // 2. Buscar adaptação para a plataforma
  const [adaptacao] = await db
    .select()
    .from(adaptacoesPlataforma)
    .where(eq(adaptacoesPlataforma.conteudoId, materialId))
    .where(eq(adaptacoesPlataforma.plataforma, plataforma))

  // 3. Buscar briefing e imagem definitiva
  const [briefing] = await db
    .select()
    .from(briefingsImagem)
    .where(eq(briefingsImagem.conteudoId, materialId))

  const [imagemDefinitiva] = await db
    .select()
    .from(imagensGeradas)
    .where(eq(imagensGeradas.briefingId, briefing?.id || 0))
    .where(eq(imagensGeradas.etapa, 'definitiva'))

  // 4. Buscar revisões de qualidade
  const revisoes = await db
    .select()
    .from(revisoesQualidade)
    .where(eq(revisoesQualidade.materialId, materialId))
    .where(eq(revisoesQualidade.plataforma, plataforma))

  const todosAprovados = revisoes.length > 0 && revisoes.every((r) => r.aprovado)

  // 5. Buscar SEO
  const [seo] = await db
    .select()
    .from(seoMetadados)
    .where(eq(seoMetadados.materialId, materialId))
    .where(eq(seoMetadados.plataforma, plataforma))

  // 6. Buscar estado de publicação
  const [estado] = await db
    .select()
    .from(estadosPublicacao)
    .where(eq(estadosPublicacao.materialId, materialId))
    .where(eq(estadosPublicacao.plataforma, plataforma))

  const dadosPreview = {
    materialId: material.id,
    plataforma,
    estado: estado?.estado || 'rascunho',
    aprovadoPor: estado?.aprovadoPor || null,
    aprovadoEm: estado?.aprovadoEm || null,
    publicadoEm: estado?.publicadoEm || null,
    titulo: seo?.titulo || material.titulo || '',
    conteudoOriginal: material.conteudoOriginal,
    conteudoAdaptado: adaptacao?.conteudoAdaptado || material.conteudoOriginal,
    hashtags: adaptacao?.hashtags || [],
    limiteCaracteres: adaptacao?.limiteCaracteres || 3000,
    palavrasChave: seo?.palavrasChave || material.palavrasChave || [],
    descricaoSeo: seo?.descricao || '',
    imagemCaminho: imagemDefinitiva?.caminhoArquivo || null,
    imagemResolucao: imagemDefinitiva
      ? `${imagemDefinitiva.resolucaoLargura}x${imagemDefinitiva.resolucaoAltura}`
      : null,
    imagemEtapa: imagemDefinitiva?.etapa || null,
    briefing: briefing
      ? {
          conceitoVisual: briefing.conceitoVisual,
          estiloArtistico: briefing.estiloArtistico,
          composicao: briefing.composicao,
          iluminacao: briefing.iluminacao,
          paletaCromatica: briefing.paletaCromatica,
          elementosVisuais: briefing.elementosVisuais,
          formato: briefing.formato,
          proporcao: briefing.proporcao,
        }
      : null,
    qualidade: {
      todosAprovados,
      totalCritérios: revisoes.length,
      aprovados: revisoes.filter((r) => r.aprovado).length,
      revisoes: revisoes.map((r) => ({
        critério: r.criterio,
        aprovado: r.aprovado,
        nota: r.nota,
        observações: r.observacoes,
      })),
    },
    seo: {
      título: seo?.titulo || '',
      palavrasChave: seo?.palavrasChave || [],
      descrição: seo?.descricao || '',
    },
    podePublicar: todosAprovados && !!estado && estado.estado === 'aprovado',
  }

  const html = gerarTemplateCompleto(dadosPreview)
  return c.html(html)
})

/**
 * Template HTML completo da prévisualização
 */
function gerarTemplateCompleto(d: any): string {
  const podePublicar = d.podePublicar
  const corEstado = d.estado === 'publicado' ? '#059669' : d.estado === 'aprovado' ? '#d97706' : '#6b7280'
  const corQualidade = d.qualidade.todosAprovados ? '#059669' : '#dc2626'

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prévisualização Completa - ${d.plataforma} - Social Content Hub</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .preview-card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    .badge { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .char-counter { font-size: 0.875rem; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
  </style>
</head>
<body class="bg-gray-50 min-h-screen">

  <!-- Header -->
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">SCH</div>
          <div>
            <div class="text-sm font-semibold text-gray-900">Social Content Hub</div>
            <div class="text-xs text-gray-500">Prévisualização Completa de Publicação</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <a href="/api/editorial" class="text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100">Voltar</a>
          ${!podePublicar ? `
          <button id="btnAprovar" class="text-white bg-indigo-600 px-5 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 ${!d.qualidade.todosAprovados ? 'disabled' : ''}">
            ✅ Aprovar e Publicar
          </button>
          ` : `
          <button class="text-white bg-green-600 px-5 py-2 rounded-md text-sm font-medium hover:bg-green-700">
            ✅ Publicado
          </button>
          `}
          <button id="btnExportar" class="text-gray-700 bg-white border border-gray-300 px-5 py-2 rounded-md text-sm font-medium hover:bg-gray-50">
            📤 Exportar Manual
          </button>
        </div>
      </div>
    </div>
  </header>

  <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">

    <!-- Status Geral -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
      <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</div>
        <div class="flex items-center gap-2 mt-1">
          <span class="status-dot" style="background-color: ${corEstado}"></span>
          <span class="font-medium text-gray-900 capitalize">${d.estado}</span>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">Qualidade</div>
        <div class="flex items-center gap-2 mt-1">
          <span class="status-dot" style="background-color: ${corQualidade}"></span>
          <span class="font-medium text-gray-900">${d.qualidade.aprovados}/${d.qualidade.totalCritérios} critérios</span>
        </div>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">Plataforma</div>
        <div class="font-medium text-gray-900 mt-1">${d.plataforma}</div>
      </div>
      <div class="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <div class="text-xs font-medium text-gray-500 uppercase tracking-wider">Limite</div>
        <div class="font-medium text-gray-900 mt-1">${d.limiteCaracteres} caracteres</div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">

      <!-- Coluna 1: Preview Visual -->
      <div class="lg:col-span-2">
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Prévisualização - ${d.plataforma}</h3>
            <p class="text-sm text-gray-500 mt-1">Como ficará ao ser publicada</p>
          </div>
          <div class="p-8 bg-white">
            <div class="flex items-start gap-4">
              <div class="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-sm">SCH</div>
              <div class="flex-1">
                <div class="flex items-center gap-2 mb-2">
                  <span class="text-sm font-medium text-gray-900">Social Content Hub</span>
                  <span class="text-xs text-gray-400">${d.plataforma} · Prévisualização</span>
                </div>
                <div class="prose prose-sm max-w-none" id="conteudoPreview">
                  ${(d.conteudoAdaptado || d.conteudoOriginal || '').replace(/\n/g, '<br>')}
                </div>
                ${d.hashtags.length > 0 ? `
                <div class="mt-4">
                  ${d.hashtags.map((h: string) => `<span class="inline-block px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded border border-indigo-100 mr-2 mb-1">#${h}</span>`).join('')}
                </div>
                ` : ''}
              </div>
            </div>
            ${d.imagemCaminho ? `
            <div class="mt-6">
              <img src="${d.imagemCaminho}" alt="Imagem da publicação" class="w-full h-64 object-cover rounded-lg border border-gray-200">
              <p class="text-xs text-gray-500 mt-2">Imagem: ${d.imagemResolucao || 'N/A'} | Etapa: ${d.imagemEtapa || 'N/A'}</p>
            </div>
            ` : `
            <div class="mt-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 p-6 text-center">
              <p class="text-sm text-gray-500">Nenhuma imagem gerada ainda</p>
            </div>
            `}
          </div>
        </div>
      </div>

      <!-- Coluna 2: Detalhes e Ações -->
      <div class="lg:col-span-1">
        
        <!-- Conteúdo Editável -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Editar Conteúdo</h3>
          </div>
          <div class="p-6">
            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-700 mb-1">Título</label>
              <input type="text" id="inputTitulo" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm" value="${d.titulo || ''}">
            </div>
            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-700 mb-1">Conteúdo</label>
              <textarea id="inputConteudo" rows="5" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm">${d.conteudoAdaptado || d.conteudoOriginal || ''}</textarea>
            </div>
            <div class="mb-4">
              <label class="block text-xs font-medium text-gray-700 mb-1">Hashtags (vírgula)</label>
              <input type="text" id="inputHashtags" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm" value="${d.hashtags.join(', ')}">
            </div>
            <div class="flex justify-end">
              <span id="contador" class="text-xs text-gray-500">0 / ${d.limiteCaracteres}</span>
            </div>
          </div>
        </div>

        <!-- Qualidade -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">Qualidade (${d.qualidade.aprovados}/${d.qualidade.totalCritérios})</h3>
          </div>
          <div class="p-6 space-y-3">
            ${d.qualidade.revisoes.map((r: any) => `
            <div class="flex items-center justify-between p-2 rounded border border-gray-100">
              <span class="text-sm text-gray-700 capitalize">${r.critério}</span>
              <div class="flex items-center gap-2">
                <span class="status-dot" style="background-color: ${r.aprovado ? '#059669' : '#dc2626'}"></span>
                <span class="text-xs font-medium ${r.aprovado ? 'text-green-600' : 'text-red-600'}">${r.aprovado ? 'OK' : 'FALHA'}</span>
                <span class="text-xs text-gray-500">(${r.nota || '-'})</span>
              </div>
            </div>
            `).join('')}
            ${d.qualidade.totalCritérios === 0 ? '<p class="text-sm text-gray-500 text-center">Nenhuma revisão ainda</p>' : ''}
          </div>
        </div>

        <!-- SEO -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm mb-6">
          <div class="px-6 py-4 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900">SEO</h3>
          </div>
          <div class="p-6 space-y-3">
            <div class="mb-2">
              <label class="block text-xs font-medium text-gray-700">Título</label>
              <p class="text-sm text-gray-900">${d.seo.título || 'Não definido'}</p>
            </div>
            <div class="mb-2">
              <label class="block text-xs font-medium text-gray-700">Palavras-chave</label>
              <p class="text-sm text-gray-900">${d.seo.palavrasChave.join(', ') || 'Não definidas'}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Descrição</label>
              <p class="text-sm text-gray-900">${d.seo.descrição || 'Não definida'}</p>
            </div>
          </div>
        </div>

        <!-- Ações -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
          <div class="space-y-3">
            <button id="btnSalvar" class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              💾 Salvar Alterações
            </button>
            <button id="btnExportar" class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
              📤 Exportar JSON
            </button>
            ${!podePublicar ? `
            <button id="btnAprovarFinal" class="w-full flex items-center justify-center px-4 py-2 text-white bg-indigo-600 border border-transparent rounded-md text-sm font-medium hover:bg-indigo-700 ${!d.qualidade.todosAprovados ? 'opacity-50 cursor-not-allowed' : ''}">
              ✅ ${d.qualidade.todosAprovados ? 'Aprovar e Publicar' : 'Aguardando Qualidade'}
            </button>
            ` : `
            <button class="w-full flex items-center justify-center px-4 py-2 text-white bg-green-600 border border-transparent rounded-md text-sm font-medium">
              ✅ Publicado
            </button>
            `}
          </div>
        </div>
      </div>
    </div>

  </main>

  <script>
    const limite = ${d.limiteCaracteres};
    const inputConteudo = document.getElementById('inputConteudo');
    const contador = document.getElementById('contador');
    
    function atualizarContador() {
      contador.textContent = inputConteudo.value.length + ' / ' + limite;
      contador.className = inputConteudo.value.length > limite ? 'text-xs text-red-600 font-medium' : 'text-xs text-gray-500';
    }
    inputConteudo.addEventListener('input', atualizarContador);
    atualizarContador();

    document.getElementById('btnExportar').addEventListener('click', async () => {
      const dados = {
        materialId: ${d.materialId},
        plataforma: '${d.plataforma}',
        titulo: document.getElementById('inputTitulo').value,
        conteudo: inputConteudo.value,
        hashtags: document.getElementById('inputHashtags').value.split(',').map(h => h.trim()).filter(Boolean),
        imagem: ${JSON.stringify(d.imagemCaminho)},
        estado: '${d.estado}',
        exportadoEm: new Date().toISOString()
      };
      const blob = new Blob([JSON.stringify(dados, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'preview_${d.plataforma}_${d.materialId}.json';
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById('btnAprovarFinal')?.addEventListener('click', async () => {
      if (!${d.qualidade.todosAprovados}) {
        alert('Não é possível aprovar: critérios de qualidade não atendidos.');
        return;
      }
      const resposta = await fetch('/api/quality/aprovar', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          materialId: ${d.materialId},
          plataforma: '${d.plataforma}',
          aprovadoPor: 'usuario_preview',
          estado: 'aprovado'
        })
      });
      if (resposta.ok) {
        alert('✅ Publicação aprovada!');
        window.location.reload();
      } else {
        alert('Erro ao aprovar.');
      }
    });
  </script>
</body>
</html>
  `
}

export default app
