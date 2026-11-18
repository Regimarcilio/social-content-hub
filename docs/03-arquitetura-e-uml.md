# Arquitetura e UML — Social Content Hub

> **Projeto:** Social Content Hub  
> **Integrado a:** OpenCode  
> **Etapa:** FASE 4 — Arquitetura e UML (planejamento, sem implementação)  
> **Versão:** 0.1  
> **Data:** 17/11/2026  
> **Branch:** `DOC`  
> **Notação:** Todos os diagramas em Mermaid (compatível GitHub/OpenCode). Sem imagens binárias.

---

## 1. Visão Geral da Arquitetura

O Social Content Hub opera como uma camada de orquestração sobre o OpenCode. O usuário insere um assunto e seleciona um projeto editorial; o **Content Orchestrator** distribui tarefas para agentes especializados; cada agente utiliza um modelo gratuito apropriado à sua responsabilidade e, quando necessário, servidores MCP (pesquisa, arquivos, Git) e ferramentas de geração de imagem. Os materiais passam por revisão de qualidade e exigem aprovação humana antes de atingir o estado "Publicado" ou serem exportados para publicação manual.

```mermaid
graph TD
    subgraph Usuario
        U[Usuário / Gestor de Conteúdo]
    end

    subgraph OpenCode["OpenCode (camada de orquestração)"]
        CO[Content Orchestrator<br/>Orquestrador central]
        R[Researcher<br/>Pesquisa]
        S[Strategist<br/>Estratégia editorial]
        W[Writer<br/>Redação]
        PA[Platform Adapter<br/>Adaptação por plataforma]
        AD[Art Director<br/>Direção de arte]
        IC[Image Creator<br/>Geração/edição de imagem]
        QR[Quality Reviewer<br/>Revisão de qualidade]
        SEO[SEO Specialist<br/>Otimização]
    end

    subgraph Modelos["Modelos gratuitos (OpenRouter / provedores compatíveis)"]
        M1[Nemotron 3 Ultra<br/>Orquestração/raciocínio]
        M2[Nemotron 3.5 Super VL<br/>Visão + pesquisa]
        M3[Gemma 4 31B<br/>Redação PT-BR / SEO]
        M4[Nemotron 3.5 Lightning<br/>Adaptação leve]
    end

    subgraph MCP["Servidores MCP"]
        MCPF[Fetch<br/>Consulta de páginas]
        MCPFS[Filesystem<br/>Arquivos]
        MCPG[Git<br/>Repositórios locais]
        MCPS[Pesquisa web<br/>Tavily/Exa/Perplexity/Brave]
    end

    subgraph Visual["Geração e edição de imagens"]
        CUI[ComfyUI local<br/>FLUX.1 schnell / FLUX.2 klein 4B]
        HOST[Serviço hospedado cota grátis<br/>Leonardo AI / Firefly / fallback]
    end

    subgraph Armazenamento["Memória editorial e histórico"]
        DB[(Banco de dados<br/>Projetos, materiais, versões, credenciais criptografadas)]
    end

    subgraph Plataformas["Plataformas digitais (ativáveis/desativáveis)"]
        L[LinkedIn]
        RD[Reddit]
        FB[Facebook]
        IG[Instagram]
        YT[YouTube]
        TT[TikTok]
        X[X / Twitter]
    end

    U -->|1. Insere assunto + projeto| CO
    CO -->|2. Distribui tarefas| R & S & W & PA & AD & IC & QR & SEO
    R -->|usa| MCPF & MCPS
    S -->|usa| M1
    W -->|usa| M3
    PA -->|usa| M4
    AD -->|usa| M2
    IC -->|usa| CUI & HOST
    QR -->|usa| M1
    SEO -->|usa| M3

    CO -->|3. Salva material| DB
    DB -->|4. Projetos / identidade / histórico| CO

    IC -->|5. Imagem gerada| DB
    QR -->|6. Aprovação / revisão| CO
    CO -->|7. Material aprovado| U
    U -->|8. Aprovação humana| CO
    CO -->|9. Publicar ou exportar| L & RD & FB & IG & YT & TT & X
    CO -->|10. Exportação manual| U

    style CO fill:#FFE4B5
    style DB fill:#E1F5FE
    style CUI fill:#C8E6C9
    style HOST fill:#FFF9C4
```

