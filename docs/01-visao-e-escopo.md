# Visão e Escopo — Social Content Hub

> **Projeto:** Social Content Hub  
> **Integrado a:** OpenCode  
> **Status:** Planejamento (FASE 1) — sem implementação  
> **Branch:** `DOC`  
> **Data:** 17/11/2026  
> **Material de referência do curso:** https://integrador-cedup.glide.page/dl/a400f7

---

## 1. Problema

A criação e publicação de conteúdo profissional em múltiplas plataformas digitais (LinkedIn, Reddit, Facebook, Instagram, YouTube, TikTok, X/Twitter) é hoje um processo manual, repetitivo e propenso a erros. Cada plataforma exige:

- Formatação de texto diferente (limite de caracteres, hashtags, tom de voz).
- Proporções e formatos de imagem específicos.
- Estrutura editorial própria (títulos, descrições, chamadas para ação).

O resultado é baixa consistência de identidade editorial, retrabalho por plataforma e dificuldade de manter qualidade visual premium com orçamento limitado.

---

## 2. Objetivo

Criar o **Social Content Hub**, uma estrutura inteligente integrada ao OpenCode capaz de transformar um assunto em publicações profissionais, adaptadas a cada plataforma, com:

- Agentes especializados (multiagente com orquestrador central).
- Skills reutilizáveis.
- Servidores MCP (pesquisa, arquivos, Git/GitHub, imagens, design, banco de dados, publicação).
- Modelos gratuitos do ecossistema OpenCode (sem dependência de API paga da OpenAI).
- Ferramentas de pesquisa na internet.
- Ferramentas de geração e edição de imagens (locais e/ou cota gratuita).
- Mecanismos de revisão e controle de qualidade.
- Identidade editorial configurável por projeto.
- Versionamento e histórico dos materiais.

Resultado esperado: qualidade editorial profissional e qualidade visual premium, com estratégia de custos equilibrada.

---

## 3. Público-Alvo e Personas

| Persona | Perfil | Necessidade principal |
|---------|--------|-----------------------|
| Gestor de Conteúdo | Cria e revisa publicações para múltiplas canais | Fluxo de revisão, aprovação humana, exportação para publicação manual |
| Community Manager | Opera redes sociais diariamente | Conteúdo pronto por plataforma, sem copiar-colar |
| Empreendedor / Marca Própria | Mantém identidade editorial consistente | Identidade visual configurável, continuidade entre séries |
| Analista de SEO | Otimiza alcance orgânico | Títulos, palavras-chave, descrições por plataforma |

---

## 4. Escopo

### 4.1 IN (incluído)

| Item | Descrição |
|------|-----------|
| Orquestração multiagente | Content Orchestrator central com especialistas (Researcher, Strategist, Writer, Platform Adapter, Art Director, Image Creator, Quality Reviewer, SEO Specialist) |
| Memória editorial | Cadastro de projetos editoriais com objetivo, público, tom de voz, identidade visual, paleta, estilo de imagens, regras de redação, plataformas, séries, histórico |
| Plataformas iniciais | LinkedIn, Reddit, Facebook, Instagram, YouTube, TikTok, X/Twitter (ativáveis/desativáveis individualmente) |
| Geração de imagens | Duas etapas: (1) desenvolvimento e avaliação de conceitos visuais; (2) geração e finalização da imagem definitiva. Direção de arte (conceito, estilo, composição, iluminação, paleta, elementos, proporção) |
| Controle de qualidade | Critérios objetivos de aprovação (originalidade, coerência, clareza, gramática, fundamentação, fontes, adequação à plataforma, limite de caracteres, identidade editorial, qualidade visual, legibilidade, resolução/proporção) |
| Estados de publicação | Rascunho → Aprovado → Publicado. Publicação não automática sem aprovação humana |
| Exportação | Exportação do material final para publicação manual quando não houver integração autorizada |
| Versionamento | Histórico e versionamento dos materiais |
| Estratégia de custos | Priorizar modelos gratuitos; indicadores de custo por publicação e por projeto; limites de uso |
| Documentação | SRS, UML, backlog, ADRs, plano de testes, roadmap, critérios de aceitação |

### 4.2 OUT (excluído desta etapa de planejamento)

| Item | Motivo |
|------|--------|
| Publicação automática direta via API oficial de todas as plataformas | Nem todas permitem; requer validação de autenticação e permissões (deixado para fase de integração) |
| Agendamento nativo de publicações | Não especificado como requisito desta etapa |
| Analytics de engajamento | Fase futura |
| Suporte a vídeos | Fase futura |
| Modo mobile nativo | Interface focada no fluxo editorial dentro do OpenCode |
| Fine-tuning de modelos | Descartado por padrão (RAG > Fine-tuning, per EngAI Global) |

---

## 5. Restrições

