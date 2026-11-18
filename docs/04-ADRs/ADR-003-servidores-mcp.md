# ADR-003 — Servidores MCP: quais usar, quais desenvolver

## Status
Aceito

## Contexto
O sistema precisa de integrações para pesquisa na internet, consulta de páginas, gerenciamento de arquivos, Git/GitHub, armazenamento de imagens, geração visual, ferramentas de design, banco de dados e publicação em plataformas sociais. Não se deve recomendar instalação de MCP sem verificar procedência, manutenção, compatibilidade e necessidade real. Priorizar integrações oficiais ou projetos confiáveis.

## Decisão
MCP de referência oficial (modelcontextprotocol/servers, MIT, sem chave de acesso, mantidos pelo grupo MCP):
- Filesystem: leitura/escrita/busca de arquivos em pastas autorizadas.
- Fetch: consulta de páginas web, conversão para markdown.
- Git: leitura, busca e manipulação de repositórios Git locais.

MCP oficiais de fornecedor (exigem chave de API; avaliar cota e custos):
- Pesquisa web: Tavily, Exa, Perplexity, Brave Search (escolher um conforme cota/necessidade).

Desenvolver próprio (MCP tipado com auth + rate-limit, padrão Módulo 3.6/3.7 da EngAI Global):
- Publicação em plataformas sociais: não há servidor MCP oficial de referência pronto para produção para LinkedIn/Instagram/TikTok/etc. Usar APIs oficiais das plataformas ou exportação para publicação manual.
- Geração visual: não há servidor MCP oficial de referência ativo para geração de imagens. Usar ComfyUI local ou chamada direta à API do serviço hospedado.

Não recomendados (sem validação de procedência/manutenção):
- Servidores comunitários não auditados.
- Servidores de referência arquivados (PostgreSQL, Brave Search antigo, GitHub antigo, etc.).

## Alternativas consideradas
- Usar apenas MCP de referência: insuficiente (não cobre publicação social nem geração de imagem).
- Desenvolver todos os MCP próprios: alto esforço de manutenção; rejeitado. Usar referência oficial onde disponível.

## Consequências
- Positivo: integrações com procedência verificada; segurança por auth + rate-limit nos MCP próprios; redução de retrabalho.
- Negativo: publicação social e geração visual exigem desenvolvimento próprio ou chamada direta a APIs; chaves de API de fornecedores devem ser armazenadas criptografadas.

## Relacionado
- SRS: seção 5.2 (Integrações), RNF-003.
- Benchmarks: docs/social-content-hub/02-benchmarks.md (seção 4).
