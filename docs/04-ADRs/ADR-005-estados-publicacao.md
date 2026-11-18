# ADR-005 — Estados de publicação Rascunho/Aprovado/Publicado; aprovação humana obrigatória

## Status
Aceito

## Contexto
O sistema deve controlar a qualidade dos materiais antes de qualquer publicação. Não se deve presumir que todas as plataformas permitem publicação automatizada. Deve-se prever três estados (Rascunho, Aprovado, Publicado) e, quando não existir integração autorizada, permitir exportação do material final para publicação manual.

## Decisão
- Ciclo de vida do material: Rascunho → Aprovado → Publicado.
- A publicação não é executada automaticamente sem aprovação humana explícita (RN-002).
- O Quality Reviewer avalia o material; se não atingir critérios, retorna para revisão (não avança para "Aprovado").
- Apenas um humano pode mover o material de "Aprovado" para "Publicado".
- Quando não houver integração autorizada com a plataforma, o material é exportado para publicação manual (RF-015).
- Plataformas ativáveis/desativáveis individualmente; inclusão futura sem reconstrução da arquitetura (RF-003).

## Alternativas consideradas
- Publicação automática direta via API oficial de todas as plataformas: rejeitado (não presumida; depende de validação de autenticação e permissões por plataforma).
- Apenas exportação manual (sem estado Publicado): rejeitado (não cobre integrações autorizadas futuras).

## Consequências
- Positivo: controle de qualidade, conformidade com restrições de plataformas, rastreabilidade de aprovação.
- Negativo: maior tempo entre geração e publicação (depende de aprovação humana); mitigado por fluxo de revisão claro e exportação rápida.

## Relacionado
- SRS: RF-014, RF-015, RN-001, RN-002.
- Arquitetura: docs/social-content-hub/03-arquitetura-e-uml.md (sequência, passo 39-43).