| Categoria | Restrição |
|-----------|-----------|
| Modelos | Utilizar prioritariamente modelos gratuitos do catálogo de provedores compatíveis com OpenCode. Não pressupor modelos pagos da OpenAI. Não utilizar API paga da OpenAI como dependência. |
| Imagens | Não presumir que modelos textuais gratuitos do OpenCode geram imagens. Separar geração visual dos agentes de redação. |
| Implementação | Esta etapa é exclusivamente de planejamento. Não implementar funcionalidades, não criar agentes, não instalar MCPs, não alterar configurações existentes, não modificar arquivos do ambiente. |
| Git | Trabalhar na branch `develop`; documentação na branch `DOC`; nunca commit direto em `main`/`master`; Conventional Commits. |
| Prototipação | Toda tela nasce protótipo (ciclo PROPOSTA → NAVEGÁVEL → VALIDADA → APROVADA → IMPLEMENTADA, dono `@protomaster`). Sem protótipo APROVADO, não há front/style. |
| Privacidade | LGPD: dados de autenticação e credenciais de plataformas armazenados criptografados. |
| Acessibilidade | Interface WCAG 2.1 AA (quando houver interface). |

---

## 6. Stakeholders

| Stakeholder | Papel | Interesses |
|-------------|-------|------------|
| Gestor de Conteúdo / Usuário final | Cria e aprova publicações | Interface intuitiva, fluxo de revisão, qualidade editorial |
| Community Manager | Opera canais sociais | Conteúdo adaptado por plataforma, rapidez |
| Administrador | Configura projetos, plataformas, credenciais | Controle de APIs, credenciais seguras, custos |
| Analista de Qualidade | Revisa materiais | Critérios objetivos de aprovação, rastreabilidade |
| Arquiteto de Software | Define arquitetura | Escolhas técnicas justificadas, manutenção, custos |

---

## 7. Exemplo de Projeto Editorial

**Nome:** A Arte da Guerra na Engenharia de Software  
**Objetivo:** Publicar reflexões que unam estratégia antiga (Sun Tzu) à engenharia de software moderna.  
**Público-alvo:** Engenheiros de software, tech leads, gestores de tecnologia.  
**Tom de voz:** Profissional, reflexivo, técnico e autoral.  
**Identidade visual:** Estratégia antiga combinada com engenharia moderna.  
**Estética:** Cinematográfica, sofisticada, contraste azul e dourado.  
**Plataformas:** LinkedIn, X/Twitter, Reddit.  
**Série:** Publicações semanais com continuidade entre capítulos.

---

## 8. Critérios de Sucesso

| Critério | Métrica alvo |
|----------|--------------|
| Qualidade editorial | Aprovação do Quality Reviewer em 100% dos materiais antes de "Aprovado" |
| Qualidade visual | Imagens em padrão premium, coerentes com a identidade editorial |
| Custo | Custo por publicação dentro do orçamento definido; prioridade a modelos gratuitos |
| Originalidade | Conteúdo original por plataforma (não cópia idêntica entre canais) |
| Aprovação humana | Nenhuma publicação executada automaticamente sem aprovação humana |
| Rastreabilidade | Todo RF mapeado para RN, caso de uso e teste |

---

## 9. Riscos Iniciais (alta resolução)

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Modelos gratuitos com limites de uso baixos | Alto | Média | Matriz de modelos com substituição; cache semântico; priorizar tarefas repetitivas em modelos leves |
| Geração de imagens premium sem custo | Alto | Média | Avaliar ComfyUI/Stable Diffusion/FLUX locais e serviços com cota gratuita; duas etapas (conceito → definitiva) para evitar desperdício |
| APIs oficiais de plataformas restringem publicação automática | Médio | Alta | Estados Rascunho/Aprovado/Publicado + exportação para publicação manual |
| Credenciais de plataformas expostas | Alto | Baixa | Armazenamento criptografado (LGPD), MCP com auth + rate-limit |
| Retrabalho por falta de protótipo aprovado | Médio | Média | Ciclo PROPOSTA → NAVEGÁVEL → VALIDADA → APROVADA → IMPLEMENTADA obrigatório |

---

## 10. Perguntas em aberto (para validação com o usuário)

1. Qual stack de implementação é preferida para o hub (Node/TypeScript, Python, ou outra)?
2. O usuário deseja que o planejamento considere hospedagem local (Docker) ou cloud para os serviços de imagem (ComfyUI/Stable Diffusion)?
3. Existe preferência por provedor específico de modelos gratuitos (OpenRouter, Ollama local, outros)?
4. Alguma das plataformas iniciais deve ser tratada como prioridade absoluta para integração futura?

---

*Próxima etapa: FASE 2 — Benchmarks referenciais (modelos gratuitos, geração de imagens, servidores MCP).*
