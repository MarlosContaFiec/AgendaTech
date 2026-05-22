```markdown
# 📖 AgendaTech — Documentação da API

> **Para quem é este documento?**
> Para desenvolvedores front-end (humanos ou IA) que vão consumir a API.
> Aqui você encontra: rotas, schemas, exemplos de request/response, fluxos completos e o modelo do banco de dados.

---

## Conceitos básicos

### Base URL

```
http://localhost:3000
```

Em produção, troque pelo domínio real.

---

### Formato padrão de resposta

Sucesso:

```json
{
  "success": true,
  "message": "OK",
  "data": { ... }
}
```

Erro:

```json
{
  "success": false,
  "message": "Mensagem descritiva",
  "errors": ["detalhe 1", "detalhe 2"]
}
```

**Regra:** sempre verifique `response.success` antes de usar `response.data`.

---

### Autenticação

Rotas protegidas exigem header `Authorization`:

```
Authorization: Bearer <access_token>
```

O token dura **15 minutos**. Quando uma rota retornar `401`, renove com `POST /api/auth/refresh`.

O payload do token contém:

```json
{
  "sub": 5,
  "tipo": "cliente",
  "documento": "11144477735",
  "iat": 1717000000,
  "exp": 1717000900
}
```

---

### Paginação

Rotas com paginação aceitam `?pagina=1&limite=20`. Defaults: `pagina=1`, `limite=20`.

---

### Função base para consumir a API

```js
const API = import.meta.env.VITE_API_URL || 'http://localhost:3000';

async function api(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  });

  return res.json();
}
```

Exemplos:

```js
const empresas = await api('GET', '/api/empresas');
const resultado = await api('POST', '/api/agendamentos', { servico_id: 1 }, meuToken);
```

Para upload de arquivos, use `FormData` direto (não use a função `api`):

```js
const formData = new FormData();
formData.append('arquivo', file);
const res = await fetch(`${API}/api/upload/single`, {
  method: 'POST',
  headers: { Authorization: `Bearer ${token}` },
  body: formData
});
```

---

## 🔐 Autenticação

### Cadastrar cliente

**POST** `/api/auth/register/cliente`

Request:

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "minhasenha123",
  "cpf": "11144477735",
  "telefone": "(19) 98888-0001",
  "data_nascimento": "1995-03-15"
}
```

| Campo | Obrigatório | Obs |
|-------|-------------|-----|
| nome | Sim | Nome completo (nome + sobrenome) |
| email | Sim | Formato válido, único no sistema |
| senha | Sim | Mínimo 6 caracteres |
| cpf | Não | 11 dígitos (com ou sem pontuação). Valida dígitos verificadores |
| telefone | Não | Máximo 15 caracteres |
| data_nascimento | Não | Formato `YYYY-MM-DD` |

Response (201):

```json
{
  "success": true,
  "message": "Cliente cadastrado com sucesso",
  "data": {
    "user": { "id": 5, "tipo": "cliente", "email": "joao@email.com" },
    "tokens": {
      "access": "eyJ...",
      "refresh": "eyJ..."
    },
    "emailVerificado": false
  }
}
```

> Após o cadastro, o sistema envia um email de verificação. O usuário **não consegue fazer login** até clicar no link de confirmação.

---

### Cadastrar empresa

**POST** `/api/auth/register/empresa`

Request:

```json
{
  "email": "barbearia@email.com",
  "senha": "minhasenha123",
  "cnpj": "11222333000181",
  "razao_social": "Barbearia LTDA",
  "nome_fantasia": "Barbearia do João",
  "telefone": "(19) 99999-0001",
  "cep": "13330-000"
}
```

| Campo | Obrigatório | Obs |
|-------|-------------|-----|
| email | Sim | Único no sistema |
| senha | Sim | Mínimo 6 caracteres |
| cnpj | Sim | 14 dígitos (com ou sem pontuação) |
| razao_social | Sim | |
| nome_fantasia | Sim | |
| telefone | Não | |
| cep | Não | |

Response (201): mesmo formato do cadastro de cliente, com `tipo: "empresa"`.

---

### Verificar email

**GET** `/api/auth/verificar/:token`

O usuário recebe um link no email. Ao clicar, o sistema confirma automaticamente. Não precisa de body nem token de autenticação.

Response (200):

```json
{
  "success": true,
  "message": "Email verificado com sucesso",
  "data": { "message": "Email verificado com sucesso" }
}
```

Erros possíveis:

- `400` — Token inválido ou expirado
- `400` — Email já verificado

---

### Reenviar email de verificação

**POST** `/api/auth/reenviar-verificacao`

Request:

```json
{ "email": "joao@email.com" }
```

Response (200):

```json
{ "success": true, "message": "Email de verificação reenviado" }
```

---

### Login (CPF ou CNPJ)

**POST** `/api/auth/login`

