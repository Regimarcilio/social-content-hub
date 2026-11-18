# Software Requirements Specification (SRS) — Social Content Hub

> **Projeto:** Social Content Hub  
> **Integrado a:** OpenCode  
> **Etapa:** FASE 3 — SRS (planejamento, sem implementação)  
> **Versão:** 0.1  
> **Data:** 17/11/2026  
> **Branch:** `DOC`  
> **Material de referência do curso:** https://integrador-cedup.glide.page/dl/a400f7

---

## 1. Introdução

### 1.1 Propósito

O Social Content Hub é uma estrutura inteligente integrada ao OpenCode capaz de transformar um assunto em publicações profissionais adaptadas a diferentes plataformas digitais (LinkedIn, Reddit, Facebook, Instagram, YouTube, TikTok, X/Twitter). O sistema utiliza agentes especializados, skills reutilizáveis, servidores MCP, modelos gratuitos do ecossistema OpenCode, ferramentas de pesquisa, geração e edição de imagens, mecanismos de revisão e controle de qualidade, identidade editorial configurável e versionamento de materiais.

O objetivo deste SRS é especificar, com nível de detalhe suficiente para implementação posterior, todos os requisitos do sistema, eliminando ambiguidades e retrabalho.

### 1.2 Escopo

**INclusão (IN):**
- Orquestração multiagente com Content Orchestrator central e especialistas (Researcher, Strategist, Writer, Platform Adapter, Art Director, Image Creator, Quality Reviewer, SEO Specialist).
- Memória editorial: cadastro de projetos editoriais com objetivo, público-alvo, tom de voz, identidade visual, paleta de cores, estilo de imagens, regras de redação, plataformas, séries editoriais, histórico de publicações, referências e fontes.
- Plataformas digitais ativáveis/desativáveis individualmente: LinkedIn, Reddit, Facebook, Instagram, YouTube, TikTok, X/Twitter, com regras próprias por plataforma (formatação, linguagem, limite de caracteres, hashtags, títulos, descrições, imagens, proporções, estrutura editorial).
- Geração de imagens em duas etapas: (1) desenvolvimento e avaliação de conceitos visuais; (2) geração e finalização da imagem definitiva. Direção de arte (conceito, estilo artístico, composição, iluminação, paleta cromática, elementos visuais, formato/proporção, coerência com identidade editorial).
- Etapa de finalização gráfica (tipografia, alinhamento, legibilidade, qualidade).
- Controle de qualidade com critérios objetivos de aprovação e fluxo de revisão (retorno para revisão se não atingir critérios).
- Estados de publicação: Rascunho → Aprovado → Publicado. Publicação não automática sem aprovação humana.
- Exportação do material final para publicação manual quando não houver integração autorizada.
- Versionamento e histórico dos materiais.
- Estratégia de custos: priorizar modelos gratuitos, indicadores de custo por publicação e por projeto, limites de uso, mecanismos para evitar chamadas desnecessárias.
- Documentação: SRS, UML (Mermaid), backlog Scrum, ADRs, plano de testes, roadmap, critérios de aceitação.

**Exclusão (OUT):**
- Publicação automática direta via API oficial de todas as plataformas (não presumida; depende de validação de autenticação e permissões).
- Agendamento nativo de publicações.
- Analytics de engajamento.
- Suporte a vídeos.
- Modo mobile nativo.
- Fine-tuning de modelos (descartado por padrão: RAG > Fine-tuning).
- Dependência de API paga da OpenAI.

### 1.3 Definições, Abreviações e Acrônimos

