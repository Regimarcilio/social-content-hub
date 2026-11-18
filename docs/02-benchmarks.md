# Benchmarks Referenciais — Social Content Hub

> **Projeto:** Social Content Hub  
> **Etapa:** FASE 2 — Benchmarks  
> **Data da pesquisa:** 17/11/2026  
> **Status:** Planejamento (sem implementação)  
> **Fontes:** OpenRouter (coleção modelos gratuitos), osFoundry, Happymining, QualLLM, Dupple, Overchat, modelcontextprotocol/servers, MCP Registry, ai-atlas-tools, solucoesmcp.com.br

---

## 1. Metodologia

Foram realizadas pesquisas web (mínimo 3 variações por domínio) e consultas a fontes oficiais (OpenRouter, modelcontextprotocol/servers, documentação de licenças de modelos de imagem). Cada solução foi avaliada por: funcionalidade, licença, atividade/manutenção, prós, contras e custo. A recomendação final adota três níveis: **Ideal** / **Alternativa** / **Evitar**, com justificativa anti-retrabalho.

> **Regra de evidência:** nada foi inventado. Preços, identificadores de modelos e compatibilidade de MCP são reportados exatamente como retornados pelas fontes consultadas. Qualquer valor não confirmado é marcado como "[a confirmar]".

---

## 2. Benchmark 1 — Modelos de Linguagem Gratuitos (OpenRouter)

Todas as variantes `:free` têm preço US$ 0/M para entrada e saída. Limite de taxa padrão: **20 requisições/minuto e 50 requisições/dia** (sobe para 1.000/dia com compra de US$ 10 em créditos). Outros modelos US$ 0 não `:free` podem exigir conta com saldo.

| Modelo | Provedor | Contexto | Modalidades | Destaque / Uso indicado | Licença | Custo | Taxa (:free) |
|--------|----------|----------|-------------|-------------------------|---------|-------|--------------|
| `nvidia/nemotron-3-ultra-550b-a55b:free` | NVIDIA | 1M tokens | Texto | Raciocínio multi-etapa, planejamento, orquestração de agentes, deep research | Open (NVIDIA) | US$ 0 | 20 RPM / 50 RPD |
| `nvidia/nemotron-3.5-super-vl:free` | NVIDIA | 1M tokens | Texto + Imagem + Vídeo + Documentos + GUI | Visão computacional, raciocínio com ferramentas, pesquisa web, validação de código | Open (NVIDIA) | US$ 0 | 20 RPM / 50 RPD |
| `nvidia/nemotron-3.5-lightning:free` | NVIDIA | 1M tokens | Texto | Alta taxa de throughput, cargas de trabalho agenticas leves | Open (NVIDIA) | US$ 0 | 20 RPM / 50 RPD |
| `baidu/ernie-5.5-flash-preview:free` | Baidu | 1,02M tokens | Texto | Código, agentes, conhecimento, deep research; >200 tok/s | Baidu | US$ 0 (preview) | 20 RPM / 50 RPD |
| `thinkingmachines/inkling-2-small:free` | Thinking Machines | 1,05M tokens | Texto + Imagem | Raciocínio agente, coding autônomo, RAG, tool calling, esforço de raciocínio variável | Open-weight | US$ 0 | 20 RPM / 50 RPD |
| `inclusionai/ling-3.2-flash:free` | inclusionAI | 1M tokens | Texto + Imagem (até 200/img) | Raciocínio híbrido, raciocínio desligável por requisição | inclusionAI | US$ 0 | 20 RPM / 50 RPD |
| `google/gemma-4-31b-it:free` | Google | 262K tokens | Texto + Imagem + Vídeo | Generalista, redação, resumo, tradução, multilíngue | Open (Google) | US$ 0 | 20 RPM / 50 RPD |
| `google/gemma-4-26b-a4b-it:free` | Google | 262K tokens | Texto + Imagem + Vídeo | Generalista leve | Open (Google) | US$ 0 | 20 RPM / 50 RPD |
| `cohere/north-mini-code:free` | Cohere | 256K tokens | Texto + Código | Código, engenharia de software agentica, terminal, JSON schema | Apache 2.0 | US$ 0 | 20 RPM / 50 RPD |
| `nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` | NVIDIA | 256K tokens | Texto + Imagem + Áudio + Vídeo | Sub-agente de percepção, raciocínio multimodal | Open (NVIDIA) | US$ 0 | 20 RPM / 50 RPD |
| `openrouter/free` | OpenRouter | 200K tokens | Texto + Imagem | Roteamento automático para modelo gratuito adequado | Vários | US$ 0 | 20 RPM / 50 RPD |
| `recursive/flint-v1.0:free` | Recursive | 262K tokens | Texto | Agente de código, investigação de codebase, testes | Open-weight | US$ 0 | 20 RPM / 50 RPD |
| `liquid/lfm-3-1.7b:free` | LiquidAI | 256K tokens | Texto | Agente, tool calling, saídas estruturadas, raciocínio prévio | Liquid | US$ 0 | 20 RPM / 50 RPD |
| `perplexity/pplx-decider-v1.3:free` | Perplexity | — | Texto + Imagem (estado) | Classificação, roteamento, moderação, rubrica (resposta probabilística) | Perplexity | US$ 0 | 20 RPM / 50 RPD |