O campo `documento` aceita CPF (11 dígitos) ou CNPJ (14 dígitos) automaticamente.
- Se tiver **11 dígitos** → busca na tabela `cliente` pelo CPF
- Se tiver **14 dígitos** → busca na tabela `empresa` pelo CNPJ

Request com CPF (cliente):

```json
{ "documento": "11144477735", "senha": "minhasenha123" }
```

Request com CNPJ (empresa):

```json
{ "documento": "11222333000181", "senha": "minhasenha123" }
```

| Campo | Obrigatório | Obs |
|-------|-------------|-----|
| documento | Sim | CPF (11 dígitos) ou CNPJ (14 dígitos). Aceita com ou sem pontuação, o backend limpa automaticamente |
| senha | Sim | Mínimo 6 caracteres |

Response (200):

```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "data": {
    "user": { "id": 5, "tipo": "cliente", "documento": "11144477735" },
    "tokens": {
      "access": "eyJ...",
      "refresh": "eyJ..."
    }
  }
}
```

Erros possíveis:

- `401` — CPF/CNPJ ou senha incorretos
- `403` — Email não verificado (mensagem: "Confirme seu email antes de fazer login")
- `400` — CPF ou CNPJ inválido (dígitos verificadores errados)

---

### Renovar token

**POST** `/api/auth/refresh`

Request:

```json
{ "refresh_token": "eyJ..." }
```

Response (200):

```json
{
  "data": {
    "tokens": {
      "access": "eyJ...",
      "refresh": "eyJ..."
    }
  }
}
```

Quando usar: qualquer rota que retornar `401`.

---

### Dados do usuário logado

**GET** `/api/auth/me` *(token obrigatório)*

Retorna dados completos do usuário (empresa ou cliente, dependendo do tipo do token).

---

## 🌍 Rotas públicas (sem autenticação)

### Destaques — empresas mais agendadas nas últimas 24h

**GET** `/api/empresas/destaques`

Response:

```json
{
  "data": [
    {
      "id": 1,
      "nome_fantasia": "Barbearia Estilo",
      "nicho": "beleza",
      "sub_nicho": "barbearia",
      "cidade": "Indaiatuba",
      "estado": "SP",
      "logo_url": "/uploads/logo.png",
      "cor_primaria": "#1a1a2e",
      "agendamentos_24h": 12,
      "media_avaliacao": 4.8
    }
  ]
}
```

---

### Buscar empresas

**GET** `/api/empresas`

| Parâmetro | Tipo | O que faz |
|-----------|------|-----------|
| busca | string | Busca por nome, nicho ou sub_nicho |
| nicho | string | Filtra por nicho exato |
| cidade | string | Busca por cidade (LIKE) |
| estado | string | UF com 2 letras (ex: `SP`) |
| pagina | number | Página atual (default: 1) |
| limite | number | Itens por página (default: 20, max: 50) |

Exemplo: `/api/empresas?busca=barb&cidade=Indaiatuba&limite=10`

---

### Nichos disponíveis

**GET** `/api/empresas/nichos`

Response:

```json
{
  "data": [
    { "nicho": "beleza", "sub_nicho": "barbearia", "total": 5 },
    { "nicho": "beleza", "sub_nicho": "salao", "total": 3 }
  ]
}
```

---

### Cidades disponíveis

**GET** `/api/empresas/cidades`

Response:

```json
{
  "data": [
    { "cidade": "Indaiatuba", "estado": "SP", "total": 12 },
    { "cidade": "Campinas", "estado": "SP", "total": 5 }
  ]
}
```

Use para montar dropdown de filtro de cidades dinamicamente.

---

### Perfil público de uma empresa

**GET** `/api/empresas/:id`

Response inclui: dados da empresa + serviços ativos + últimas 10 avaliações com estrelas, feedback e resposta da empresa.

---

### Calendário público do mês

**GET** `/api/empresas/:id/calendario?ano=2025&mes=6`

Response:

```json
{
  "2025-06-01": { "aberto": true, "tags": [] },
  "2025-06-08": {
    "aberto": false,
    "tags": [{ "nome": "domingo", "label": "Domingo", "cor": "#ff6b6b" }],
    "motivo_fechamento": "Domingo"
  }
}
```

---

### Slots de disponibilidade

**GET** `/api/empresas/:id/disponibilidade?servico_id=1&data=2025-06-10`

| Parâmetro | Obrigatório | Obs |
|-----------|-------------|-----|
| servico_id | Sim | ID do serviço |
| data | Sim | Formato `YYYY-MM-DD` |

Response:

```json
{
  "data": {
    "disponivel": true,
    "tags": [],
    "slots": [
      { "hora_inicio": "09:00", "hora_fim": "09:30", "disponivel": true, "vagas_restantes_servico": 2 },
      { "hora_inicio": "09:30", "hora_fim": "10:00", "disponivel": false, "vagas_restantes_servico": 0 }
    ]
  }
}
```