| Termo | Definição |
|-------|-----------|
| RF | Requisito Funcional |
| RNF | Requisito Não-Funcional |
| RN | Regra de Negócio |
| US | User Story |
| AC | Critério de Aceitação |
| DoD | Definition of Done |
| DoR | Definition of Ready |
| MoSCoW | Priorização (Must / Should / Could / Won't) |
| SRS | Software Requirements Specification |
| UML | Unified Modeling Language |
| ADR | Architecture Decision Record |
| MCP | Model Context Protocol |
| VL | Vision-Language (modelo que aceita imagem como entrada) |
| LLM | Large Language Model |
| RAG | Retrieval-Augmented Generation |
| Prototipação | Ciclo PROPOSTA → NAVEGÁVEL → VALIDADA → APROVADA → IMPLEMENTADA |

### 1.4 Referências

- Material de referência do curso: https://integrador-cedup.glide.page/dl/a400f7
- OpenRouter — Modelos gratuitos: https://openrouter.ai/pt-BR/collections/free-models
- Model Context Protocol — Servidores de referência: https://github.com/modelcontextprotocol/servers
- MCP Registry: https://registry.modelcontextprotocol.io
- Templates do repositório: `docs/templates/SRS_TEMPLATE.md`, `docs/templates/SCRUM_TEMPLATE.md`

---

## 2. Descrição Geral

### 2.1 Perspectiva do Sistema

O Social Content Hub opera como uma camada de orquestração sobre o OpenCode. O usuário insere um assunto e seleciona um projeto editorial; o orquestrador distribui tarefas para agentes especializados; cada agente utiliza um modelo gratuito apropriado à sua responsabilidade e, quando necessário, servidores MCP (pesquisa, arquivos, Git) e ferramentas de geração de imagem. O resultado são materiais independentes por plataforma, submetidos a revisão de qualidade e aprovados por um humano antes de atingir o estado "Publicado" ou serem exportados para publicação manual.

### 2.2 Público-Alvo

| Segmento | Características |
|----------|-----------------|
| Gestor de Conteúdo / Usuário final | Cria e aprova publicações; precisa de interface intuitiva e fluxo de revisão |
| Community Manager | Opera canais sociais diariamente; precisa de conteúdo adaptado por plataforma, sem copiar-colar |
| Administrador | Configura projetos editoriais, plataformas e credenciais; controle de APIs e custos |
| Analista de Qualidade | Revisa materiais contra critérios objetivos de aprovação |
| Arquiteto de Software | Define e mantém a arquitetura; escolhas técnicas justificadas |

### 2.3 Restrições

- **Modelos:** utilizar prioritariamente modelos gratuitos do catálogo de provedores compatíveis com OpenCode. Não pressupor modelos pagos da OpenAI. Não utilizar API paga da OpenAI como dependência.
- **Imagens:** não presumir que modelos textuais gratuitos do OpenCode geram imagens. Separar geração visual dos agentes de redação.
- **Implementação:** esta etapa é exclusivamente de planejamento. Não implementar funcionalidades, não criar agentes, não instalar MCPs, não alterar configurações existentes, não modificar arquivos do ambiente.
- **Git:** trabalhar na branch `develop`; documentação na branch `DOC`; nunca commit direto em `main`/`master`; Conventional Commits.
- **Prototipação:** toda tela nasce protótipo (ciclo PROPOSTA → NAVEGÁVEL → VALIDADA → APROVADA → IMPLEMENTADA, dono `@protomaster`). Sem protótipo APROVADO, não há front/style.
- **Privacidade:** LGPD — dados de autenticação e credenciais de plataformas armazenados criptografados.
- **Acessibilidade:** WCAG 2.1 AA (quando houver interface).

### 2.4 Premissas

- O OpenCode disponibiliza modelos gratuitos via provedores compatíveis (ex. OpenRouter) com variantes `:free`.
- Existe hardware ou serviço compatível para execução local de geração de imagens (ComfyUI + FLUX/SD) ou cota gratuita em serviço externo.
- As plataformas sociais disponibilizam APIs oficiais (ou permitem exportação para publicação manual).
- O usuário valida e aprova o SRS antes de qualquer implementação.

---

## 3. Requisitos Funcionais

Cada RF possui ID, título, descrição, ator, prioridade MoSCoW, critério de aceite em Gherkin e dependências.

| ID | Título | Descrição | Ator | Prioridade | Dependências |
|----|--------|-----------|------|------------|--------------|
| RF-001 | Cadastro de projeto editorial | Permitir cadastrar, editar e listar projetos editoriais com nome, objetivo, público-alvo, tom de voz, identidade visual, paleta de cores, estilo de imagens, regras de redação, plataformas utilizadas, séries editoriais, referências e fontes. | Administrador | Must | — |
| RF-002 | Configuração de identidade editorial | Permitir definir e reutilizar identidade editorial por projeto (tom de voz, paleta de cores, estilo de imagens, regras de redação), preservando continuidade entre publicações de uma mesma série. | Administrador | Must | RF-001 |
| RF-003 | Ativação/desativação de plataformas | Permitir ativar e desativar plataformas individualmente (LinkedIn, Reddit, Facebook, Instagram, YouTube, TikTok, X/Twitter) e préver inclusão futura sem reconstrução da arquitetura. | Administrador | Must | RF-001 |
| RF-004 | Entrada de assunto/tema | Permitir ao usuário informar um assunto e selecionar o projeto editorial e as plataformas alvo para geração da publicação. | Gestor de Conteúdo | Must | RF-001, RF-003 |
| RF-005 | Pesquisa de assunto (Researcher) | O agente Researcher pesquisa o assunto, fontes, referências e informações relevantes utilizando ferramentas de pesquisa (MCP Fetch/Tavily/Exa ou similar). | Researcher (agente) | Must | RF-004 |
| RF-006 | Definição de estratégia editorial (Strategist) | O agente Strategist define público, objetivo, abordagem e estratégia editorial com base na pesquisa e na identidade editorial do projeto. | Strategist (agente) | Must | RF-005, RF-002 |
| RF-007 | Geração de conteúdo original (Writer) | O agente Writer produz o conteúdo original com qualidade textual e profundidade adequada, em português brasileiro, respeitando as regras de redação do projeto. | Writer (agente) | Should | RF-006 |
| RF-008 | Adaptação por plataforma (Platform Adapter) | O agente Platform Adapter adapta o conteúdo para as particularidades de cada plataforma (formatação, linguagem, limite de caracteres, hashtags, títulos, descrições, imagens, proporções, estrutura editorial), produzindo materiais independentes (não cópia idêntica). | Platform Adapter (agente) | Must | RF-007, RF-003 |
| RF-009 | Direção de arte e briefing de imagem (Art Director) | O agente Art Director define o briefing de cada imagem: conceito visual, estilo artístico, composição, iluminação, paleta cromática, elementos visuais, formato e proporção, coerente com a identidade editorial. | Art Director (agente) | Should | RF-002, RF-008 |
| RF-010 | Geração de imagem em duas etapas (Image Creator) | Etapa 1: desenvolvimento e avaliação de conceitos visuais. Etapa 2: geração e finalização da imagem definitiva. Evitar múltiplas gerações sem critérios. Separar geração visual dos agentes de redação. | Image Creator (agente + ferramenta) | Must | RF-009 |
| RF-011 | Finalização gráfica | Etapa de finalização gráfica para garantir tipografia, alinhamento, legibilidade e qualidade dos materiais visuais. | Image Creator (agente + ferramenta) | Should | RF-010 |
| RF-012 | SEO (títulos, palavras-chave, descrições) | O agente SEO Specialist trabalha títulos, palavras-chave, descrições e otimização por plataforma. | SEO Specialist (agente) | Should | RF-008 |
| RF-013 | Revisão de qualidade (Quality Reviewer) | O agente Quality Reviewer avalia qualidade técnica, gramatical, editorial e visual contra critérios objetivos. Se não atingir, retorna para revisão. | Quality Reviewer (agente) | Must | RF-007, RF-008, RF-010 |
| RF-014 | Estados de publicação e aprovação humana | Os materiais possuem três estados: Rascunho, Aprovado, Publicado. A publicação não é executada automaticamente sem aprovação humana. | Gestor de Conteúdo | Must | RF-013 |
| RF-015 | Exportação para publicação manual | Quando não existir integração autorizada com a plataforma, permitir exportação do material final para publicação manual. | Gestor de Conteúdo | Should | RF-014 |
| RF-016 | Versionamento e histórico | Preservar versão e histórico dos materiais e das publicações de um projeto editorial, garantindo continuidade entre séries. | Administrador | Should | RF-001 |
| RF-017 | Indicadores de custo | Calcular e exibir custo por publicação e por projeto (modelos de linguagem, geração de imagens, armazenamento, pesquisa, execução de agentes). | Administrador | Should | — |
| RF-018 | Limites de uso e evitação de chamadas desnecessárias | Prever limites de utilização e mecanismos para evitar chamadas desnecessárias (cache semântico, agrupamento, router por capacidade). | Sistema | Must | — |

### Critérios de Aceitação (Gherkin) por RF

#### RF-001 — Cadastro de projeto editorial
```gherkin
Feature: Cadastro de projeto editorial
  Scenario: Cadastrar novo projeto editorial com sucesso
    Given que o usuário é autenticado como Administrador
    Quando preenche nome, objetivo, público-alvo, tom de voz e seleciona ao menos uma plataforma
    Então o projeto editorial é criado e listado
    E o status do projeto é "ativo"

  Scenario: Tentar cadastrar projeto sem nome
    Given que o usuário é autenticado como Administrador
    Quando tenta salvar um projeto editorial sem preencher o nome
    Então o sistema exibe erro de validação
    E o projeto não é criado
```

#### RF-003 — Ativação/desativação de plataformas
```gherkin
Feature: Ativação/desativação de plataformas
  Scenario: Desativar uma plataforma individualmente
    Given que o projeto editorial possui LinkedIn e Instagram ativos
    Quando o Administrador desativa o Instagram
    Então o Instagram não aparece mais como opção de geração para esse projeto
    E o LinkedIn permanece ativo
```

#### RF-008 — Adaptação por plataforma
```gherkin
Feature: Adaptação de conteúdo por plataforma
  Scenario: Gerar materiais independentes para LinkedIn e X/Twitter
    Given um conteúdo base aprovado pelo Writer
    Quando o Platform Adapter adapta para LinkedIn e X/Twitter
    Então o texto do LinkedIn difere do texto do X/Twitter
    E cada um respeita o limite de caracteres e formato da sua plataforma
    E não há cópia idêntica entre os canais
```

#### RF-010 — Geração de imagem em duas etapas
```gherkin
Feature: Geração de imagem em duas etapas
  Scenario: Desenvolver conceito e gerar imagem definitiva
    Given o briefing de direção de arte aprovado pelo Art Director
    Quando o Image Creator executa a etapa 1 (conceitos visuais)
    Então são apresentados conceitos para avaliação
    Quando o usuário avalia e seleciona um conceito
    E o Image Creator executa a etapa 2 (imagem definitiva)
    Então a imagem final é gerada com a proporção e paleta definidas
    E não são geradas imagens adicionais sem critério de avaliação
```

#### RF-013 — Revisão de qualidade
```gherkin
Feature: Revisão de qualidade
  Scenario: Material reprovado retorna para revisão
    Given um material submetido ao Quality Reviewer
    Quando o Quality Reviewer identifica que um critério de qualidade não foi atingido
    Então o material retorna para revisão
    E o status não avança para "Aprovado"

  Scenario: Material aprovado avança para "Aprovado"
    Given um material que atende todos os critérios de qualidade
    Quando o Quality Reviewer avalia o material
    Então o status do material passa para "Aprovado"
    E aguarda aprovação humana para publicação
```

#### RF-014 — Estados de publicação e aprovação humana
```gherkin
Feature: Estados de publicação
  Scenario: Publicação exige aprovação humana
    Given um material no estado "Aprovado"
    Quando se tenta publicar automaticamente sem aprovação humana
    Então a publicação não é executada
    E o material permanece em "Aprovado" ou é exportado para publicação manual
```

---

## 4. Requisitos Não-Funcionais

| ID | Categoria | Descrição | Métrica / Tolerância |
|----|-----------|-----------|----------------------|
| RNF-001 | Performance | Tempo de resposta da geração de conteúdo por agente | p95 < 5s por chamada de modelo (modelos gratuitos) |
| RNF-002 | Performance | Tempo de geração de imagem (etapa 2) | < 60s por imagem (hardware local compatível) |
| RNF-003 | Segurança | Credenciais de plataformas sociais armazenadas criptografadas | LGPD; AES-256 ou equivalente |
| RNF-004 | Segurança | Nenhuma publicação automática sem aprovação humana | 100% das publicações exigem aprovação |
| RNF-005 | Usabilidade | Interface de revisão e aprovação acessível | WCAG 2.1 AA |
| RNF-006 | Confiabilidade | Disponibilidade dos modelos gratuitos via OpenRouter | Sujeito a limites de taxa (20 RPM / 50 RPD no plano gratuito) |
| RNF-007 | Escalabilidade | Suporte a múltiplos projetos editoriais independentes | Sem limite fixo no SRS; validar em teste de carga |
| RNF-008 | Manutenção | Arquitetura permite substituição de modelo sem retrabalho | Router por capacidade com fallback |
| RNF-009 | Portabilidade | Funcionar em qualquer stack suportada pelo OpenCode | Agnóstico a linguagem (Node/Python/Go/Java/PHP) |
| RNF-010 | Custo | Custo por publicação dentro do orçamento definido | Priorizar modelos gratuitos; indicadores visíveis |
| RNF-011 | Prototipação | Toda tela deve passar por protótipo APROVADO antes de implementação | Ciclo PROPOSTA → NAVEGÁVEL → VALIDADA → APROVADA → IMPLEMENTADA |
| RNF-012 | Observabilidade | Registro de chamadas de modelo (trace.json: modelo, tokens, custo, latência) | Todo uso de IA gera trace |

---

## 5. Requisitos de Interface / Integrações

### 5.1 Interfaces
- Interface de cadastro e configuração de projeto editorial (memória editorial).
- Interface de entrada de assunto e seleção de plataformas.
- Interface de revisão e aprovação de materiais (Qualidade).
- Interface de exportação de material final (publicação manual).
- Todas as telas seguem o ciclo de prototipação (dono `@protomaster`).

### 5.2 Integrações

| Sistema | Tipo | Protocolo | Observações |
|---------|------|-----------|-------------|
| OpenRouter (modelos gratuitos) | API de LLM | HTTP (Chat Completions compatível OpenAI) | Chave única; variantes `:free` a US$ 0 |
| ComfyUI (geração de imagem local) | API / execução local | HTTP (127.0.0.1:8188) ou execução direta | FLUX.1 [schnell] / FLUX.2 [klein] 4B / SDXL |
| Serviço de imagem hospedado (ex. Leonardo AI) | API externa | HTTP | Cota gratuita diária; fallback |
| MCP Filesystem | Leitura/escrita de arquivos | MCP (stdio) | Referência oficial; pastas autorizadas |
| MCP Fetch | Consulta de páginas web | MCP (stdio) | Referência oficial; conversão para markdown |
| MCP Git | Leitura/manipulação de repositórios Git | MCP (stdio) | Referência oficial; repositório local |
| MCP pesquisa web (Tavily/Exa/Perplexity/Brave) | Busca na web | MCP (stdio/HTTP) | Servidores oficiais de fornecedor; exigem chave de API |
| APIs oficiais das plataformas sociais | Publicação / exportação | HTTP (REST) | LinkedIn, Instagram, TikTok, etc. — a validar autenticação e permissões |
| Banco de dados (memória editorial, histórico) | Armazenamento | SQL / NoSQL | A definir na fase de implementação |

> **Nota:** Não há servidor MCP oficial de referência pronto para produção para geração de imagens nem para publicação em redes sociais (conforme benchmark). Essas integrações exigem desenvolvimento próprio (MCP tipado com auth + rate-limit) ou chamada direta às APIs oficiais.

---

## 6. Regras de Negócio

| ID | Descrição | Fonte | RF Associado |
|----|-----------|-------|--------------|
| RN-001 | Todo material deve passar por revisão do Quality Reviewer antes de atingir o estado "Aprovado". | Controle de qualidade | RF-013, RF-014 |
| RN-002 | A publicação automática é proibida sem aprovação humana explícita. | Controle de qualidade / governança | RF-014 |
| RN-003 | O conteúdo gerado para cada plataforma deve ser independente (não cópia idêntica entre canais). | Plataformas digitais | RF-008 |
| RN-004 | A geração de imagem segue exatamente duas etapas: conceito (avaliação) → definitiva. Múltiplas gerações sem critério são proibidas. | Geração de imagens | RF-010 |
| RN-005 | A identidade editorial (tom, cores, estilo) configurada no projeto deve ser respeitada em todos os materiais da série. | Memória editorial | RF-002, RF-009 |
| RN-006 | Modelos pagos da OpenAI são proibidos como dependência. | Restrição de modelos | — |
| RN-007 | Credenciais de plataformas sociais devem ser armazenadas criptografadamente (LGPD). | Segurança / LGPD | RNF-003 |
| RN-008 | Toda tela de interface deve ter protótipo APROVADO antes de iniciar a implementação (dono `@protomaster`). | Prototipação | RNF-011 |
| RN-009 | O sistema deve registrar trace.json para cada uso de IA (modelo, tokens, custo, latência). | Observabilidade / FinOps | RNF-012 |
| RN-010 | Deve haver mecanismos para evitar chamadas desnecessárias a modelos (cache, agrupamento, router por capacidade). | Controle de custos | RF-018 |

---

## 7. Matriz de Rastreabilidade (RF × RN × Testes)

| RF | RN | Teste (TC) | Tipo de Teste |
|----|----|------------|---------------|
| RF-001 | RN-005 | TC-001 | Funcional (cadastro de projeto) |
| RF-002 | RN-005 | TC-002 | Funcional (identidade editorial) |
| RF-003 | RN-003 | TC-003 | Funcional (ativar/desativar plataforma) |
| RF-004 | — | TC-004 | Funcional (entrada de assunto) |
| RF-005 | — | TC-005 | Funcional (pesquisa via MCP) |
| RF-006 | — | TC-006 | Funcional (estratégia editorial) |
| RF-007 | RN-001 | TC-007 | Funcional (geração de conteúdo) |
| RF-008 | RN-003 | TC-008 | Funcional (adaptação por plataforma) |
| RF-009 | RN-005 | TC-009 | Funcional (briefing de imagem) |
| RF-010 | RN-004 | TC-010 | Funcional (geração imagem 2 etapas) |
| RF-011 | RN-005 | TC-011 | Funcional (finalização gráfica) |
| RF-012 | — | TC-012 | Funcional (SEO) |
| RF-013 | RN-001 | TC-013 | Funcional (revisão de qualidade) |
| RF-014 | RN-002 | TC-014 | Funcional (aprovação humana) |
| RF-015 | — | TC-015 | Funcional (exportação manual) |
| RF-016 | — | TC-016 | Funcional (versionamento/histórico) |
| RF-017 | RN-009 | TC-017 | Não-funcional (custo) |
| RF-018 | RN-010 | TC-018 | Não-funcional (limites de uso) |

---

## 8. Riscos e Mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Limite de 50 req/dia nos modelos gratuitos `:free` | Alto | Alta | Cache semântico, router por capacidade, reservar modelos pesados para tarefas complexas, agrupar chamadas |
| FLUX.1 [dev] sem licença comercial | Alto | Média | Usar FLUX.1 [schnell] ou FLUX.2 [klein] 4B (Apache 2.0) para uso comercial |
| GPU insuficiente para ComfyUI local | Médio | Média | Alternativa hospedada (Leonardo AI/Firefly) como fallback; documentar requisitos de VRAM |
| APIs oficiais de redes sociais restringem publicação automática | Médio | Alta | Estados Rascunho/Aprovado/Publicado + exportação para publicação manual |
| Chaves de API MCP expostas | Alto | Baixa | Armazenar criptografado, rate-limit, escopo mínimo de permissões |
| Modelos gratuitos deixam de estar disponíveis | Médio | Média | Não fixar modelos permanentemente; router com fallback; revisar coleção OpenRouter periodicamente |
| Retrabalho por falta de protótipo aprovado | Médio | Média | Ciclo PROPOSTA → NAVEGÁVEL → VALIDADA → APROVADA → IMPLEMENTADA obrigatório (RN-008) |
| Conteúdo não original / alucinações de pesquisa | Médio | Média | Quality Reviewer verifica fontes e originalidade; Researcher cita fontes |

---

## 9. Glossário

| Termo | Definição |
|-------|-----------|
| Projeto editorial | Conjunto de configurações (objetivo, público, tom, identidade visual, plataformas, séries) que orienta a geração de materiais |
| Memória editorial | Armazenamento dos projetos editoriais e histórico de publicações |
| Direção de arte | Definição de conceito visual, estilo, composição, iluminação, paleta, elementos, proporção para cada imagem |
| Briefing de imagem | Especificação gerada pelo Art Director que orienta a geração da imagem |
| Rascunho / Aprovado / Publicado | Três estados de ciclo de vida de um material |
| Trace.json | Registro de uso de IA (modelo, tokens, custo, latência) |
| DoR / DoD | Definition of Ready / Definition of Done (critérios para iniciar e finalizar uma User Story) |

---

*Próxima etapa: FASE 4 — UML + Arquitetura (diagramas em Mermaid e ADRs).*