### Observações críticas sobre modelos gratuitos

- **Não presumir que modelos textuais gratuitos geram imagens.** A geração visual é tratada separadamente (Benchmark 2). Modelos VL (ex. Nemotron 3.5 Super VL, Ling 3.2 Flash) aceitam imagem como *entrada* (visão), não geram imagem.
- **Limites de uso:** 50 requisições/dia no plano gratuito é um gargalo para fluxos multiagente com vários agentes por publicação. Deve-se usar cache semântico e reservar modelos de alta capacidade para tarefas complexas.
- **Privacidade/retenção:** LiquidAI informa que prompts e saídas podem ser retidos para treino. Modelos da Baidu (ERNIE) não têm roteamento regional para a UE — ponto a considerar se houver dados pessoais de cidadãos europeus (LGPD/GDPR).
- **Não fixar modelos permanentemente:** a arquitetura deve permitir substituição por modelo equivalente (router por capacidade).

---

## 3. Benchmark 2 — Geração e Edição de Imagens

### 3.1 Execução local (open weights, sem cota por imagem)

| Modelo | Provedor | Licença | Uso comercial | VRAM indicada (confortável) | Qualidade | Observações |
|--------|----------|---------|---------------|-----------------------------|-----------|-------------|
| FLUX.1 [schnell] | Black Forest Labs | Apache 2.0 | Sim | ~8 GB | Boa, 1–4 passos | Rápido, texto em imagem razoável |
| FLUX.2 [klein] 4B | Black Forest Labs | Apache 2.0 | Sim | ~13 GB | Boa | Texto para imagem + edição, várias imagens de referência |
| FLUX.1 [dev] | Black Forest Labs | Não comercial | Não (sem licença paga) | 12–16 GB (FP8) / 24 GB (full) | Excelente (fotorrealismo) | Requer licença paga para uso comercial |
| FLUX.2 [dev] | Black Forest Labs | Não comercial | Não | ~90 GB (carga full) | Excelente | Pouco viável localmente |
| Qwen-Image | Alibaba | Apache 2.0 | Sim | [a confirmar] | Boa | Alternativa aberta |
| SDXL 1.0 | Stability AI | CreativeML OpenRAIL++-M | Sim (com restrições) | 8 GB | Boa, ecossistema maduro | LoRA/ControlNet abundantes |
| SD 3.5 Medium | Stability AI | Community License | Sim se receita < US$ 1M/ano | ~10 GB (exclui encoders de texto) | Boa aderência a prompt | Limite de receita para comercial |
| SD 3.5 Large | Stability AI | Community License | Sim se receita < US$ 1M/ano | >16 GB (16-bit) | Boa | Não viável em 8 GB |