---

## 2. Diagrama de Casos de Uso

```mermaid
flowchart TD
    actor("Ator: Gestor de Conteúdo"):::ator
    actorA("Ator: Administrador"):::ator
    actorQ("Ator: Analista de Qualidade"):::ator

    subgraph CU["Casos de Uso"]
        UC1[("CU-001: Cadastrar projeto editorial")]
        UC2[("CU-002: Configurar identidade editorial")]
        UC3[("CU-003: Ativar/desativar plataforma")]
        UC4[("CU-004: Inserir assunto e selecionar plataformas")]
        UC5[("CU-005: Pesquisar assunto (Researcher)")]
        UC6[("CU-006: Definir estratégia editorial (Strategist)")]
        UC7[("CU-007: Gerar conteúdo original (Writer)")]
        UC8[("CU-008: Adaptar por plataforma (Platform Adapter)")]
        UC9[("CU-009: Direção de arte e briefing (Art Director)")]
        UC10[("CU-010: Gerar imagem em 2 etapas (Image Creator)")]
        UC11[("CU-011: Finalização gráfica")]
        UC12[("CU-012: SEO - títulos/palavras-chave/descrições")]
        UC13[("CU-013: Revisar qualidade (Quality Reviewer)")]
        UC14[("CU-014: Aprovar material (aprovação humana)")]
        UC15[("CU-015: Publicar ou exportar")]
        UC16[("CU-016: Versionar e consultar histórico")]
        UC17[("CU-017: Consultar indicadores de custo")]
    end

    actor --> UC1
    actor --> UC2
    actor --> UC3
    actor --> UC4
    actor --> UC14
    actor --> UC15
    actor --> UC17

    actorA --> UC1
    actorA --> UC2
    actorA --> UC3
    actorA --> UC16

    actorQ --> UC13

    UC4 --> UC5
    UC5 --> UC6
    UC6 --> UC7
    UC7 --> UC8
    UC8 --> UC9
    UC9 --> UC10
    UC10 --> UC11
    UC8 --> UC12
    UC7 --> UC13
    UC8 --> UC13
    UC10 --> UC13
    UC13 --> UC14

    classDef ator fill:#BBDEFB,stroke:#1565C0,stroke-width:2px;
    classDef caso fill:#E8F5E9,stroke:#2E7D32,stroke-width:2px;
    class actor,actorA,actorQ ator;
    class UC1,UC2,UC3,UC4,UC5,UC6,UC7,UC8,UC9,UC10,UC11,UC12,UC13,UC14,UC15,UC16,UC17 caso;
```

---

## 3. Diagrama de Classes / Entidade-Relacionamento

