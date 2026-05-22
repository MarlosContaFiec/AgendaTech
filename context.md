## CONTEXTO COMPLETO DO PROJETO — AgendaTech

Estou construindo um sistema de agendamentos completo (backend + frontend).
Preciso de ajuda para finalizar o frontend que está quebrado.
O backend está 100% funcional.

---

## STACK

Backend:
- Node.js 22 + Express
- MySQL 8.0
- Docker Compose (api + mysql + adminer)
- JWT (access 15min + refresh 7d)
- bcryptjs, nodemailer, multer, joi, node-cron

Frontend:
- React 18 + Vite
- React Router v6
- Tailwind CSS
- react-icons (Fi = Feather Icons)
- Fetch API (sem axios)

---

## BANCO DE DADOS (18 tabelas)

usuario (id, tipo[cliente|empresa], email, senha_hash, ativo, foto, email_verificado, token_verificacao, token_expira_em)
cliente (id FK usuario, nome, cpf, verificado, data_nascimento, telefone, score DECIMAL(5,2) default 100)
empresa (id FK usuario, cnpj, razao_social, nome_fantasia, telefone, cep, endereco, numero, complemento, bairro, cidade, estado, nicho, sub_nicho, site, verificada, max_agendamentos_global, metodo_fila[ordem_chegada|score])
empresaProfile (id, empresa_id UNIQUE, descricao, logo_url, cor_primaria, cor_secundaria, ativo)
servico (id, empresa_id FK, nome, descricao, duracao_minutos, preco_base, ativo, aceitamento_automatico, max_por_horario, hora_inicio, hora_fim, intervalo_minutos)
servico_horario (id, servico_id FK, dia_semana 0-6 ou NULL=todos, hora_inicio, hora_fim, ativo)
servico_tag (servico_id FK, tag_id FK) — N:N
tags (id, empresa_id FK, nome, label, cor, aceita_agendamento, info)
regras (id, empresa_id FK, tag_id FK, tipo[padrao|excecao|unico], dia_semana, qnd_ocorre, mes, unico_dia, unico_mes, unico_ano, unico_repete_anual, prioridade 0-255, ativo)
agendamento (id, cliente_id FK, servico_id FK, empresa_id FK, data_agendamento, hora_inicio, hora_fim, status_agendamento[pendente|confirmado|cancelado|concluido], notas, valor, horario_estendido, motivo_estendido, criado_em, aceito_em, cancelado_em, reagendado_de, motivo_cancelamento)
avaliacao (id, agendamento_id FK, cliente_id FK, estrelas 1-5, feedback, resposta_empresa)
mensagem (id, empresa_id FK, cliente_id FK, tipo, mensagem, automatica, data_envio, enviado_por[cliente|empresa])
pontuacao_log (id, cliente_id FK, agendamento_id FK, variacao, score_resultante, motivo)
dependente (id, cliente_id FK, nome, idade)
documento_cliente (id, cliente_id FK, tipo[rg|certidao_nascimento|laudo_medico|comprovante_residencia|outro], arquivo_url, status[pendente|aprovado|rejeitado], observacao)
solicitacao_horario (id, agendamento_id FK, minutos_extra 5-120, motivo, status[pendente|aceito|negado], resposta_empresa)
fila_espera (id, cliente_id FK, servico_id FK, empresa_id FK, data_agendamento, hora_inicio, status[aguardando|notificado|convertido|cancelado])
regra_empresa (id, empresa_id FK, tipo[notificacao|cancelamento|reagendamento], nome, descricao, antecedencia_horas, mensagem_template, tipo_notificacao, limite_horas, taxa_percentual, taxa_fixa, ativo)
chat_config (id, empresa_id UNIQUE, mensagem_abertura, ativo)
chat_faq (id, empresa_id FK, pergunta, resposta, ordem, ativo)
capacidade_horario (id, empresa_id FK, hora_inicio, hora_fim, max_agendamentos)
notificacao_log (id, empresa_id FK, cliente_id FK, agendamento_id FK, regra_id FK, tipo, mensagem, enviado_em, sucesso, erro)

---

## BACKEND (100% funcional)

Rotas da API:

PÚBLICAS (sem token):
GET  /api/empresas/destaques
GET  /api/empresas?busca=&nicho=&cidade=&estado=&pagina=&limite=
GET  /api/empresas/nichos
GET  /api/empresas/cidades
GET  /api/empresas/:id
GET  /api/empresas/:id/calendario?ano=&mes=
GET  /api/empresas/:id/disponibilidade?servico_id=&data=
GET  /api/mensagens/publico/:empresa_id/faq

AUTH:
POST /api/auth/register/cliente   — {nome, email, senha, cpf?, telefone?, data_nascimento?}
POST /api/auth/register/empresa   — {email, senha, cnpj, razao_social, nome_fantasia, telefone?, cep?}
GET  /api/auth/verificar/:token
POST /api/auth/reenviar-verificacao  — {email}
POST /api/auth/login               — {documento, senha}  ← documento detecta CPF(11) vs CNPJ(14) automaticamente
POST /api/auth/refresh             — {refresh_token}
GET  /api/auth/me

CLIENTE (token cliente):
GET/PUT /api/cliente/perfil
GET    /api/cliente/calendario
GET    /api/cliente/score
CRUD   /api/cliente/dependentes
CRUD   /api/documentos
POST   /api/solicitacoes
CRUD   /api/fila
PUT    /api/fila/:id/converter