**Ferramenta de execução local:** ComfyUI (GPL-3.0, interface baseada em nós, ativo semanalmente, suporte a SDXL/SD 3.5/FLUX/Qwen-Image/Wan). Alternativa histórica Automatic1111 está quase estática (sem versão desde 02/2025).

### 3.2 Serviços externos com cota gratuita (hospedados)

| Serviço | Modelo | Cota gratuita | Marca d'água / uso comercial | Ideal para |
|---------|--------|---------------|------------------------------|------------|
| Leonardo AI | Próprio | 150 tokens/dia | Direitos comerciais (imagens grátis públicas) | Iteração, model selection, upscaling |
| Adobe Firefly | Firefly + parceiros | Gerações diárias limitadas | Seguro para uso comercial (modelos Firefly) | Visuais prontos para design |
| Google Gemini / Flow | Nano Banana | Limite renovado a cada 5h (teto semanal); Flow 50 créditos/dia | SynthID invisível; uso comercial não informado explicitamente | Imagens do dia a dia, edição por chat |
| ChatGPT (OpenAI) | GPT Image | Limite não divulgado | Usuário detém os direitos | Visuais corporativos, redes sociais |
| Ideogram | Próprio | Créditos semanais (fila lenta) | Uso comercial permitido; grátis fica público | Tipografia, pôsteres, thumbnails |
| Canva AI | Próprio | Até 20 usos IA/mês | Licença de conteúdo do Canva | Posts para redes sociais |
| Krea | Vários | 100 unidades de computação/dia (~18 imagens/dia) | Licença comercial nos planos | Testar vários modelos, tempo real |
| Bing Image Creator | MAI-Image | 15 criações rápidas/dia + até 200 prompts/24h | Não informado | Volume gratuito |
| Perchance | Próprio | Ilimitado, sem conta | Não informado | Máximo 768×768 (baixa resolução) |

> **Atenção:** O projeto proíbe dependência de API paga da OpenAI. ChatGPT/GPT Image aparece apenas como referência de mercado, não como recomendação de implementação.

### 3.3 Comparativo local vs hospedado

| Critério | Local (ComfyUI + FLUX/SD) | Hospedado com cota gratuita |
|----------|---------------------------|-----------------------------|
| Custo marginal por imagem | Eletricidade apenas | Zero dentro da cota; esgota a cota |
| Limite de uso | Sem limite de plataforma | Cota diária/semanal (gargalo) |
| Qualidade premium | FLUX.1 dev (excelente, mas não comercial) / FLUX schnell | Modelos de ponta (GPT Image, Nano Banana) |
| Controle de direção de arte | Total (workflow de nós, LoRA, ControlNet) | Limitado aos parâmetros expostos |
| Hardware necessário | GPU NVIDIA 8–24 GB (ou Apple Silicon) | Nenhum (navegador) |
| Privacidade dos dados | Local, sem envio a terceiros | Envio de prompts/imagens ao provedor |
| Complexidade de setup | Alta (instalação, modelos, VRAM) | Baixa (cadastro e uso) |

---

## 4. Benchmark 3 — Servidores MCP

Fontes: `modelcontextprotocol/servers` (referência oficial), MCP Registry (`registry.modelcontextprotocol.io`), ai-atlas-tools (49 servidores analisados), solucoesmcp.com.br (30 servidores com riscos), documentação GitHub MCP.

### 4.1 Servidores de referência oficiais (MCP steering group)