---

### FAQ público de uma empresa

**GET** `/api/mensagens/publico/:empresa_id/faq`

Retorna configuração do chat + lista de perguntas frequentes ativas. Não precisa de token.

---

## 👤 Área do Cliente *(todas precisam de token de cliente)*

### Perfil

**GET** `/api/cliente/perfil`

**PUT** `/api/cliente/perfil` — enviar só campos que mudaram:

```json
{
  "nome": "João Silva Atualizado",
  "telefone": "(11) 91234-5678",
  "data_nascimento": "1995-03-15"
}
```

---

### Calendário pessoal

**GET** `/api/cliente/calendario`

Retorna agendamentos ativos dos próximos dias + 30 dias passados. Cada item inclui: `id`, `data_agendamento`, `hora_inicio`, `hora_fim`, `status_agendamento`, `servico_nome`, `duracao_minutos`, `empresa_nome`, `endereco`, `numero`, `bairro`, `cidade`.

---

### Histórico de score

**GET** `/api/cliente/score`

Response:

```json
{
  "data": [
    {
      "variacao": 1.00,
      "score_resultante": 100.00,
      "motivo": "Compareceu ao agendamento",
      "data_agendamento": "2025-06-05",
      "hora_inicio": "10:00:00",
      "servico_nome": "Corte Simples"
    }
  ]
}
```

Score vai de 0 a 100:

| Ação | Variação |
|------|----------|
| Compareceu ao agendamento | +1.0 |
| Cancelamento tardio (menos de Xh antes) | -0.5 |
| Não compareceu sem aviso | -1.0 |

---

### Dependentes

| Ação | Método | Rota |
|------|--------|------|
| Listar | GET | `/api/cliente/dependentes` |
| Criar | POST | `/api/cliente/dependentes` |
| Atualizar | PUT | `/api/cliente/dependentes/:id` |
| Remover | DELETE | `/api/cliente/dependentes/:id` |

Request (criar):

```json
{ "nome": "Lucas Silva", "idade": 8 }
```

---

### Documentos

**POST** `/api/documentos`

```json
{ "tipo": "rg", "arquivo_url": "/uploads/5-1717000000-rg.pdf" }
```

Use a URL retornada pelo upload acima.

**GET** `/api/documentos` — lista meus documentos

**DELETE** `/api/documentos/:id` — remove

Cada documento tem `status`: `pendente`, `aprovado` ou `rejeitado` e `observacao` (quando rejeitado).

Tipos aceitos: `rg`, `certidao_nascimento`, `laudo_medico`, `comprovante_residencia`, `outro`.

---

### Notificações

**GET** `/api/notificacoes` *(token obrigatório — empresa ou cliente)*

Retorna as últimas 50 notificações do usuário:

```json
{
  "data": [
    {
      "id": 1,
      "tipo": "lembrete",
      "mensagem": "Seu agendamento é amanhã às 10h",
      "enviado_em": "2025-06-14T18:00:00.000Z",
      "lida": 0
    }
  ]
}
```

`lida`: `0` = não lida (menos de 1h), `1` = lida.

---

### Upload de arquivo

**POST** `/api/upload/single` *(token obrigatório, qualquer tipo)*

Envio via `multipart/form-data`, campo `arquivo`.

Aceita: `image/jpeg`, `image/png`, `image/webp`, `image/gif`, `application/pdf`. Limite: 10MB.

Response:

```json
{
  "data": {
    "filename": "5-1717000000-123456.png",
    "originalname": "foto.png",
    "mimetype": "image/png",
    "size": 204800,
    "url": "/uploads/5-1717000000-123456.png"
  }
}
```

**POST** `/api/upload/multiple` — até 5 arquivos, campo `arquivos`.

---

### Solicitação de horário estendido

**POST** `/api/solicitacoes`

```json
{
  "agendamento_id": 12,
  "minutos_extra": 30,
  "motivo": "Tenho cabelo longo, precisa de mais tempo"
}
```

`minutos_extra`: mínimo 5, máximo 120.

---

### Fila de espera

**POST** `/api/fila`

```json
{
  "servico_id": 1,
  "empresa_id": 1,
  "data_agendamento": "2025-06-15",
  "hora_inicio": "10:00"
}
```

**DELETE** `/api/fila/:id` — sair da fila

**GET** `/api/fila` — minhas posições na fila

**PUT** `/api/fila/:id/converter` — confirmar vaga após notificação

Quando um slot fica vago (cancelamento/recusa), o sistema notifica automaticamente o próximo da fila por score ou ordem de chegada (configurável pela empresa). Notificação expira em 4 horas.

---

## 🏢 Área da Empresa *(todas precisam de token de empresa)*

### Perfil

**GET** `/api/empresa/perfil`

**PUT** `/api/empresa/perfil` — campos opcionais:

```json
{
  "nome_fantasia": "Barbearia Estilo",
  "descricao": "A melhor barbearia de Indaiatuba",
  "cidade": "Indaiatuba",
  "estado": "SP",
  "nicho": "beleza",
  "sub_nicho": "barbearia",
  "cor_primaria": "#1a1a2e",
  "cor_secundaria": "#e94560",
  "logo_url": "/uploads/logo.png",
  "max_agendamentos_global": 5
}
```

---

### Dashboard

**GET** `/api/empresa/dashboard`

Response:

```json
{
  "total_clientes": 42,
  "total_agendamentos": 150,
  "concluidos": 120,
  "cancelados": 10,
  "pendentes": 5,
  "media_avaliacao": 4.7,
  "receita_total": 4500.00,
  "por_servico": [
    { "nome": "Corte Simples", "total": 80, "concluidos": 75, "cancelados": 5 }
  ],
  "ultimos": [
    {
      "id": 1,
      "data_agendamento": "2025-06-10",
      "hora_inicio": "10:00:00",
      "status_agendamento": "confirmado",
      "cliente_nome": "João",
      "servico_nome": "Corte"
    }
  ]
}
```

---

### Serviços

| Ação | Método | Rota |
|------|--------|------|
| Listar | GET | `/api/servicos` |
| Criar | POST | `/api/servicos` |
| Editar | PUT | `/api/servicos/:id` |
| Desativar | DELETE | `/api/servicos/:id` |

Criar:

```json
{
  "nome": "Corte Simples",
  "descricao": "Corte com tesoura e máquina",
  "duracao_minutos": 30,
  "preco_base": 45.00,
  "aceitamento_automatico": true,
  "max_por_horario": 2,
  "hora_inicio": "09:00",
  "hora_fim": "18:00",
  "intervalo_minutos": 0,
  "horarios": [
    { "dia_semana": 1, "hora_inicio": "09:00", "hora_fim": "18:00" },
    { "dia_semana": null, "hora_inicio": "09:00", "hora_fim": "18:00" }
  ],
  "tag_ids": [1, 3]
}
```

- `dia_semana`: 0=Domingo, 1=Segunda ... 6=Sábado. `null` = todos os dias
- `aceitamento_automatico`: `true` = cliente é confirmado direto. `false` = empresa precisa aceitar manualmente
- `max_por_horario`: `null` = ilimitado

---

### Tags

| Ação | Método | Rota |
|------|--------|------|
| Listar | GET | `/api/tags` |
| Criar | POST | `/api/tags` |
| Editar | PUT | `/api/tags/:id` |
| Remover | DELETE | `/api/tags/:id` |

```json
{
  "nome": "fechado",
  "label": "Fechado",
  "cor": "#ff0000",
  "aceita_agendamento": false,
  "info": "Estabelecimento fechado neste dia"
}
```

---

### Regras de calendário

| Ação | Método | Rota |
|------|--------|------|
| Listar | GET | `/api/regras` |
| Criar | POST | `/api/regras` |
| Editar | PUT | `/api/regras/:id` |
| Remover | DELETE | `/api/regras/:id` |
| Calendário do mês | GET | `/api/regras/calendario?ano=2025&mes=6` |
| Dia específico | GET | `/api/regras/dia?data=2025-06-10` |

```json
{
  "tag_id": 2,
  "tipo": "padrao",
  "dia_semana": 0,
  "prioridade": 5
}
```

Tipos:

- `padrao` — repete sempre (ex: todo domingo fecha)
- `excecao` — sobrepõe o padrão (ex: 1ª segunda de setembro abre para limpeza)
- `unico` — acontece uma vez (ex: feriado específico). Pode marcar `unico_repete_anual: true` para repetir todo ano

Sistema de prioridade: maior número = maior prioridade. Se um dia bate múltiplas regras, a de maior prioridade vence.

---

### Regras de negócio

| Ação | Método | Rota |
|------|--------|------|
| Listar | GET | `/api/regras-negocio` |
| Criar | POST | `/api/regras-negocio` |
| Editar | PUT | `/api/regras-negocio/:id` |
| Remover | DELETE | `/api/regras-negocio/:id` |
| Variáveis disponíveis | GET | `/api/regras-negocio/template/vars` |
| Preview de template | GET | `/api/regras-negocio/:id/preview` |

Exemplo — notificação automática 12h antes:

```json
{
  "tipo": "notificacao",
  "nome": "Lembrete 12h antes",
  "antecedencia_horas": 12,
  "mensagem_template": "Olá {nome_cliente}! Seu {servico} é amanhã às {hora} na {nome_empresa}.",
  "tipo_notificacao": "lembrete"
}
```

Exemplo — política de cancelamento:

```json
{
  "tipo": "cancelamento",
  "nome": "Taxa cancelamento tardio",
  "limite_horas": 24,
  "taxa_percentual": 30,
  "mensagem_template": "Cancelamento com menos de 24h. Taxa de {taxa} aplicada."
}
```

Variáveis de template: `{nome_cliente}`, `{nome_empresa}`, `{data}`, `{hora}`, `{servico}`, `{valor}`, `{taxa}`, `{duracao}`, `{endereco}`, `{motivo}`

---

### Capacidade de horário

| Ação | Método | Rota |
|------|--------|------|
| Listar | GET | `/api/empresa/capacidades` |
| Criar | POST | `/api/empresa/capacidades` |
| Remover | DELETE | `/api/empresa/capacidades/:id` |

```json
{
  "hora_inicio": "09:00",
  "hora_fim": "12:00",
  "max_agendamentos": 5
}
```

---

### Solicitações pendentes

**GET** `/api/solicitacoes/pendentes` — lista pedidos de horário estendido

**PUT** `/api/solicitacoes/:id/responder`

```json
{ "status": "aceito", "resposta_empresa": "Sem problemas!" }
```

`status`: `aceito` ou `negado`. Se aceito, `hora_fim` do agendamento é estendida automaticamente.

---

### Fila da empresa

**GET** `/api/fila/empresa` — ver fila dos meus serviços

---

## 📅 Agendamentos

### Criar (cliente)

**POST** `/api/agendamentos`

```json
{
  "servico_id": 1,
  "empresa_id": 1,
  "data_agendamento": "2025-06-10",
  "hora_inicio": "09:00",
  "notas": "Quero o corte com degradê"
}
```

---

### Listar (cliente)

**GET** `/api/agendamentos/cliente?status=confirmado`

Status possíveis: `confirmado`, `pendente`, `cancelado`, `concluido`

---

### Listar (empresa)

**GET** `/api/agendamentos/empresa`

Parâmetros opcionais: `status`, `data_inicio`, `data_fim`, `pagina`, `limite`

---

### Detalhe

**GET** `/api/agendamentos/:id`

---

### Empresa aceita

**PUT** `/api/agendamentos/:id/aceitar`

---

### Empresa recusa

**PUT** `/api/agendamentos/:id/recusar`

```json
{ "motivo": "Sem disponibilidade" }
```

---

### Empresa conclui

**PUT** `/api/agendamentos/:id/concluir`

---

### Cliente cancela

**PUT** `/api/agendamentos/:id/cancelar`

```json
{ "motivo": "Viagem inesperada" }
```

Se a empresa tiver regra de cancelamento tardio:

```json
{
  "data": {
    "agendamento": { "status_agendamento": "cancelado" },
    "taxaInfo": {
      "taxa": 15.00,
      "mensagem": "Cancelamento com menos de 24h. Taxa de R$ 15,00 aplicada."
    }
  }
}
```

---

### Cliente reagenda

**PUT** `/api/agendamentos/:id/reagendar`

```json
{
  "data_agendamento": "2025-06-15",
  "hora_inicio": "10:00"
}
```

---

## ⭐ Avaliações

### Criar (cliente)

**POST** `/api/avaliacoes/agendamento/:agendamento_id`

```json
{ "estrelas": 5, "feedback": "Excelente!" }
```

Só funciona se o agendamento estiver `concluido`.

---

### Listar (empresa)

**GET** `/api/avaliacoes?estrelas_min=4&estrelas_max=5`

---

### Estatísticas (empresa)

**GET** `/api/avaliacoes/stats`

```json
{
  "total": 25,
  "media": 4.6,
  "cinco": 12,
  "quatro": 8,
  "tres": 3,
  "dois": 1,
  "um": 1
}
```

---

### Responder (empresa)

**PUT** `/api/avaliacoes/:id`

```json
{ "resposta": "Obrigado pelo feedback!" }
```

---

## 💬 Mensagens / Chat

### Empresa envia para cliente

**POST** `/api/mensagens/conversas/:cliente_id`

```json
{ "mensagem": "Seu horário é amanhã às 10h!", "tipo": "lembrete" }
```

---

### Cliente envia para empresa

**POST** `/api/mensagens/empresa/:empresa_id`

```json
{ "mensagem": "Tenho uma dúvida sobre o serviço." }
```

---

### Listar conversas (empresa)

**GET** `/api/mensagens/conversas`

---

### Histórico de conversa

**GET** `/api/mensagens/conversas/:cliente_id`

Parâmetros opcionais: `pagina`, `limite`

---

### Configurar chat

**GET** `/api/mensagens/chat-config`

**PUT** `/api/mensagens/chat-config`

```json
{ "mensagem_abertura": "Olá! Como posso ajudar?", "ativo": true }
```

---

### FAQ do chat

| Ação | Método | Rota |
|------|--------|------|
| Criar | POST | `/api/mensagens/chat-config/faq` |
| Editar | PUT | `/api/mensagens/chat-config/faq/:id` |
| Remover | DELETE | `/api/mensagens/chat-config/faq/:id` |

