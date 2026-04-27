# 🗓️ agendatech Backend

Sistema completo de agendamentos e eventos. API REST em **Node.js** com **MySQL 8**, containerizado com **Docker Compose**.

---

## 🚀 Subindo o projeto

### Pré-requisitos
- Docker + Docker Compose

### 1 — Clone e configure

```bash
cp .env.example .env
# Edite .env se quiser trocar senhas/secrets
```

### 2 — Suba tudo

```bash
docker compose up -d
```

Isso sobe **3 containers**:
- `agendatech_mysql` — MySQL 8 na porta 3306
- `agendatech_api`   — API Node.js na porta 3000
- `agendatech_adminer` — UI do banco em http://localhost:8080

O container da API **roda as migrações automaticamente** antes de iniciar.

### 3 — Seed de dados de teste (opcional)

```bash
docker compose exec api node src/database/migrate.js --seed
```

### 4 — Rode os testes (end-to-end, sem frontend)

```bash
docker compose exec api node src/test/runner.js
```

### Health check

```bash
curl http://localhost:3000/health
```

---

## 📦 Estrutura do projeto

```
src/
├── app.js                        # Express app
├── server.js                     # Entry point
├── config/
│   ├── env.js                    # Variáveis de ambiente
│   └── database.js               # Pool MySQL (mysql2/promise)
├── database/
│   ├── migrate.js                # Runner de migrações
│   └── sql/
│       ├── 001_schema.sql        # Schema original (intacto)
│       ├── 002_additions.sql     # Campos e tabelas adicionados
│       └── 003_seed.sql          # Dados de teste
├── middlewares/
│   ├── auth.js                   # JWT authenticate / requireEmpresa / requireCliente
│   ├── validate.js               # Joi schemas + middleware
│   └── errorHandler.js           # Handler global de erros
├── utils/
│   ├── cpf.js                    # Validador CPF (algoritmo Receita Federal)
│   ├── cnpj.js                   # Validador CNPJ
│   ├── calendarEngine.js         # Motor de resolução de tags por data
│   ├── templateEngine.js         # Substituição de variáveis em mensagens
│   └── response.js               # Respostas JSON padronizadas
├── jobs/
│   ├── index.js                  # Registra crons (node-cron)
│   ├── notificacoes.js           # Lembretes automáticos (de hora em hora)
│   └── pontuacao.js              # Score por não comparecimento (a cada 15min)
├── modules/
│   ├── auth/                     # Registro, login, refresh, /me
│   ├── empresa/                  # Perfil, dashboard, capacidades
│   ├── servico/                  # CRUD de serviços + horários + tags
│   ├── tags/                     # CRUD de tags de calendário
│   ├── regras/                   # Regras de calendário (padrão/exceção/único)
│   ├── regras_negocio/           # Políticas da empresa (notif/cancelamento/reagendamento)
│   ├── agendamento/              # Booking, slots, aceitar/recusar/concluir/cancelar
│   ├── avaliacao/                # Avaliações e respostas da empresa
│   ├── mensagem/                 # Chat empresa↔cliente, FAQ, chat-config
│   ├── cliente/                  # Perfil, score, documentos, cartões, calendário
│   └── publico/                  # Busca pública de empresas, perfil, disponibilidade
└── test/
    └── runner.js                 # Suite de testes completa (sem framework externo)
```

---

## 🔑 Endpoints principais

### Auth
| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/api/auth/register/empresa` | Cadastra empresa |
| POST | `/api/auth/register/cliente` | Cadastra cliente |
| POST | `/api/auth/login` | Login (retorna access + refresh token) |
| POST | `/api/auth/refresh` | Renova tokens |
| GET  | `/api/auth/me` | Dados do usuário logado |

### Público (sem auth)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/api/empresas` | Lista/busca empresas (`?busca=x&nicho=y&cidade=z`) |
| GET | `/api/empresas/destaques` | Mais agendadas nas últimas 24h |
| GET | `/api/empresas/nichos` | Nichos e sub-nichos disponíveis |
| GET | `/api/empresas/:id` | Perfil público da empresa |
| GET | `/api/empresas/:id/disponibilidade?servico_id=x&data=YYYY-MM-DD` | Slots livres |
| GET | `/api/empresas/:id/calendario?ano=2025&mes=4` | Calendário do mês |