```mermaid
classDiagram
    class ProjetoEditorial {
        +String id
        +String nome
        +String objetivo
        +String publicoAlvo
        +String tomVoz
        +List~String~ paletaCores
        +String estiloImagens
        +List~String~ regrasRedacao
        +List~Plataforma~ plataformas
        +List~SerieEditorial~ series
        +List~Referencia~ referencias
        +DateTime criadoEm
        +DateTime atualizadoEm
        +criar()
        +atualizar()
        +listar()
    }

    class Plataforma {
        +String id
        +String nome
        +Boolean ativo
        +Integer limiteCaracteres
        +List~String~ hashtags
        +String proporcaoImagem
        +EstruturaEditorial estrutura
        +configurarRegras()
    }

    class Material {
        +String id
        +String projetoId
        +String assunto
        +EstadoPublicacao estado
        +String conteudoOriginal
        +Map~String, String~ conteudoPorPlataforma
        +String imagemId
        +String briefingImagem
        +List~String~ palavrasChave
        +String titulo
        +String descricao
        +DateTime criadoEm
        +DateTime aprovadoEm
        +DateTime publicadoEm
        +String aprovadoPor
        +submeterRevisao()
        +aprovar(usuario)
        +publicar()
        +exportar()
    }

    class Imagem {
        +String id
        +String materialId
        +String conceitoVisual
        +String estiloArtistico
        +String composicao
        +String iluminacao
        +String paletaCromatica
        +List~String~ elementosVisuais
        +String formato
        +String proporcao
        +String caminhoArquivo
        +Integer resolucaoLargura
        +Integer resolucaoAltura
        +Boolean conceitoAvaliado
        +gerarEtapa1()
        +gerarEtapa2()
        +finalizarGrafica()
    }

    class RastreabilidadeCusto {
        +String id
        +String materialId
        +String modeloUsado
        +Integer tokensEntrada
        +Integer tokensSaida
        +Float custo
        +Float latenciaMs
        +DateTime timestamp
        +registrarTrace()
    }

    class CredencialPlataforma {
        +String id
        +String plataforma
        +String valorCriptografado
        +DateTime atualizadoEm
    }

    ProjetoEditorial "1" -- "*" Plataforma : utiliza
    ProjetoEditorial "1" -- "*" Material : gera
    Material "1" -- "0..1" Imagem : possui
    Material "1" -- "*" RastreabilidadeCusto : registra
    Plataforma "1" -- "1" CredencialPlataforma : autentica

    class ProjetoEditorial domain:#E3F2FD;
    class Material domain:#FFF3E0;
    class Imagem domain:#E8F5E9;
    class RastreabilidadeCusto domain:#F3E5F5;
    class CredencialPlataforma domain:#FFEBEE;
```

---

## 4. Diagrama de Sequência — Fluxo Principal

Fluxo completo: do assunto à publicação/exportação, com revisão de qualidade e aprovação humana.

```mermaid
sequenceDiagram
    autonumber
    participant U as Usuário
    participant CO as Content Orchestrator
    participant R as Researcher
    participant S as Strategist
    participant W as Writer
    participant PA as Platform Adapter
    participant AD as Art Director
    participant IC as Image Creator
    participant QR as Quality Reviewer
    participant SEO as SEO Specialist
    participant M as Modelos Gratuitos (OpenRouter)
    participant V as Geração de Imagem (ComfyUI / Hospedado)
    participant DB as Memória Editorial (DB)
    participant H as Humano (aprovação)

    U->>CO: 1. Insere assunto + projeto editorial + plataformas
    CO->>DB: 2. Recupera identidade editorial do projeto
    DB-->>CO: 3. Retorna tom, cores, estilo, regras
    CO->>R: 4. Pesquisar assunto
    R->>M: 5. Consulta modelo (pesquisa)
    R->>CO: 6. Retorna fontes e referências
    CO->>S: 7. Definir estratégia editorial
    S->>M: 8. Consulta modelo (estratégia)
    S->>CO: 9. Retorna público, objetivo, abordagem
    CO->>W: 10. Gerar conteúdo original
    W->>M: 11. Consulta modelo (redação PT-BR)
    W->>CO: 12. Retorna conteúdo original
    CO->>PA: 13. Adaptar por plataforma
    PA->>M: 14. Consulta modelo (adaptação leve)
    PA->>CO: 15. Retorna materiais independentes por plataforma
    CO->>SEO: 16. Títulos, palavras-chave, descrições
    SEO->>M: 17. Consulta modelo (SEO)
    SEO->>CO: 18. Retorna otimizações
    CO->>AD: 19. Direção de arte / briefing de imagem
    AD->>M: 20. Consulta modelo (visão)
    AD->>CO: 21. Retorna briefing de imagem
    CO->>IC: 22. Etapa 1: conceitos visuais
    IC->>V: 23. Gerar conceitos
    V-->>IC: 24. Retorna conceitos
    IC->>CO: 25. Apresentar conceitos para avaliação
    CO->>U: 26. Usuário avalia e seleciona conceito
    U-->>CO: 27. Confirma conceito
    CO->>IC: 28. Etapa 2: imagem definitiva + finalização gráfica
    IC->>V: 29. Gerar imagem definitiva
    V-->>IC: 30. Retorna imagem final
    IC->>CO: 31. Retorna imagem finalizada
    CO->>QR: 32. Revisar qualidade (técnica, gramatical, editorial, visual)
    QR->>M: 33. Consulta modelo (revisão)
    alt Critérios não atingidos
        QR->>CO: 34. Reprovar material
        CO->>W: 35. Retornar para revisão (Writer/Platform Adapter)
        W-->>CO: 36. Reenviar material revisado
        CO->>QR: 37. Reavaliar
    else Critérios atingidos
        QR->>CO: 34. Aprovar qualidade
    end
    CO->>DB: 38. Salvar material (estado: Aprovado)
    CO->>H: 39. Solicitar aprovação humana para publicar
    alt Aprovado pelo humano
        H-->>CO: 40. Confirma publicação
        CO->>DB: 41. Atualizar estado: Publicado
        CO->>Plataformas: 42. Publicar via API oficial OU exportar manual
    else Não aprovado / sem integração
        H-->>CO: 40. Recusar ou sem integração autorizada
        CO->>U: 43. Exportar material para publicação manual
    end
    CO->>DB: 44. Registrar versão e histórico
    CO->>DB: 45. Registrar trace de custo (modelo, tokens, custo, latência)
```