| Servidor | Funcionalidade | Autenticação | Permissões | Custo | Limitações | Riscos |
|----------|---------------|--------------|------------|-------|------------|--------|
| Filesystem | Ler/escrever/criar/listar/deletar/mover/buscar arquivos | Nenhuma (local) | Diretórios autorizados via CLI | Grátis | Apenas pastas autorizadas; modo read-only disponível | Acesso a arquivos locais — restringir pastas |
| Fetch | Buscar URL e devolver conteúdo em Markdown | Nenhuma | Leitura de páginas web | Grátis | Conversão para markdown; sites com proteção anti-bot | SSRF se URLs não validadas |
| Git | Ler, buscar e manipular repositórios Git | Nenhuma (local) | Repositório especificado | Grátis | Operações Git locais | Alterações acidentais no repo |
| Memory | Grafo de conhecimento persistente | Nenhuma | Armazenamento local | Grátis | Escopo limitado ao servidor | Dados sensíveis em memória local |
| Sequential Thinking | Resolução de problemas por sequências de pensamento | Nenhuma | Processamento local | Grátis | Auxiliar de raciocínio, não fonte de dados | Baixo |
| Time | Conversão de fuso horário | Nenhuma | Nenhuma | Grátis | Apenas data/hora | Baixo |
| Everything | Servidor de teste (prompts, recursos, ferramentas) | Nenhuma | Teste | Grátis | Não para produção | Baixo |

### 4.2 Servidores oficiais de fornecedor (relevantes ao projeto)

| Servidor | Funcionalidade | Autenticação | Permissões | Custo | Limitações | Riscos |
|----------|---------------|--------------|------------|-------|------------|--------|
| GitHub (oficial) | Ler repositórios, issues, PRs, gerenciar | GitHub (OAuth/token) | Escopo do token GitHub | Grátis (pode exigir Copilot para algumas ferramentas) | Ferramentas herdam requisitos de licença do GitHub | Token com escopo excessivo |
| Brave Search | Busca web, local, imagens, vídeos, notícias | Chave API Brave | Consulta à API Brave | Grátis/pago (cota) | Depende de chave e cota da Brave | Exposição de chave de API |
| Firecrawl | Pesquisar, raspar, rastrear, interagir com web ao vivo | Chave API Firecrawl | Acesso a páginas | Grátis/pago (cota) | Limites de cota | Chave de API |
| Tavily | Busca web em tempo real, extração de páginas, mapeamento de site | Chave API Tavily | Consulta à API Tavily | Grátis/pago (cota) | Limites de cota | Chave de API |
| Exa | Busca semântica na web, leitura de páginas (agentes) | Chave API Exa | Consulta à API Exa | Grátis/pago (cota) | Limites de cota | Chave de API |
| Perplexity | Busca web, respostas rápidas, raciocínio, pesquisa | Chave API Perplexity | Consulta à API Perplexity | Grátis/pago (cota) | Limites de cota | Chave de API |

### 4.3 MCP para geração visual / design / banco de dados / publicação social

| Categoria | Opções identificadas | Status | Observações |
|-----------|---------------------|--------|-------------|
| Geração visual | EverArt (arquivado no repo de referência) | Arquivado | Substituído; não há servidor oficial de referência ativo para geração de imagens no `modelcontextprotocol/servers` |
| Banco de dados | PostgreSQL (arquivado), SQLite | Arquivado / referência | Sem servidor de referência ativo recomendado para produção |
| Publicação em redes sociais | Não há servidor MCP oficial de referência para LinkedIn/Instagram/TikTok/etc. | Ausente | Deve-se desenvolver MCP próprio ou usar API oficial direta da plataforma |

> **Conclusão MCP:** Não há servidor MCP oficial pronto para produção para geração de imagens nem para publicação em plataformas sociais. Essas integrações exigem desenvolvimento próprio (MCP tipado com auth + rate-limit, padrão Módulo 3.6/3.7 da EngAI Global) ou chamada direta às APIs oficiais das plataformas.

---

## 5. Matriz de Recomendação por Agente (Social Content Hub)

