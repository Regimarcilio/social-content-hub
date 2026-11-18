// @ts-nocheck
// @ts-nocheck
import { Hono } from 'hono'

const app = new Hono()

/**
 * Rota de demonstração com material exemplo pré-preenchido
 * Permite testar a prévisualização sem precisar de banco de dados
 */
app.get('/demo/:plataforma', (c) => {
  const plataforma = c.req.param('plataforma')

  const limites = {
    linkedin: 3000,
    reddit: 40000,
    facebook: 63206,
    instagram: 2200,
    youtube: 5000,
    tiktok: 2200,
    x: 280,
  }

  const limite = limites[plataforma] || 3000

  const conteudoAdaptado = `🚨 Mais código ≠ mais software entregue

A IA escreve código cada vez mais rápido. Mas isso não está entregando mais software em produção.

📊 O que os dados mostram (Harvard CEDIS/UnB, 2026 — 720k profissionais, 655 empresas):
• Linhas de código: +44%
• Commits: +36%
• Pull requests: +35,7%
• Issues resolvidas: +13,7%
• Epics concluídos: +18%

Mais atividade, menos entrega proporcional.

⚠️ O relatório Faros AI Engineering 2026 (22k desenvolvedores) alerta:
• Bugs por desenvolvedor: +54%
• Incidentes por PR: +242,7%
• Tempo médio de revisão: 5X maior

O gargalo não está na escrita. Está na revisão.

82,8% das revisões são feitas por quem já conhece a base. 75,7% das revisões de seniores são feitas por outros seniores. Essa capacidade não se amplia por decreto.

Como Sun Tzu: "Todo homem vê as táticas da vitória. Ninguém vê a estratégia."

A estratégia da engenharia na era da IA não é escrever mais código. É revisar melhor, decidir o que construir, manter o humano no centro.`

  const hashtags = ['EngenhariaDeSoftware', 'IA', 'RevisaoDeCodigo', 'QualidadeDeSoftware', 'DevOps', 'Produtividade', 'SunTzu', 'Tecnologia']

  const dadosPreview = {
    materialId: 1,
    plataforma,
    estado: 'aprovado',
    aprovadoPor: 'usuario_preview',
    aprovadoEm: new Date().toISOString(),
    publicadoEm: null,
    titulo: 'Mais código não é mais software. O novo gargalo da engenharia é a revisão humana.',
    conteudoOriginal: conteudoAdaptado,
    conteudoAdaptado: conteudoAdaptado,
    hashtags: hashtags,
    limiteCaracteres: limite,
    palavrasChave: ['IA engenharia de software', 'revisão de código', 'agentes de IA', 'qualidade de software', 'DevOps'],
    descricaoSeo: 'A IA acelera a escrita de código, mas o gargalo da engenharia de software mudou para a revisão humana. Estudo da Harvard e relatório Faros 2026 mostram que mais código não significa mais software entregue.',
    imagemCaminho: null,
    imagemResolucao: null,
    imagemEtapa: null,
    briefing: {
      conceitoVisual: 'Guerreiro antigo observando código fluindo como rio digital, balança equilibrando código vs software',
      estiloArtistico: 'Cinematográfico, sofisticado, contraste azul e dourado',
      composicao: 'Regra dos terços, guerreiro à esquerda, código à direita, balança no centro',
      iluminacao: 'Luz dramática chiaroscuro, destaque dourado na balança',
      paletaCromatica: 'Azul profundo (#1e3a8a), dourado (#d4af37), branco, cinza escuro',
      elementosVisuais: ['Espada antiga', 'Linhas de código', 'Balança de justiça', 'Nuvens digitais'],
      formato: 'digital',
      proporcao: '1:1',
    },
    qualidade: {
      todosAprovados: true,
      totalCritérios: 9,
      aprovados: 9,
      revisoes: [
        { critério: 'originalidade', aprovado: true, nota: 9, observações: 'Conteúdo autoral baseado em estudos reais' },
        { critério: 'coerencia', aprovado: true, nota: 9, observações: 'Fluxo lógico: problema → dados → solução' },
        { critério: 'clareza', aprovado: true, nota: 8, observações: 'Linguagem direta, parágrafos curtos' },
        { critério: 'gramatica', aprovado: true, nota: 10, observações: 'Português brasileiro correto' },
        { critério: 'fundamentacao', aprovado: true, nota: 10, observações: 'Fontes citadas (Harvard, Faros, CEDIS)' },
        { critério: 'adequacao_plataforma', aprovado: true, nota: 9, observações: 'Formato LinkedIn, hashtags, limite de caracteres' },
        { critério: 'identidade_editorial', aprovado: true, nota: 9, observações: 'Tom profissional, reflexivo, técnico' },
        { critério: 'qualidade_visual', aprovado: false, nota: 0, observações: 'Aguardando geração de imagem' },
        { critério: 'legibilidade', aprovado: true, nota: 9, observações: 'Quebras de linha, emojis, estrutura' },
      ],
    },
    seo: {
      título: 'IA na Engenharia de Software: Mais Código, Não Mais Software Entregue',
      palavrasChave: ['IA engenharia de software', 'revisão de código', 'agentes de IA', 'qualidade de software', 'DevOps', 'produtividade desenvolvedores', 'Sun Tzu tecnologia'],
      descrição: 'A IA acelera a escrita de código, mas o gargalo da engenharia de software mudou para a revisão humana. Estudo da Harvard e relatório Faros 2026 mostram que mais código não significa mais software entregue.',
    },
    podePublicar: false, // qualidade visual não aprovada
  }

  const html = gerarTemplateCompleto(dadosPreview)
  return c.html(html)
})

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
  <title>Prévisualização Demo - ${d.plataforma} - Social Content Hub</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .preview-card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    .badge { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .char-counter { font-size: 0.875rem; }
    .status-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; margin-right: 6px; }
    .demo-banner { background: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 0.75rem 1rem; border-radius: 0.5rem; font-size: 0.875rem; margin-bottom: 1rem; }
  </style>