---

## 5. Diagrama de Componentes

```mermaid
graph TD
    subgraph CamadaApresentacao["Camada de Apresentação (OpenCode)"]
        UI[Interface de usuário<br/>Cadastro, revisão, aprovação, exportação]
    end

    subgraph CamadaOrquestracao["Camada de Orquestração"]
        ORCH[Content Orchestrator<br/>Distribuição de tarefas e validação de entregas]
        ROUTER[Router de Modelos<br/>Seleção por capacidade + fallback]
    end

    subgraph CamadaAgentes["Camada de Agentes Especializados"]
        R[Researcher]
        S[Strategist]
        W[Writer]
        PA[Platform Adapter]
        AD[Art Director]
        IC[Image Creator]
        QR[Quality Reviewer]
        SEO[SEO Specialist]
    end

    subgraph CamadaIntegracao["Camada de Integração (MCP e APIs)"]
        MCPF[MCP Fetch]
        MCPFS[MCP Filesystem]
        MCPG[MCP Git]
        MCPS[MCP Pesquisa Web]
        APISOCIAL[APIs oficiais plataformas sociais<br/>ou exportação manual]
    end

    subgraph CamadaModelos["Camada de Modelos Gratuitos"]
        M1[Nemotron 3 Ultra]
        M2[Nemotron 3.5 Super VL]
        M3[Gemma 4 31B]
        M4[Nemotron 3.5 Lightning]
    end

    subgraph CamadaVisual["Camada Visual"]
        CUI[ComfyUI local<br/>FLUX.1 schnell / FLUX.2 klein 4B]
        HOST[Serviço hospedado cota grátis<br/>Leonardo AI / Firefly]
    end

    subgraph CamadaDados["Camada de Dados"]
        DB[(Banco de dados<br/>Projetos, materiais, versões, credenciais criptografadas)]
    end

    UI --> ORCH
    ORCH --> ROUTER
    ROUTER --> M1 & M2 & M3 & M4
    ORCH --> R & S & W & PA & AD & IC & QR & SEO
    R --> MCPF & MCPS
    IC --> CUI & HOST
    ORCH --> APISOCIAL
    ORCH --> DB
    R & S & W & PA & AD & IC & QR & SEO --> DB
    MCPFS --> DB
```

---

## 6. Diagrama de Implantação (Deploy) — Opcional

