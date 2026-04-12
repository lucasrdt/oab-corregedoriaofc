# Requirements: Corregedoria Geral OAB-MA

**Defined:** 2026-03-18
**Core Value:** Qualquer pessoa acessa as informações da corregedoria e chega ao contato certo — colaboradores internos gerenciam o conteúdo do seu escopo sem depender de terceiros.

## v1 Requirements

### Identidade Visual & UI/UX

- [x] **UI-01**: Cores da OAB-MA aplicadas via CSS variables em todos os componentes (primary #0d53de, secondary #e00b0b sem opacidade degradada em elementos visíveis)
- [x] **UI-02**: Tipografia padronizada com hierarquia clara (heading/body, tamanhos consistentes)
- [x] **UI-03**: Espaçamento e border-radius uniformes em todos os componentes do site público e painel admin
- [x] **UI-04**: Painel admin redesenhado com menu lateral (sidebar) em vez de tabs horizontais
- [x] **UI-05**: Site público responsivo e funcionando corretamente em dispositivos móveis
- [x] **UI-06**: Remover lógica multi-tenant do frontend (Dashboard de criação de múltiplos sites removido)

### Site Público — Subseções

- [x] **SUB-01**: Página `/subsecoes` exibe cards de todas as subseções municipais com: nome da cidade, nome do corregedor(a), endereço, telefone e e-mail
- [x] **SUB-02**: Cards de subseções são gerenciados dinamicamente via painel admin (CRUD)
- [x] **SUB-03**: Navegação do site atualizada: item "Subseções" substitui "Casos/Empresas"

### Site Público — Cursos

- [x] **CUR-01**: Página `/cursos` exibe catálogo de cursos/eventos com: imagem, título, descrição, data e horário, modalidade/local e link externo de inscrição
- [x] **CUR-02**: Cursos são ordenados por data (mais próximos primeiro)
- [x] **CUR-03**: Cursos passados são visualmente distintos dos futuros (ex: opacidade reduzida ou seção separada)

### Sistema de Autenticação e Roles

- [x] **AUTH-01**: Tabela `user_roles` no Supabase com campos: user_id, role (admin/dev/presidente/user), subsection_id (nullable)
- [x] **AUTH-02**: RLS policies garantem que cada role vê apenas os dados do seu escopo
- [x] **AUTH-03**: Rota `/portal` ou `/acesso` com página de login pública (substitui rota de casos no menu)
- [x] **AUTH-04**: Após login, usuário é redirecionado automaticamente ao dashboard correto conforme seu role
- [x] **AUTH-05**: Role `admin` tem acesso a tudo: gestão do site, todas as subseções, criação/edição de usuários
- [x] **AUTH-06**: Role `dev` tem acesso à configuração do site e ao painel de conteúdo global
- [x] **AUTH-07**: Role `presidente` tem acesso à gestão dos casos da sua subseção específica (vinculado a subsection_id)
- [x] **AUTH-08**: Role `user` pode visualizar os casos da sua subseção específica (somente leitura)
- [x] **AUTH-09**: Role `admin` pode criar, editar e desativar usuários e atribuir roles via painel

### Portal Interno — Gestão de Casos por Subseção

- [x] **CASO-01**: Casos de subseção são privados — visíveis apenas para roles com acesso à subseção correspondente
- [x] **CASO-02**: `presidente` pode criar, editar e excluir casos da sua subseção
- [x] **CASO-03**: `user` pode visualizar casos da sua subseção
- [x] **CASO-04**: `admin` pode visualizar e editar casos de qualquer subseção
- [x] **CASO-05**: Upload de documentos nos casos funcional via Supabase Storage

### Upload de Arquivos

- [x] **UPL-01**: Upload de imagens funcional no editor de equipe (Supabase Storage)
- [x] **UPL-02**: Upload de documentos funcional nos casos de subseção (Supabase Storage)
- [x] **UPL-03**: Upload de imagem de cursos funcional (Supabase Storage)
- [x] **UPL-04**: Upload de logo/favicon/imagens do site funcional (Supabase Storage)

### Painel Admin — Conteúdo Global

- [x] **ADM-01**: Editor de Subseções no painel admin: CRUD com campos (cidade, corregedor, endereço, telefone, e-mail)
- [x] **ADM-02**: Editor de Cursos no painel admin: CRUD com campos (título, descrição, data/hora, modalidade, local, link, imagem)
- [x] **ADM-03**: Calendário, documentos globais e artigos continuam acessíveis a todos os roles com acesso ao painel

## v2 Requirements

### Futuras melhorias

- **V2-01**: Notificações internas entre roles
- **V2-02**: Histórico de atividades por subseção (audit log)
- **V2-03**: Exportação de relatórios por subseção (PDF)
- **V2-04**: Chatbot integrado ao portal interno para FAQ automatizado

## Out of Scope

| Feature | Reason |
|---------|--------|
| Sistema de matrícula em cursos | Divulgação apenas no v1 |
| App mobile nativo | Web-first |
| Multi-tenant (múltiplos sites) | Site único para OAB-MA |
| Chat em tempo real | WhatsApp já cobre, complexidade alta |
| Notificações push | v2 |
| Integração com sistemas externos da OAB | Fora do escopo de desenvolvimento |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| UI-01 | Phase 1 | Complete |
| UI-02 | Phase 1 | Complete |
| UI-03 | Phase 1 | Complete |
| UI-04 | Phase 1 | Complete |
| UI-05 | Phase 1 | Complete |
| UI-06 | Phase 1 | Complete |
| SUB-01 | Phase 2 | Complete |
| SUB-02 | Phase 2 | Complete |
| SUB-03 | Phase 2 | Complete |
| CUR-01 | Phase 2 | Complete |
| CUR-02 | Phase 2 | Complete |
| CUR-03 | Phase 2 | Complete |
| ADM-01 | Phase 2 | Complete |
| ADM-02 | Phase 2 | Complete |
| ADM-03 | Phase 2 | Complete |
| UPL-01 | Phase 2 | Complete |
| UPL-03 | Phase 2 | Complete |
| UPL-04 | Phase 2 | Complete |
| AUTH-01 | Phase 3 | Complete |
| AUTH-02 | Phase 3 | Complete |
| AUTH-03 | Phase 3 | Complete |
| AUTH-04 | Phase 3 | Complete |
| AUTH-05 | Phase 3 | Complete |
| AUTH-06 | Phase 3 | Complete |
| AUTH-07 | Phase 3 | Complete |
| AUTH-08 | Phase 3 | Complete |
| AUTH-09 | Phase 3 | Complete |
| CASO-01 | Phase 3 | Complete |
| CASO-02 | Phase 3 | Complete |
| CASO-03 | Phase 3 | Complete |
| CASO-04 | Phase 3 | Complete |
| CASO-05 | Phase 3 | Complete |
| UPL-02 | Phase 3 | Complete |

**Coverage:**
- v1 requirements: 33 total (note: prior count of 30 was incorrect)
- Mapped to phases: 33
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-18*
*Last updated: 2026-03-18 after roadmap creation*
