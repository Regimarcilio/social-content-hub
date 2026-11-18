// @ts-nocheck
import { Hono } from 'hono'
import { eq } from 'drizzle-orm'
import { db } from '../shared/db'
import { conteudosGerados, adaptacoesPlataforma } from '../images/schema'

const app = new Hono()

// Rota de prévisualização de publicação
app.get('/:materialId/:plataforma', async (c) => {
  const materialId = Number(c.req.param('materialId'))
  const plataforma = c.req.param('plataforma')

  // Buscar o material
  const [material] = await db
    .select()
    .from(conteudosGerados)
    .where(eq(conteudosGerados.id, materialId))

  if (!material) {
    return c.json({ error: 'Material não encontrado' }, 404)
  }

  // Buscar a adaptação para a plataforma específica
  const [adaptacao] = await db
    .select()
    .from(adaptacoesPlataforma)
    .where(eq(adaptacoesPlataforma.conteudoId, materialId))
    .where(eq(adaptacoesPlataforma.plataforma, plataforma))

  // Buscar imagem associada (se houver)
  const [imagem] = await db
    .select()
    .from(require('../images/schema').imagensGeradas)
    .where(eq(require('../images/schema').imagensGeradas.briefingId, material.id))
    .where(eq(require('../images/schema').imagensGeradas.etapa, 'definitiva'))

  const dadosPreview = {
    materialId: material.id,
    plataforma,
    estado: 'rascunho',
    titulo: material.titulo || '',
    conteudoOriginal: material.conteudoOriginal,
    conteudoAdaptado: adaptacao?.conteudoAdaptado || material.conteudoOriginal,
    hashtags: adaptacao?.hashtags || [],
    caminhoImagem: imagem?.caminhoArquivo || null,
    limiteCaracteres: adaptacao?.limiteCaracteres || 3000,
  }

  // Injetar dados no template HTML
  const html = previewTemplate(dadosPreview)

  return c.html(html)
})

/**
 * Template HTML da prévisualização com dados injetados
 */