| Agente | Modelo recomendado (Ideal) | Alternativa | Justificativa |
|--------|---------------------------|-------------|---------------|
| Content Orchestrator | `nvidia/nemotron-3-ultra-550b-a55b:free` | `openrouter/free` | Raciocínio multi-etapa, planejamento, orquestração; contexto 1M |
| Researcher | `nvidia/nemotron-3.5-super-vl:free` + MCP Fetch/Tavily/Exa | `baidu/ernie-5.5-flash-preview:free` | Visão + pesquisa web; contexto 1M; tool use |
| Strategist | `nvidia/nemotron-3-ultra-550b-a55b:free` | `google/gemma-4-31b-it:free` | Planejamento estratégico, definição de público/abordagem |
| Writer | `google/gemma-4-31b-it:free` | `nvidia/nemotron-3.5-lightning:free` | Redação em português, qualidade textual, multilíngue |
| Platform Adapter | `nvidia/nemotron-3.5-lightning:free` | `cohere/north-mini-code:free` | Adaptação rápida por plataforma, limites de caracteres, JSON estruturado |
| Art Director | `nvidia/nemotron-3.5-super-vl:free` | `inclusionai/ling-3.2-flash:free` | Visão computacional para direção de arte, briefing de imagem |
| Image Creator | (não é LLM) — ComfyUI local + FLUX.1 schnell / Leonardo AI | SDXL local / Adobe Firefly | Separação clara: geração visual fora dos agentes de redação |
| Quality Reviewer | `nvidia/nemotron-3-ultra-550b-a55b:free` | `google/gemma-4-31b-it:free` | Revisão gramatical, editorial, coerência; raciocínio |
| SEO Specialist | `google/gemma-4-31b-it:free` | `nvidia/nemotron-3.5-lightning:free` | Títulos, palavras-chave, descrições, otimização por plataforma |

### Modelos a evitar (nesta etapa)
- Qualquer modelo pago da OpenAI (GPT-4o, etc.) — proibido pelo projeto.
- Modelos apenas por popularidade/nome comercial sem avaliação de custo/qualidade.
- FLUX.1 [dev] / FLUX.2 [dev] para uso comercial sem licença paga da Black Forest Labs.

---

## 6. Tabela Comparativa Resumo (Ideal / Alternativa / Evitar)

| Domínio | Ideal | Alternativa | Evitar |
|---------|-------|-------------|--------|
| Orquestração / raciocínio complexo | Nemotron 3 Ultra (free) | openrouter/free | Modelos pagos OpenAI |
| Visão + pesquisa | Nemotron 3.5 Super VL (free) | ERNIE 5.5 Flash (free) | — |
| Redação PT-BR | Gemma 4 31B (free) | Nemotron 3.5 Lightning (free) | — |
| Adaptação plataforma | Nemotron 3.5 Lightning (free) | Cohere North Mini Code (free) | — |
| Direção de arte (visão) | Nemotron 3.5 Super VL (free) | Ling 3.2 Flash (free) | — |
| Geração de imagens (local, grátis, comercial) | ComfyUI + FLUX.1 [schnell] (Apache 2.0) | ComfyUI + FLUX.2 [klein] 4B (Apache 2.0) | FLUX.1 [dev] sem licença comercial |
| Geração de imagens (hospedado, cota grátis) | Leonardo AI (150 tokens/dia) | Adobe Firefly / Gemini Nano Banana | ChatGPT GPT Image (proibido como dependência) |
| MCP pesquisa web | Fetch (ref) + Tavily/Exa/Perplexity (oficial) | Brave Search (oficial) | Servidores comunitários não auditados |
| MCP arquivos/git | Filesystem + Git (ref, oficiais) | — | — |
| MCP publicação social | Desenvolver próprio (API oficial da plataforma) | — | Servidor MCP de referência para redes sociais (não existe) |

---

## 7. Justificativa das Escolhas Técnicas