```json
{ "pergunta": "Horário?", "resposta": "Seg a Sab, 9h às 18h.", "ordem": 1 }
```

---

## ⚠️ Códigos de erro

| Código | Significado | O que fazer |
|--------|-------------|-------------|
| 400 | Dados inválidos | Leia `errors` ou `message` para saber qual campo |
| 401 | Sem token ou token expirado | Renove com `/api/auth/refresh` ou redirecione para login |
| 403 | Tipo errado ou email não verificado | Cliente em rota de empresa (ou vice-versa), ou email não confirmado |
| 404 | Recurso não existe | ID inválido ou recurso deletado |
| 409 | Conflito | Horário ocupado, email duplicado, avaliação já feita, já na fila |
| 500 | Erro interno | Tente novamente em alguns segundos |

---

## 🔁 Fluxos completos

### Fluxo de cadastro

```
1. POST /api/auth/register/cliente  → cria conta
2. Usuário abre email e clica no link
3. GET  /api/auth/verificar/:token  → confirma email
4. POST /api/auth/login             → recebe tokens (envia CPF ou CNPJ como "documento")
5. GET  /api/auth/me                → carrega dados
```

### Fluxo de login

```
Frontend:
1. Usuário digita CPF ou CNPJ + senha
2. Remove pontuação: documento.replace(/\D/g, '')
3. POST /api/auth/login → { documento: "11144477735", senha: "123456" }

Backend:
1. Joi valida: 11 dígitos → CPF (valida dígitos verificadores)
                 14 dígitos → CNPJ (valida dígitos verificadores)
2. Service detecta tamanho, faz JOIN na tabela correta (cliente ou empresa)
3. Verifica senha, email_verificado, ativo
4. Retorna { user: { id, tipo, documento }, tokens: { access, refresh } }

Frontend:
5. Salva access_token + refresh_token
6. Redireciona para /dashboard
```

### Fluxo de agendamento (cliente)

```
1. GET  /api/empresas/destaques                              → tela inicial
2. GET  /api/empresas?busca=...                              → busca
3. GET  /api/empresas/:id                                    → perfil + serviços
4. GET  /api/empresas/:id/calendario?ano=&mes=               → dias disponíveis
5. GET  /api/empresas/:id/disponibilidade?servico_id=&data=  → slots do dia
6. POST /api/agendamentos                                    → criar
7. GET  /api/agendamentos/cliente                            → confirmar na lista
8. PUT  /api/agendamentos/:id/cancelar                       → se precisar cancelar
9. PUT  /api/agendamentos/:id/reagendar                      → se precisar reagendar
10. PUT /api/avaliacoes/agendamento/:id                      → avaliar após conclusão
```

### Fluxo de fila (slot lotado)

```
1. GET  /api/.../disponibilidade     → slot está indisponível
2. POST /api/fila                    → entra na fila
3. (alguém cancela)                  → sistema notifica automaticamente
4. PUT  /api/fila/:id/converter      → confirma vaga
5. POST /api/agendamentos            → agenda normalmente
```

### Fluxo de horário estendido

```
1. POST /api/solicitacoes            → cliente pede +30min com motivo
2. GET  /api/solicitacoes/pendentes  → empresa vê pedidos
3. PUT  /api/solicitacoes/:id/responder  → aceita ou nega
4. (sistema envia mensagem automática ao cliente)
```

### Fluxo de upload + perfil

```
1. POST /api/upload/single           → envia arquivo, recebe url
2. PUT  /api/empresa/perfil          → salva logo_url com a url retornada
```

---

## 🗄️ Modelo do banco de dados

### Tabela: usuario

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT UNSIGNED PK | Auto-increment |
| tipo | VARCHAR(20) | `cliente` ou `empresa` |
| email | VARCHAR(150) | Único |
| senha_hash | VARCHAR(255) | bcrypt |
| ativo | BOOLEAN | Default: true |
| foto | VARCHAR(100) | |
| data_criacao | DATETIME | Auto |
| email_verificado | BOOLEAN | Default: false |
| token_verificacao | VARCHAR(255) | |
| token_expira_em | DATETIME | |

### Tabela: cliente

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT UNSIGNED PK | FK → usuario(id) |
| nome | VARCHAR(150) | |
| cpf | VARCHAR(20) | Único |
| verificado | BOOLEAN | |
| data_nascimento | DATE | |
| telefone | VARCHAR(15) | |
| score | DECIMAL(5,2) | 0 a 100, default 100 |