function previewTemplate(dados: any): string {
  const template = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Prévisualização - ${dados.plataforma} - Social Content Hub</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Inter', sans-serif; }
    .preview-card { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); }
    .platform-badge { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; }
    .char-counter { font-size: 0.875rem; color: #6b7280; }
    .char-limit-warning { color: #dc2626; font-weight: 600; }
    .char-limit-ok { color: #059669; font-weight: 600; }
  </style>
</head>
<body class="bg-gray-50 min-h-screen">

  <!-- Header -->
  <header class="bg-white border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <div class="flex-shrink-0 flex items-center">
            <span class="block h-8 w-auto text-indigo-600 font-bold text-xl">SCH</span>
          </div>
          <div class="ml-10 flex items-baseline space-xs-4">
            <a href="#" class="text-gray-900 hover:text-gray-700 px-3 py-2 rounded-md text-sm font-medium">Social Content Hub</a>
          </div>
        </div>
        <div class="flex items-center">
          <button type="button" onclick="window.location.href='/api/editorial'" class="bg-white text-gray-700 inline-flex items-center border border-gray-300 shadow-sm px-4 py-2 rounded-md text-sm font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3">
            Voltar para Revisão
          </button>
          <button type="button" id="btnAprovar" class="text-white bg-indigo-600 border border-transparent shadow-sm px-5 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mr-3">
            ✅ Aprovar Publicação
          </button>
          <button type="button" id="btnRejeitar" class="text-white bg-red-600 border border-transparent shadow-sm px-5 py-2 rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
            ❌ Rejeitar e Revisar
          </button>
        </div>
      </div>
    </div>
  </header>

  <!-- Conteúdo Principal -->
  <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
    
    <!-- Informações do Material -->
    <div class="mb-6">
      <div class="flex items-center justify-between">
        <div>
          <h2 class="text-lg font-medium text-gray-900">Prévisualização de Publicação</h2>
          <p class="mt-1 text-sm text-gray-500">Revise o conteúdo antes de publicar na plataforma selecionada</p>
        </div>
        <div class="flex items-center space-x-2">
          <span id="badgePlataforma" class="platform-badge inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium leading-5 bg-indigo-100 text-indigo-800">
            ${dados.plataforma}
          </span>
          <span id="badgeEstado" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium leading-5 bg-gray-100 text-gray-800">
            ${dados.estado}
          </span>
        </div>
      </div>
    </div>

    <!-- Preview da Publicação -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      
      <!-- Coluna Esquerda: Preview Visual -->
      <div class="lg:col-span-1">
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg font-medium text-gray-900">Como ficará na plataforma</h3>
            <p class="mt-1 text-sm text-gray-500">Prévisualização simulada - confira formatação, tamanho e imagem</p>
          </div>
          <div class="border-t border-gray-200">
            <div class="p-6 preview-card bg-white rounded-b-lg" id="previewContainer">
              <div class="flex items-center space-x-3 mb-3">
                <div class="flex-shrink-0">
                  <img class="h-8 w-8 rounded-full" id="previewAvatar" src="https://ui-avatars.com/api/?name=Social+Content&background=4f46e5&color=fff" alt="Avatar">
                </div>
                <div>
                  <p class="text-sm font-medium text-gray-900" id="previewNome">Social Content Hub</p>
                  <p class="text-xs text-gray-500" id="previewPlataforma">${dados.plataforma} · Prévisualização</p>
                </div>
              </div>
              <div class="mt-4" id="previewConteudo">
                ${(dados.conteudoAdaptado || dados.conteudoOriginal || '').replace(/\n/g, '<br>')}
              </div>
              ${dados.caminhoImagem ? `
              <div class="mt-4" id="previewImagemContainer">
                <img id="previewImagem" src="${dados.caminhoImagem}" class="w-full h-64 object-cover rounded-lg border border-gray-200" alt="Imagem da publicação">
              </div>
              ` : ''}
              <div class="mt-3 flex items-center text-xs text-gray-500" id="previewHashtags">
                ${(dados.hashtags || []).map(h => '<span class="text-indigo-600 mr-1">#' + h + '</span>').join('')}
              </div>
              <div class="mt-2 flex items-center text-xs text-gray-500" id="previewContador">
                0 / ${dados.limiteCaracteres} caracteres
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Coluna Direita: Edição e Ação -->
      <div class="lg:col-span-1">
        <div class="bg-white overflow-hidden shadow-sm sm:rounded-lg border border-gray-200">
          <div class="px-4 py-5 sm:px-6">
            <h3 class="text-lg font-medium text-gray-900">Editar Conteúdo</h3>
            <p class="mt-1 text-sm text-gray-500">Faça ajustes finais antes de aprovar</p>
          </div>
          <div class="border-t border-gray-200 p-6">
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input type="text" id="inputTitulo" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value="${dados.titulo || ''}" placeholder="Título da publicação">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Conteúdo</label>
              <textarea id="inputConteudo" rows="6" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">${dados.conteudoAdaptado || dados.conteudoOriginal || ''}</textarea>
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Hashtags (separadas por vírgula)</label>
              <input type="text" id="inputHashtags" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value="${(dados.hashtags || []).join(', ')}" placeholder="#exemplo #marketing">
            </div>
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-1">Imagem (URL ou caminho)</label>
              <input type="text" id="inputImagem" class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" value="${dados.caminhoImagem || ''}" placeholder="https://exemplo.com/imagem.jpg">
            </div>
            
            <!-- Contador de caracteres -->
            <div class="flex justify-end">
              <span id="contadorCaracteres" class="char-counter char-limit-ok">0 / ${dados.limiteCaracteres} caracteres</span>
            </div>
          </div>
        </div>

        <!-- Ações Rápidas -->
        <div class="mt-6 bg-white p-6 border border-gray-200 rounded-lg shadow-sm">
          <h3 class="text-lg font-medium text-gray-900 mb-4">Ações</h3>
          <div class="space-y-3">
            <button type="button" id="btnSalvarRascunho" class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              💾 Salvar como Rascunho
            </button>
            <button type="button" id="btnExportar" class="w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              📤 Exportar para Publicação Manual
            </button>
            <div class="border-t border-gray-200 pt-4">
              <button type="button" id="btnConfirmarAprovar" class="w-full flex items-center justify-center px-4 py-2 text-white bg-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                ✅ Confirmar Aprovação e Publicar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

  </main>

  <!-- Modal de Confirmação -->
  <div id="modalConfirmacao" class="fixed inset-0 z-50 hidden" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
    <div class="fixed inset-0 z-10 overflow-y-auto">
      <div class="flex min-h-center items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-md">
          <div class="sm:flex sm:items-start sm:px-6">
            <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
              <svg class="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div class="mt-3 text-center sm:ml-4 sm:text-left">
              <h3 class="text-base font-medium leading-6 text-gray-900" id="modalTitulo">Confirmar Aprovação</h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500" id="modalMensagem">Tem certeza que deseja aprovar esta publicação para ${dados.plataforma}? Após aprovada, ela será enviada para a plataforma selecionada.</p>
              </div>
            </div>
          </div>
          <div class="mt-5 sm:items-start sm:justify-center sm:px-6">
            <button type="button" id="btnCancelarAprovacao" class="ml-3 inline-flex w-full justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">Cancelar</button>
            <button type="button" id="btnConfirmarSim" class="inline-flex w-full justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-white font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">Sim, Aprovar</button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const LIMITES = {
      linkedin: 3000,
      reddit: 40000,
      facebook: 63206,
      instagram: 2200,
      youtube: 5000,
      tiktok: 2200,
      x: 280
    };

    const previewConteudo = document.getElementById('previewConteudo');
    const previewHashtags = document.getElementById('previewHashtags');
    const previewContador = document.getElementById('previewContador');
    const inputTitulo = document.getElementById('inputTitulo');
    const inputConteudo = document.getElementById('inputConteudo');
    const inputHashtags = document.getElementById('inputHashtags');
    const inputImagem = document.getElementById('inputImagem');
    const contadorCaracteres = document.getElementById('contadorCaracteres');

    function atualizarPreview() {
      const conteudo = inputConteudo.value;
      const hashtags = inputHashtags.value.split(',').map(h => h.trim()).filter(h => h).map(h => '#' + h).join(' ');
      previewConteudo.innerHTML = (conteudo + (hashtags ? '\\n\\n' + hashtags : '')).replace(/\\n/g, '<br>');
      previewHashtags.innerHTML = hashtags ? '<span class="text-indigo-600">' + hashtags + '</span>' : '';
      atualizarContador();
    }

    function atualizarContador() {
      const texto = inputConteudo.value;
      const limite = ${dados.limiteCaracteres};
      const restante = limite - texto.length;
      contadorCaracteres.textContent = texto.length + ' / ' + limite + ' caracteres';
      contadorCaracteres.className = restante < 0 ? 'char-counter char-limit-warning' : 'char-counter char-limit-ok';
    }

    inputTitulo.addEventListener('input', atualizarPreview);
    inputConteudo.addEventListener('input', atualizarPreview);
    inputHashtags.addEventListener('input', atualizarPreview);
    inputImagem.addEventListener('input', function() {
      const img = document.getElementById('previewImagem');
      const container = document.getElementById('previewImagemContainer');
      if (this.value) {
        img.src = this.value;
        container.classList.remove('hidden');
      } else {
        container.classList.add('hidden');
      }
    });

    atualizarPreview();

    document.getElementById('btnAprovar').addEventListener('click', () => {
      document.getElementById('modalConfirmacao').classList.remove('hidden');
    });

    document.getElementById('btnRejeitar').addEventListener('click', () => {
      if(confirm('Rejeitar esta publicação? Ela retornará para revisão.')) {
        alert('Publicação rejeitada. Retornando para revisão...');
        window.location.href = '/api/editorial';
      }
    });

    document.getElementById('btnConfirmarAprovar').addEventListener('click', () => {
      document.getElementById('modalConfirmacao').classList.remove('hidden');
    });

    document.getElementById('btnCancelarAprovacao').addEventListener('click', () => {
      document.getElementById('modalConfirmacao').classList.add('hidden');
    });

    document.getElementById('btnConfirmarSim').addEventListener('click', async () => {
      const btn = document.getElementById('btnConfirmarSim');
      btn.textContent = 'Processando...';
      btn.disabled = true;

      try {
        const resposta = await fetch('/api/quality/aprovar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            materialId: ${dados.materialId},
            plataforma: '${dados.plataforma}',
            aprovadoPor: 'usuario_preview',
            estado: 'aprovado'
          })
        });

        if (resposta.ok) {
          document.getElementById('modalConfirmacao').classList.add('hidden');
          alert('✅ Publicação aprovada com sucesso!');
          window.location.href = '/api/editorial';
        } else {
          const erro = await resposta.json();
          alert('Erro ao aprovar: ' + (erro.error || 'Erro desconhecido'));
          btn.textContent = 'Sim, Aprovar';
          btn.disabled = false;
        }
      } catch (e) {
        alert('Erro de conexão: ' + e.message);
        btn.textContent = 'Sim, Aprovar';
        btn.disabled = false;
      }
    });

    document.getElementById('btnSalvarRascunho').addEventListener('click', () => {
      alert('Rascunho salvo (simulado). Em produção, isso atualizaria o banco de dados.');
    });

    document.getElementById('btnExportar').addEventListener('click', async () => {
      const resposta = await fetch('/api/quality/exportar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          materialId: ${dados.materialId},
          plataforma: '${dados.plataforma}',
          formato: 'json',
          exportadoPor: 'usuario_preview'
        })
      });

      if (resposta.ok) {
        const dadosExport = await resposta.json();
        const blob = new Blob([JSON.stringify(dadosExport.conteudo, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'publicacao_' + '${dados.plataforma}' + '_' + ${dados.materialId} + '.json';
        a.click();
        URL.revokeObjectURL(url);
        alert('✅ Material exportado para publicação manual!');
      } else {
        alert('Erro ao exportar.');
      }
    });
  </script>
</body>
</html>
  `
  return template
}

export default app