1. **OpenRouter como roteador de modelos gratuitos:** agrega múltiplos provedores com uma única chave, variantes `:free` a US$ 0, e roteamento automático (`openrouter/free`). Permite substituição de modelo sem retrabalho (atende ao requisito de não fixar modelos permanentemente).
2. **Nemotron 3 Ultra para orquestração:** contexto 1M tokens, raciocínio multi-etapa, desenhado para pipelines agenticos de alto volume — adequado ao Content Orchestrator.
3. **Nemotron 3.5 Super VL para Researcher/Art Director:** multimodal (texto+imagem+vídeo+documentos+GUI), visão computacional e tool use — essencial para pesquisa com capturas de tela e direção de arte.
4. **Gemma 4 31B para Writer/SEO:** generalista confiável, forte cobertura multilíngue (incluindo PT-BR), boa para redação e otimização.
5. **ComfyUI + FLUX.1 [schnell] para imagens locais:** Apache 2.0 (uso comercial livre), sem cota por imagem, controle total de direção de arte via workflow de nós. FLUX.2 [klein] 4B como alternativa leve (Apache 2.0, ~13 GB VRAM).
6. **Leonardo AI como alternativa hospedada:** cota gratuita diária (150 tokens), direitos comerciais, boa para iteração quando a GPU local não estiver disponível.
7. **MCP Filesystem/Fetch/Git (referência oficial):** mantidos pelo grupo MCP, MIT, sem chave de acesso, adequados para leitura/escrita de arquivos, consulta de páginas e Git local.
8. **Nenhum MCP pronto para publicação social:** desenvolver MCP próprio sobre as APIs oficiais das plataformas (LinkedIn, Instagram, TikTok, etc.) com auth + rate-limit.

---

## 8. Riscos e Mitigações dos Benchmarks

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Limite de 50 req/dia nos modelos `:free` | Alto | Alta | Cache semântico, router por capacidade, reservar modelos pesados para tarefas complexas, agrupar chamadas |
| FLUX.1 [dev] sem licença comercial | Alto | Média | Usar FLUX.1 [schnell] ou FLUX.2 [klein] 4B (Apache 2.0) para uso comercial |
| GPU insuficiente para ComfyUI local | Médio | Média | Alternativa hospedada (Leonardo AI/Firefly) como fallback; documentar requisitos de VRAM |
| APIs oficiais de redes sociais restringem publicação automática | Médio | Alta | Estados Rascunho/Aprovado/Publicado + exportação para publicação manual |
| Chaves de API MCP expostas | Alto | Baixa | Armazenar criptografado, rate-limit, escopo mínimo de permissões |
| Modelos gratuitos deixam de estar disponíveis | Médio | Média | Não fixar modelos permanentemente; router com fallback; revisar coleção OpenRouter periodicamente |

---

## 9. Links e Referências Consultadas

- OpenRouter — Modelos gratuitos: https://openrouter.ai/pt-BR/collections/free-models
- OpenRouter — Modelos (comparação): https://openrouter.ai/pt-BR/models
- osFoundry — Guia auto-hospedado geração de imagens: https://osfoundry.io/pt/articles/self-hosted-image-generation-guide
- QualLLM — ComfyUI instalação: https://qualllm.com/guide/comfyui-installation-guide-debutant/
- QualLLM — Stable Diffusion local: https://qualllm.com/guide/stable-diffusion-installation-locale-guide/
- Dupple — Best Free AI Image Generators 2026: https://dupple.com/learn/best-free-ai-image-generators
- Overchat — Melhores geradores de imagem IA grátis 2026: https://overchat.ai/pt/ai-hub/best-free-ai-image-generators
- modelcontextprotocol/servers: https://github.com/modelcontextprotocol/servers
- MCP Registry: https://registry.modelcontextprotocol.io
- ai-atlas-tools — Servidores MCP: https://ai-atlas-tools.com/pt-br/extensions/guide/best-mcp-servers/
- solucoesmcp.com.br — Servidores MCP com riscos: https://solucoesmcp.com.br/servidores/
- Documentação GitHub MCP Server: https://docs.github.com/pt/copilot/how-tos/provide-context/use-mcp/use-the-github-mcp-server

---

*Próxima etapa: FASE 3 — SRS completo (requisitos funcionais, não-funcionais, regras de negócio, matriz de rastreabilidade).*