### Empresa (JWT tipo=empresa)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET/PUT | `/api/empresa/perfil` | Perfil + dados do empresaProfile |
| GET | `/api/empresa/dashboard` | Métricas e últimos agendamentos |
| GET/POST/DELETE | `/api/empresa/capacidades` | Limite de agendamentos por faixa horária |
| GET/POST/PUT/DELETE | `/api/servicos` | CRUD de serviços (com horários e tags) |
| GET/POST/PUT/DELETE | `/api/tags` | CRUD de tags de calendário |
| GET/POST/PUT/DELETE | `/api/regras` | Regras de calendário (padrão/exceção/único) |
| GET | `/api/regras/calendario?ano=&mes=` | Resolve mês inteiro |
| GET | `/api/regras/dia?data=YYYY-MM-DD` | Resolve dia específico |
| GET/POST/PUT/DELETE | `/api/regras-negocio` | Políticas de notificação/cancelamento |
| GET | `/api/regras-negocio/:id/preview` | Preview do template renderizado |
| GET | `/api/regras-negocio/template/vars` | Variáveis disponíveis para templates |
| GET | `/api/agendamentos/empresa` | Lista agendamentos da empresa |
| PUT | `/api/agendamentos/:id/aceitar` | Aceita agendamento pendente |
| PUT | `/api/agendamentos/:id/recusar` | Recusa agendamento |
| PUT | `/api/agendamentos/:id/concluir` | Conclui e aplica +1 no score |
| GET | `/api/avaliacoes` | Lista avaliações recebidas |
| GET | `/api/avaliacoes/stats` | Estatísticas de avaliações |
| PUT | `/api/avaliacoes/:id` | Responde avaliação |
| GET | `/api/mensagens/conversas` | Lista todas as conversas |
| GET/POST | `/api/mensagens/conversas/:cliente_id` | Histórico e envio de mensagem |
| GET/PUT | `/api/mensagens/chat-config` | Configura mensagem de abertura |
| POST/PUT/DELETE | `/api/mensagens/chat-config/faq` | Gerencia FAQ |

### Cliente (JWT tipo=cliente)
| Método | Rota | Descrição |
|--------|------|-----------|
| GET/PUT | `/api/cliente/perfil` | Perfil do cliente |
| GET | `/api/cliente/score` | Histórico de pontuação |
| GET/POST | `/api/cliente/documentos` | Documentos enviados |
| GET/POST/DELETE | `/api/cliente/cartoes` | Cartões salvos (tokenizados) |
| GET | `/api/cliente/calendario` | Calendário pessoal de agendamentos |
| POST | `/api/agendamentos` | Cria agendamento |
| GET | `/api/agendamentos/cliente` | Lista agendamentos |
| PUT | `/api/agendamentos/:id/cancelar` | Cancela (aplica taxa se couber) |
| PUT | `/api/agendamentos/:id/reagendar` | Reagenda (valida política de prazo) |
| GET | `/api/agendamentos/slots?empresa_id=&servico_id=&data=` | Slots disponíveis |
| POST | `/api/avaliacoes/agendamento/:id` | Avalia agendamento concluído |
| POST | `/api/mensagens/empresa/:empresa_id` | Envia mensagem para empresa |

---

## ⚙️ Variáveis de ambiente (`.env`)

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `DB_HOST` | `mysql` | Host do MySQL |
| `DB_PORT` | `3306` | Porta |
| `DB_NAME` | `agendamento` | Nome do banco |
| `DB_USER` | `agendamento` | Usuário |
| `DB_PASS` | — | Senha |
| `JWT_SECRET` | — | **Troque antes de produção!** |
| `JWT_REFRESH_SECRET` | — | Secret do refresh token |
| `JWT_EXPIRES_IN` | `15m` | Validade do access token |
| `JWT_REFRESH_EXPIRES_IN` | `7d` | Validade do refresh token |
| `PORT` | `3000` | Porta da API |
| `NODE_ENV` | `development` | Ambiente |
| `JOBS_ENABLED` | `true` | Liga/desliga os cron jobs |
| `JOB_NOTIFICACOES_CRON` | `0 * * * *` | Cron de lembretes (de hora em hora) |
| `JOB_PONTUACAO_CRON` | `*/15 * * * *` | Cron de score (a cada 15min) |

---

## 🧠 Motor de calendário

A lógica de resolução de tags por data está em `src/utils/calendarEngine.js`:

1. Carrega todas as regras ativas da empresa
2. Filtra as que se aplicam à data (`padrao`, `excecao`, `unico`)
3. Ordena por `prioridade DESC` — **maior prioridade ganha**
4. Retorna as tags efetivas; qualquer tag com `aceita_agendamento=0` bloqueia o dia

**Exemplo:** Domingo tem tag "Fechado" (prioridade 5), mas Páscoa tem tag "Aberto" (prioridade 10) → Páscoa abre.

---

## 📊 Sistema de Score

| Evento | Variação |
|--------|----------|
| Compareceu | +1.00 |
| Atraso | -0.10 |
| Cancelamento tardio | -0.50 |
| Não compareceu | -1.00 |

Score vai de 0 a 100 e é exibido para a empresa durante aceitamento manual.

---

## 🔒 Segurança

- Senhas com bcrypt (salt rounds: 10)
- JWT com access token (15min) + refresh token (7d)
- Rate limiting global por IP
- Helmet para headers HTTP
- Validação de CPF (algoritmo Receita Federal) e CNPJ no cadastro
- Cada empresa só acessa seus próprios dados (isolamento por `empresa_id`)
- Tokens de cartão são armazenados apenas como referência de gateway (nunca dados reais)

---

## 🐳 Adminer (UI do banco)

Acesse **http://localhost:8080** com:
- **Sistema:** MySQL
- **Servidor:** mysql
- **Usuário:** agendamento
- **Senha:** agendamento@123
- **Base:** agendamento

---

## 📖 Mudanças no banco

Veja `CHANGES.md` para a justificativa completa de cada campo e tabela adicionados ao schema original.