</head>
<body class="bg-gray-50 min-h-screen">

  <!-- Banner Demo -->
  <div class="demo-banner">
    <strong>🧪 Modo Demonstração:</strong> Este é um material de exemplo para testar a prévisualização. Não está salvo em banco de dados.
  </div>

  <!-- Header -->
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold">SCH</div>
          <div>
            <div class="text-sm font-semibold text-gray-900">Social Content Hub</div>
            <div class="text-xs text-gray-500">Prévisualização Completa (Demo)</div>
          </div>
        </div>
        <div class="flex items-center gap-3">
          <a href="/" class="text-gray-600 hover:text-gray-900 text-sm font-medium px-3 py-2 rounded-md hover:bg-gray-100">Voltar</a>
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
                  <span class="text-xs text-gray-400">${d.plataforma} · Prévisualização Demo</span>
                </div>
                <div class="prose prose-sm max-w-none" id="conteudoPreview">
                  ${d.conteudoAdaptado.replace(/\n/g, '<br>')}
                </div>
                ${d.hashtags.length > 0 ? `
                <div class="mt-4">
                  ${d.hashtags.map((h: string) => `<span class="inline-block px-2 py-1 text-xs font-medium text-indigo-600 bg-indigo-50 rounded border border-indigo-100 mr-2 mb-1">#${h}</span>`).join('')}
                </div>
                ` : ''}
              </div>
            </div>
            <div class="mt-6 bg-gray-50 rounded-lg border border-dashed border-gray-300 p-6 text-center">
              <p class="text-sm text-gray-500">Nenhuma imagem gerada ainda (qualidade visual pendente)</p>
            </div>
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
              <textarea id="inputConteudo" rows="5" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 text-sm">${d.conteudoAdaptado}</textarea>
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
              <p class="text-sm text-gray-900">${d.seo.título}</p>
            </div>
            <div class="mb-2">
              <label class="block text-xs font-medium text-gray-700">Palavras-chave</label>
              <p class="text-sm text-gray-900">${d.seo.palavrasChave.join(', ')}</p>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-700">Descrição</label>
              <p class="text-sm text-gray-900">${d.seo.descrição}</p>
            </div>
          </div>
        </div>

        <!-- Ações -->
        <div class="bg-white rounded-lg border border-gray-200 shadow-sm p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Ações</h3>
          <div class="space-y-3">
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
      const dadosExport = {
        materialId: ${d.materialId},
        plataforma: '${d.plataforma}',
        titulo: document.getElementById('inputTitulo').value,
        conteudo: inputConteudo.value,
        hashtags: document.getElementById('inputHashtags').value.split(',').map(h => h.trim()).filter(Boolean),
        estado: '${d.estado}',
        exportadoEm: new Date().toISOString(),
        demo: true
      };
      const blob = new Blob([JSON.stringify(dadosExport, null, 2)], {type: 'application/json'});
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'preview_demo_${d.plataforma}_${d.materialId}.json';
      a.click();
      URL.revokeObjectURL(url);
    });

    document.getElementById('btnAprovarFinal')?.addEventListener('click', async () => {
      if (!${d.qualidade.todosAprovados}) {
        alert('Não é possível aprovar: critérios de qualidade não atendidos.');
        return;
      }
      alert('✅ Publicação aprovada (demo)!');
    });
  </script>
</body>
</html>
  `
}

export default app