### Tabela: empresa

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT UNSIGNED PK | FK → usuario(id) |
| cnpj | VARCHAR(20) | Único |
| razao_social | VARCHAR(200) | |
| nome_fantasia | VARCHAR(200) | |
| telefone | VARCHAR(15) | |
| cep | VARCHAR(20) | |
| endereco | VARCHAR(200) | |
| numero | VARCHAR(20) | |
| complemento | VARCHAR(100) | |
| bairro | VARCHAR(100) | |
| cidade | VARCHAR(100) | |
| estado | CHAR(2) | |
| nicho | VARCHAR(100) | |
| sub_nicho | VARCHAR(100) | |
| site | VARCHAR(255) | |
| verificada | BOOLEAN | |
| max_agendamentos_global | INT | NULL = ilimitado |
| metodo_fila | ENUM | `ordem_chegada` ou `score` (default: `score`) |

### Tabela: empresaProfile

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT PK | |
| empresa_id | INT UNSIGNED | Único, FK → empresa(id) |
| descricao | TEXT | |
| logo_url | VARCHAR(255) | |
| cor_primaria | VARCHAR(18) | |
| cor_secundaria | VARCHAR(18) | |
| ativo | BOOLEAN | |

### Tabela: servico

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT PK | |
| empresa_id | INT UNSIGNED | FK → empresa(id) |
| nome | VARCHAR(150) | |
| descricao | TEXT | |
| duracao_minutos | INT | |
| preco_base | DECIMAL(10,2) | |
| ativo | BOOLEAN | |
| aceitamento_automatico | BOOLEAN | Default: true |
| max_por_horario | INT | NULL = ilimitado |
| hora_inicio | TIME | Horário default |
| hora_fim | TIME | Horário default |
| intervalo_minutos | INT | Default: 0 |

### Tabela: servico_horario

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT UNSIGNED PK | |
| servico_id | INT | FK → servico(id) |
| dia_semana | TINYINT | 0=Dom, 6=Sáb, NULL=todos |
| hora_inicio | TIME | |
| hora_fim | TIME | |
| ativo | BOOLEAN | |

### Tabela: servico_tag

| Coluna | Tipo | Obs |
|--------|------|-----|
| servico_id | INT | PK composto, FK → servico(id) |
| tag_id | INT UNSIGNED | PK composto, FK → tags(id) |

### Tabela: agendamento

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT PK | |
| cliente_id | INT UNSIGNED | FK → cliente(id) |
| servico_id | INT | FK → servico(id) |
| empresa_id | INT UNSIGNED | FK → empresa(id) |
| data_agendamento | DATE | |
| hora_inicio | TIME | |
| hora_fim | TIME | |
| status_agendamento | ENUM | `pendente`, `confirmado`, `cancelado`, `concluido` |
| notas | TEXT | |
| valor | DECIMAL(10,2) | |
| horario_estendido | BOOLEAN | |
| motivo_estendido | TEXT | |
| criado_em | DATETIME | |
| aceito_em | DATETIME | |
| cancelado_em | DATETIME | |
| reagendado_de | INT | ID do agendamento anterior |
| motivo_cancelamento | TEXT | |

### Tabela: avaliacao

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT PK | |
| agendamento_id | INT | FK → agendamento(id) |
| cliente_id | INT UNSIGNED | FK → cliente(id) |
| estrelas | INT | 1 a 5 |
| feedback | TEXT | |
| resposta_empresa | TEXT | |

### Tabela: tags

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT UNSIGNED PK | |
| empresa_id | INT UNSIGNED | FK → empresa(id) |
| nome | VARCHAR(80) | Único por empresa |
| label | VARCHAR(120) | |
| cor | VARCHAR(7) | Hex, default `#888888` |
| aceita_agendamento | TINYINT | 0=bloqueia dia, 1=aceita |
| info | TEXT | Descrição extra |

### Tabela: regras

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT UNSIGNED PK | |
| empresa_id | INT UNSIGNED | FK → empresa(id) |
| tag_id | INT UNSIGNED | FK → tags(id) |
| tipo | ENUM | `padrao`, `excecao`, `unico` |
| dia_semana | TINYINT | 0=Dom, 6=Sáb |
| qnd_ocorre | TINYINT | 1ª, 2ª, 3ª, 4ª, 5ª ocorrência no mês |
| mes | TINYINT | 1-12 |
| unico_dia | TINYINT | 1-31 |
| unico_mes | TINYINT | 1-12 |
| unico_ano | SMALLINT | |
| unico_repete_anual | TINYINT | |
| prioridade | TINYINT | 0-255, default 10. Maior = vence |
| ativo | TINYINT | |

### Tabela: regra_empresa

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT UNSIGNED PK | |
| empresa_id | INT UNSIGNED | FK → empresa(id) |
| tipo | ENUM | `notificacao`, `cancelamento`, `reagendamento`, `capacidade` |
| nome | VARCHAR(150) | |
| descricao | TEXT | |
| antecedencia_horas | INT | Para notificações |
| mensagem_template | TEXT | Com variáveis |
| tipo_notificacao | ENUM | `lembrete`, `confirmacao`, `cancelamento`, `reagendamento`, `outro` |
| limite_horas | INT | Para cancelamento/reagendamento |
| taxa_percentual | DECIMAL(5,2) | |
| taxa_fixa | DECIMAL(10,2) | |
| ativo | BOOLEAN | |

