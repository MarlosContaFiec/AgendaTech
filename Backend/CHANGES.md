# CHANGES.md — Alterações e Adições ao Banco de Dados

> Todas as tabelas e campos originais foram **mantidos intactos**.
> Este arquivo documenta apenas o que foi **adicionado** e **por quê**.

---

## 1. Colunas Adicionadas em Tabelas Existentes

### `cliente`
| Campo | Tipo | Motivo |
|-------|------|--------|
| `score` | DECIMAL(5,2) DEFAULT 100.00 | Pontuação de confiabilidade do cliente (0–100). Regra: +1 presença, -0.1 atraso, -0.5 cancelamento tardio, -1 não compareceu. Exibida para empresa em aceitamento manual. |

### `empresa`
| Campo | Tipo | Motivo |
|-------|------|--------|
| `endereco` | VARCHAR(200) NULL | Endereço completo necessário para o calendário do cliente mostrar local do serviço. |
| `numero` | VARCHAR(20) NULL | Número do endereço. |
| `complemento` | VARCHAR(100) NULL | Complemento do endereço. |
| `bairro` | VARCHAR(100) NULL | Bairro para filtro de busca por localidade (ex: "empresas em Indaiatuba"). |
| `cidade` | VARCHAR(100) NULL | Cidade para filtro (descrição: "empresas em Indaiatuba"). |
| `estado` | CHAR(2) NULL | Estado para filtro geográfico. |
| `nicho` | VARCHAR(100) NULL | Categoria principal (beleza, culinária...) para o filtro do cliente. |
| `sub_nicho` | VARCHAR(100) NULL | Sub-categoria (restaurante mexicano, perfumaria...) — bônus de detalhes do filtro. |
| `max_agendamentos_global` | INT NULL | Limite global de agendamentos por horário independente do serviço (ex: barbearia com 5 cadeiras). NULL = sem limite. |
| `verificada` | BOOLEAN DEFAULT FALSE | Indica se o CNPJ/documentos foram verificados pelo sistema. |
| `site` | VARCHAR(255) NULL | URL do site da empresa para perfil público. |

### `servico`
| Campo | Tipo | Motivo |
|-------|------|--------|
| `aceitamento_automatico` | BOOLEAN DEFAULT TRUE | Define se reserva é confirmada automaticamente ou precisa de aprovação manual. |
| `max_por_horario` | INT NULL | Capacidade máxima por slot de horário para este serviço. NULL = sem limite. Exemplo: 2 barbeiros fazem corte com desenho. |
| `hora_inicio` | TIME NULL | Hora de início da disponibilidade diária do serviço. |
| `hora_fim` | TIME NULL | Hora de fim da disponibilidade diária do serviço. |
| `intervalo_minutos` | INT DEFAULT 0 | Intervalo de descanso após cada sessão antes do próximo cliente. 

### `agendamento`
| Campo | Tipo | Motivo |
|-------|------|--------|
| `empresa_id` | INT UNSIGNED NULL | Desnormalização necessária: evita JOIN com `servico` em todas as consultas de agenda da empresa. Preenchido automaticamente no insert. |
| `notas` | TEXT NULL | Notas do cliente ao fazer o agendamento (ex: "quero o barbeiro João"). |
| `criado_em` | DATETIME DEFAULT NOW() | Rastreabilidade de quando a reserva foi criada. |
| `aceito_em` | DATETIME NULL | Quando a empresa aceitou (aceitamento manual). |
| `cancelado_em` | DATETIME NULL | Timestamp do cancelamento para cálculo de antecedência. |
| `reagendado_de` | INT NULL | FK auto-referência: permite rastrear histórico de reagendamentos. |
| `motivo_cancelamento` | TEXT NULL | Motivo informado pelo cliente/empresa ao cancelar. |

---

## 2. Novas Tabelas

### `servico_tag`
Associação muitos-para-muitos entre serviços e tags.
**Motivo:** Um serviço pode ser oferecido apenas em dias com determinada tag (ex: "desconto de Páscoa" aplica no serviço X e Y). Sem esta tabela não é possível restringir serviços por tag de calendário.

### `servico_horario`
Define janelas de horário disponíveis por serviço e por dia da semana.
**Motivo:** A descrição permite que serviços tenham disponibilidade em dias/horários específicos. Ex: corte de cabelo das 09h às 18h de segunda a sábado, mas hidratação só às terças e quintas.

### `regra_empresa`
Regras de negócio livres da empresa: templates de notificação, políticas de cancelamento, políticas de reagendamento.
**Motivo:** A descrição diz explicitamente "painel de regras onde é possível criar regras livre", incluindo mensagens automáticas com variáveis `{nome_cliente}`, limites de reagendamento, taxas de cancelamento.

### `pontuacao_log`
Histórico de variações do score do cliente.
**Motivo:** Auditabilidade. A empresa precisa ver "esse cliente costuma cancelar" com histórico transparente. O score sem log seria caixa preta.

### `chat_config`
Mensagem de abertura e configuração do chat por empresa.
**Motivo:** A descrição fala em "mensagem de abertura de chat com respostas pras perguntas mais frequentes".

### `chat_faq`
Perguntas frequentes configuradas pela empresa no chat.
**Motivo:** Suporte à funcionalidade de FAQ automático do chat (filho de `chat_config`).

### `notificacao_log`
Log de todas as notificações automáticas enviadas.
**Motivo:** Rastreabilidade, diagnóstico de falhas de envio, evitar duplicatas no job de notificações.

### `capacidade_horario`
Override de capacidade por faixa de horário da empresa.
**Motivo:** A descrição menciona "no máximo 5 agendamentos em X horários independente do serviço". Esta tabela permite configurar isso por faixa horária.

### `_migrations`
Controle interno de migrações executadas.
**Motivo:** Garante idempotência — cada arquivo SQL roda exatamente uma vez.

---

## 3. Regras de Negócio Implementadas

### Sistema de Score
- Score inicial: **100.00**
- Compareceu: **+1.00** (máx 100)
- Atraso: **-0.10**
- Cancelamento tardio (dentro do limite da empresa): **-0.50**
- Não compareceu sem aviso: **-1.00**

### Motor de Calendário (calendarEngine)
Resolução de tags por data:
1. Coleta todas as regras `padrao`, `excecao` e `unico` da empresa
2. Filtra as que se aplicam à data solicitada
3. Ordena por `prioridade DESC` (maior prioridade ganha)
4. Retorna as tags efetivas do dia
5. Tags com `aceita_agendamento = 0` bloqueiam agendamentos

### Templates de Mensagem
Variáveis substituídas automaticamente:
- `{nome_cliente}` → nome do cliente
- `{nome_empresa}` → nome fantasia da empresa
- `{data}` → data do agendamento
- `{hora}` → hora do agendamento
- `{servico}` → nome do serviço
- `{valor}` → valor cobrado
- `{taxa}` → taxa de cancelamento