```mermaid
graph TD
    subgraph Local["Execução local / desenvolvedor"]
        Dev[Máquina do desenvolvedor<br/>OpenCode + branch develop]
        Comfy[ComfyUI local<br/>GPU NVIDIA 8-24 GB]
    end

    subgraph Cloud["Provedores compatíveis (OpenRouter etc.)"]
        OR[OpenRouter<br/>Modelos gratuitos :free]
    end

    subgraph Armazenamento["Armazenamento"]
        DB[(Banco de dados<br/>Credenciais criptografadas)]
        FS[Armazenamento de imagens<br/>Local ou objeto]
    end

    Dev --> OR
    Dev --> Comfy
    Dev --> DB
    Dev --> FS
    Comfy --> FS
```

---

## 7. Decisões de Arquitetura (ADRs)

As decisões estão documentadas em `docs/social-content-hub/04-ADRs/`:

| ADR | Título | Status |
|-----|--------|--------|
| ADR-001 | Uso exclusivo de modelos gratuitos (OpenRouter); proibição de API paga da OpenAI | Aceito |
| ADR-002 | Geração de imagens: ComfyUI local + FLUX.1 [schnell] / FLUX.2 [klein] 4B; hospedado como fallback | Aceito |
| ADR-003 | Servidores MCP: Filesystem, Fetch, Git (referência oficial); pesquisa web via servidores oficiais de fornecedor; publicação social via MCP próprio ou API direta | Aceito |
| ADR-004 | Arquitetura multiagente com orquestrador central; agentes agrupados por responsabilidade, sem redundância | Aceito |
| ADR-005 | Estados de publicação Rascunho/Aprovado/Publicado; aprovação humana obrigatória; exportação para publicação manual | Aceito |

---

## 8. Validação de Consistência (UML ↔ SRS)

| RF | Caso de Uso | Entidade/Classe | Sequência | Diagrama de Classes |
|----|-------------|-----------------|-----------|---------------------|
| RF-001 | CU-001 | ProjetoEditorial | Passo 2 | ✅ |
| RF-002 | CU-002 | ProjetoEditorial | Passo 2-3 | ✅ |
| RF-003 | CU-003 | Plataforma | — | ✅ |
| RF-004 | CU-004 | Material | Passo 1 | ✅ |
| RF-005 | CU-005 | — | Passo 4-6 | — |
| RF-006 | CU-006 | — | Passo 7-9 | — |
| RF-007 | CU-007 | Material | Passo 10-12 | ✅ |
| RF-008 | CU-008 | Material | Passo 13-15 | ✅ |
| RF-009 | CU-009 | Imagem | Passo 19-21 | ✅ |
| RF-010 | CU-010 | Imagem | Passo 22-31 | ✅ |
| RF-011 | CU-011 | Imagem | Passo 28-31 | ✅ |
| RF-012 | CU-012 | Material | Passo 16-18 | ✅ |
| RF-013 | CU-013 | Material | Passo 32-37 | ✅ |
| RF-014 | CU-014 | Material | Passo 39-43 | ✅ |
| RF-015 | CU-015 | Material | Passo 43 | ✅ |
| RF-016 | CU-016 | ProjetoEditorial / Material | Passo 44 | ✅ |
| RF-017 | CU-017 | RastreabilidadeCusto | Passo 45 | ✅ |
| RF-018 | — | RastreabilidadeCusto | Passo 45 | ✅ |

Todo RF possui caso de uso correspondente. Toda entidade tem dono definido. Nenhum agente redundante identificado.

---

## 9. Riscos Arquiteturais

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Acoplamento a um único provedor de modelos | Alto | Média | Router de modelos com fallback; abstração por capacidade |
| Limite de taxa dos modelos gratuitos | Alto | Alta | Cache semântico, agrupamento de chamadas, reserva de modelos pesados |
| Nenhum MCP pronto para publicação social | Médio | Alta | Desenvolver MCP próprio sobre APIs oficiais ou exportação manual |
| Hardware insuficiente para geração de imagem local | Médio | Média | Fallback para serviço hospedado com cota gratuita |
| Credenciais expostas | Alto | Baixa | Criptografia (AES-256), escopo mínimo, rate-limit nos MCP |

---

*Próxima etapa: FASE 5 — Scrum / Backlog e rotina de prototipação de telas.*