### Tabela: mensagem

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT PK | |
| empresa_id | INT UNSIGNED | FK → empresa(id) |
| cliente_id | INT UNSIGNED | FK → usuario(id) |
| tipo | ENUM | `cancelamento`, `confirmacao`, `lembrete`, `outro` |
| mensagem | TEXT | |
| automatica | BOOLEAN | |
| data_envio | DATETIME | |
| enviado_por | ENUM | `cliente` ou `empresa` |

### Tabela: pontuacao_log

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT UNSIGNED PK | |
| cliente_id | INT UNSIGNED | FK → cliente(id) |
| agendamento_id | INT | FK → agendamento(id) |
| variacao | DECIMAL(5,2) | |
| score_resultante | DECIMAL(5,2) | |
| motivo | VARCHAR(100) | |
| criado_em | DATETIME | |

### Tabela: dependente

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT UNSIGNED PK | |
| cliente_id | INT UNSIGNED | FK → cliente(id) |
| nome | VARCHAR(150) | |
| idade | TINYINT UNSIGNED | |

### Tabela: documento_cliente

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT UNSIGNED PK | |
| cliente_id | INT UNSIGNED | FK → cliente(id) |
| tipo | VARCHAR(50) | |
| arquivo_url | VARCHAR(255) | |
| status | ENUM | `pendente`, `aprovado`, `rejeitado` |
| observacao | TEXT | |
| criado_em | DATETIME | |
| revisado_em | DATETIME | |

### Tabela: solicitacao_horario

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT UNSIGNED PK | |
| agendamento_id | INT | FK → agendamento(id) |
| minutos_extra | INT UNSIGNED | 5-120 |
| motivo | TEXT | |
| status | ENUM | `pendente`, `aceito`, `negado` |
| resposta_empresa | TEXT | |
| criado_em | DATETIME | |
| respondido_em | DATETIME | |

### Tabela: fila_espera

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT UNSIGNED PK | |
| cliente_id | INT UNSIGNED | FK → cliente(id) |
| servico_id | INT | FK → servico(id) |
| empresa_id | INT UNSIGNED | FK → empresa(id) |
| data_agendamento | DATE | |
| hora_inicio | TIME | |
| status | ENUM | `aguardando`, `notificado`, `convertido`, `cancelado` |
| criado_em | DATETIME | |

### Tabela: chat_config

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT UNSIGNED PK | |
| empresa_id | INT UNSIGNED | Único |
| mensagem_abertura | TEXT | |
| ativo | BOOLEAN | |

### Tabela: chat_faq

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT UNSIGNED PK | |
| empresa_id | INT UNSIGNED | FK → empresa(id) |
| pergunta | VARCHAR(255) | |
| resposta | TEXT | |
| ordem | INT | |
| ativo | BOOLEAN | |

### Tabela: capacidade_horario

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT UNSIGNED PK | |
| empresa_id | INT UNSIGNED | FK → empresa(id) |
| hora_inicio | TIME | |
| hora_fim | TIME | |
| max_agendamentos | INT | |

### Tabela: notificacao_log

| Coluna | Tipo | Obs |
|--------|------|-----|
| id | INT UNSIGNED PK | |
| empresa_id | INT UNSIGNED | FK → empresa(id) |
| cliente_id | INT UNSIGNED | FK → cliente(id) |
| agendamento_id | INT | FK → agendamento(id) |
| regra_id | INT UNSIGNED | FK → regra_empresa(id) |
| tipo | VARCHAR(50) | |
| mensagem | TEXT | |
| enviado_em | DATETIME | |
| sucesso | BOOLEAN | |
| erro | TEXT | |

---

## ⚙️ Jobs automáticos (rodam no servidor)

| Job | Frequência | O que faz |
|-----|-----------|-----------|
| Notificações | A cada hora | Envia lembretes conforme regras `antecedencia_horas` |
| Pontuação | A cada 15min | Marca como `cancelado` agendamentos `confirmados` que já passaram, aplica -1 no score |
| Fila expiração | A cada 2h | Fila com `notificado` por +4h → cancela e notifica próximo |
| Solicitação expiração | Diário às 8h | Solicitações de extensão pendentes por +48h → nega e avisa cliente |

---

> **Dúvidas?** Cada rota retorna `message` descrevendo o erro. Leia essa mensagem no console durante o desenvolvimento — ela vai te dizer exatamente o que está errado.
```

---

README atualizado com login por documento (CPF/CNPJ), payload do token atualizado, fluxo de login detalhado, e todas as 18 tabelas do banco.