EMPRESA (token empresa):
GET/PUT /api/empresa/perfil
GET    /api/empresa/dashboard
CRUD   /api/servicos
CRUD   /api/tags
CRUD   /api/regras
GET    /api/regras/calendario?ano=&mes=
CRUD   /api/regras-negocio
CRUD   /api/empresa/capacidades
GET/PUT /api/mensagens/chat-config
CRUD   /api/mensagens/chat-config/faq
GET    /api/solicitacoes/pendentes
PUT    /api/solicitacoes/:id/responder
GET    /api/fila/empresa

AMBOS:
CRUD   /api/agendamentos (rotas específicas por tipo)
CRUD   /api/avaliacoes
CRUD   /api/mensagens
GET    /api/notificacoes
POST   /api/upload/single  (multipart, campo "arquivo")
POST   /api/upload/multiple (multipart, campo "arquivos", até 5)

PADRÃO DE RESPOSTA:
Sucesso: { success: true, message: "...", data: {...} }
Erro:    { success: false, message: "...", errors: [...] }

MIDDLEWARE authenticate:
Decodifica JWT, coloca em req.user = { id, tipo, documento }

MIDDLEWARE validate(schema):
Valida req.body com Joi, stripUnknown: true

---

## PADRÕES DO FRONTEND

### Componentes UI criados (em src/components/ui/):
Alert, Badge, Button, Input, Select, Textarea, Modal, Toast, Spinner, ScoreRing
Exportam tudo por index.js

### Componentes Shared (em src/components/shared/):
Logo, PasswordStrength, StepIndicator, BadgeClassif, CalendarGrid, ChatBot, ModalAvaliacao

### Componentes Layout (em src/components/layout/):
AuthLayout — para login/cadastro
AppLayout — sidebar + navegação + outlet (DASHBOARD)

### Context:
AuthContext — user, token, login(), logout(), isAuthenticated
user = { id, tipo, documento, token }

### Serviço de API:
src/services/api.js
async function api(method, path, body, token) → fetch JSON → retorna {success, data, message}

src/services/auth.js
apiLogin(documento, senha), apiRefresh(token)

### Utils:
utils/masks.js — cpf, cnpj, phone, cep, currency
utils/validators.js — validateCPF, validateCNPJ, validateEmail, etc
utils/formatters.js — formatCurrency, formatDate, formatTime
utils/calculators.js — scoreColor, scoreLabel, etc

### AppLayout — Sidebar com seções por tipo:

EMPRESA: Visão Geral, Serviços, Agendamentos, Solicitações, Calendário, Configurações, Notificações, Perfil, Perfil Público
CLIENTE: Explorar, Meus Agendamentos, Dependentes, Documentos, Calendário, Fila de Espera, Notificações, Perfil

### Rotas do frontend (React Router):
/login — TelaLogin
/login/escolha — TelaEscolhaTipo
/login/cadastro/:tipo — TelaCadastro
/login/verificar — TelaVerificarEmail
/login/sucesso — TelaSucesso
/verificar/:token — VerificarEmail (confirma email)
/dashboard — AppLayout com sections baseadas em URL
/* — redirect para /login

### SECTIONS criadas (em src/pages/Dashboard/sections/):

EMPRESA:
- VisaoGeral.jsx — dashboard com métricas
- Servicos.jsx — CRUD de serviços com tags e horários
- AgendamentosEmpresa.jsx — lista + ações (aceitar/recusar/concluir)
- Solicitacoes.jsx — pedidos de horário estendido
- Notificacoes.jsx — lista de notificações
- PerfilEmpresa.jsx — editar perfil + upload logo + color picker
- PerfilEmpresaPublico.jsx — preview do perfil público
- Calendario.jsx — calendário com tags e regras
- Configuracoes.jsx — regras de negócio + capacidade + chat/faq

CLIENTE:
- Explorar.jsx — buscar empresas + filtro cidade dinâmico
- MeusAgendamentos.jsx — histórico + cancelar/reagendar + avaliar
- PerfilCliente.jsx — editar perfil + score + dependentes inline
- CalendarioCliente.jsx — calendário pessoal com agendamentos
- Dependentes.jsx — CRUD de dependentes
- Documentos.jsx — upload + status de documentos
- FilaEspera.jsx — gerenciar posições na fila

### PROBLEMA ATUAL:
Muitos arquivos do frontend foram criados rápido demais e possuem warnings/erros:
- useEffect com dependency array faltando dependências
- Imports não usados
- componentes nunca testados
- Alguns podem não compilar

### OBJETIVO:
Revisar e corrigir o frontend arquivo por arquivo, garantindo que cada um compile sem erro antes de passar pro próximo.
Backend já funciona, é só subir com docker-compose up.

---

## DOCKER

docker-compose.yml:
- mysql:8.0 na porta 3306
- api (Node 22 Alpine) na porta 3000, volume ./src:/app/src para hot reload
- adminer na porta 8080
- rede: agendamento_net
- healthcheck no mysql antes da api subir

Para subir: docker compose up --build
Para rebuild: docker compose down && docker compose build --no-cache api && docker compose up

---

## JOBS AUTOMÁTICOS (rodam no servidor)

Notificações — a cada hora, envia lembretes conforme regras
Pontuação — a cada 15min, marca no-show e aplica -1 no score
Fila expiração — a cada 2h, notificação expirada → cancela e notifica próximo
Solicitação expiração — diário 8h, solicitações pendentes 48h → nega

---

## O QUE PRECISO AGORA

1. Revisar frontend arquivo por arquivo
2. Garantir que compila sem erro/warning
3. Fluxo login completo funcionando (documento + senha → dashboard)
4. Ir section por section testando

Sem pressa. Um arquivo por vez. Analisar antes de escrever. Testar antes de passar pro próximo.