# 📖 Guia do Front-end — Como usar a API

> **Para quem é esse documento?**  
> Para quem vai construir o front com HTML, CSS e JavaScript puro. Aqui você vai entender como a API funciona, o que enviar, o que vai receber e ver exemplos reais de `fetch`.

---

## Conceitos básicos antes de começar

### Base URL
Toda rota começa com:
```
http://localhost:3000
```
Em produção você vai trocar pelo domínio real.

---

### Como a API responde (sempre)
Toda resposta tem esse formato:
```json
{
  "success": true,
  "message": "OK",
  "data": { ... }
}
```
Se der erro:
```json
{
  "success": false,
  "message": "Mensagem do erro aqui",
  "errors": ["detalhe 1", "detalhe 2"]
}
```
**Dica:** sempre leia `response.success` antes de usar `response.data`.

---

### Token de autenticação
Depois do login você recebe um `access` token. Guarde ele e mande em toda rota protegida:
```js
headers: { 'Authorization': 'Bearer SEU_TOKEN_AQUI' }
```

---

### Função base (copie isso no seu projeto)
```js
const API = 'http://localhost:3000';

async function api(method, path, body = null, token = null) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null
  });

  return res.json();
}
```
Com essa função você chama qualquer rota assim:
```js
// GET sem body
const resultado = await api('GET', '/api/empresas');

// POST com body e token
const resultado = await api('POST', '/api/agendamentos', { servico_id: 1 }, meuToken);
```

---

## 🔐 Autenticação

### Cadastrar cliente
**POST** `/api/auth/register/cliente`

O que enviar:
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "minhasenha123",
  "cpf": "111.444.777-35"
}
```
O que você recebe:
```json
{
  "data": {
    "user": { "id": 5, "tipo": "cliente", "email": "joao@email.com" },
    "tokens": {
      "access": "eyJ...",
      "refresh": "eyJ..."
    }
  }
}
```
Salve o `access` e o `refresh` no `localStorage`.

---

### Cadastrar empresa
**POST** `/api/auth/register/empresa`

```json
{
  "email": "barbearia@email.com",
  "senha": "minhasenha123",
  "cnpj": "11.222.333/0001-81",
  "razao_social": "Barbearia LTDA",
  "nome_fantasia": "Barbearia do João"
}
```
Recebe o mesmo formato acima com os tokens.

---

### Login
**POST** `/api/auth/login`

```json
{
  "email": "joao@email.com",
  "senha": "minhasenha123"
}
```
Recebe os tokens. Guarde no `localStorage`:
```js
const res = await api('POST', '/api/auth/login', { email, senha });
if (res.success) {
  localStorage.setItem('token', res.data.tokens.access);
  localStorage.setItem('refresh', res.data.tokens.refresh);
  localStorage.setItem('tipo', res.data.user.tipo); // 'cliente' ou 'empresa'
}
```

---

### Renovar o token (quando expirar)
O token dura **15 minutos**. Quando uma rota retornar `401`, renove assim:

**POST** `/api/auth/refresh`
```json
{
  "refresh_token": "eyJ..."
}
```
Recebe novos tokens. Troque no `localStorage` e repita a chamada original.

---

### Dados do usuário logado
**GET** `/api/auth/me` *(precisa de token)*

Retorna todos os dados do usuário atual (empresa ou cliente).

---

## 🌍 Rotas públicas (sem login)

### Página inicial — empresas em destaque (últimas 24h)
**GET** `/api/empresas/destaques`

Retorna até 10 empresas mais agendadas no dia. Use isso na tela inicial.

```js
const res = await api('GET', '/api/empresas/destaques');
res.data.forEach(empresa => {
  // empresa.nome_fantasia, empresa.nicho, empresa.cidade, empresa.logo_url
});
```

---

### Listar/buscar empresas
**GET** `/api/empresas`

Parâmetros opcionais na URL:
| Parâmetro | O que faz |
|-----------|-----------|
| `busca=barbearia` | Busca pelo nome ou nicho |
| `nicho=beleza` | Filtra por categoria |
| `cidade=Indaiatuba` | Filtra por cidade |
| `pagina=1` | Paginação |
| `limite=20` | Quantos por página |

Exemplo:
```js
const res = await api('GET', '/api/empresas?busca=barb&cidade=Indaiatuba');
```

Cada empresa no array retorna:
```json
{
  "id": 1,
  "nome_fantasia": "Barbearia Estilo",
  "nicho": "beleza",
  "sub_nicho": "barbearia",
  "cidade": "Indaiatuba",
  "logo_url": "/uploads/logo.png",
  "media_avaliacao": 4.8
}
```

---

### Nichos disponíveis (para o filtro)
**GET** `/api/empresas/nichos`

Retorna lista de nichos e sub-nichos cadastrados. Use para montar o dropdown de filtro.

---

### Perfil público de uma empresa
**GET** `/api/empresas/:id`

Substitua `:id` pelo número da empresa. Retorna:
- Dados da empresa
- Lista de serviços ativos
- Últimas 10 avaliações

---

### Slots disponíveis para agendar
**GET** `/api/empresas/:id/disponibilidade?servico_id=1&data=2025-06-10`

Retorna os horários disponíveis do dia:
```json
{
  "disponivel": true,
  "slots": [
    { "hora_inicio": "09:00", "hora_fim": "09:30", "disponivel": true },
    { "hora_inicio": "09:30", "hora_fim": "10:00", "disponivel": false }
  ]
}
```
Mostre os slots com `disponivel: false` em cinza/bloqueado.

---

### Calendário de um mês inteiro (empresa pública)
**GET** `/api/empresas/:id/calendario?ano=2025&mes=6`

Retorna um objeto onde cada chave é uma data:
```json
{
  "2025-06-01": { "aberto": true, "tags": [] },
  "2025-06-08": { "aberto": false, "motivo_fechamento": "Domingo" }
}
```
Use para pintar o calendário antes do cliente escolher a data.

---

## 👤 Área do Cliente *(todas precisam de token)*

### Ver perfil
**GET** `/api/cliente/perfil`

---

### Atualizar perfil
**PUT** `/api/cliente/perfil`

Pode enviar só os campos que mudaram:
```json
{
  "nome": "João Silva Atualizado",
  "telefone": "(11) 91234-5678",
  "alergias": "Amendoim"
}
```

---

### Calendário pessoal (agendamentos futuros)
**GET** `/api/cliente/calendario`

Retorna agendamentos ativos dos próximos dias + 30 dias passados. Cada item tem:
```json
{
  "id": 12,
  "data_agendamento": "2025-06-10",
  "hora_inicio": "09:00:00",
  "hora_fim": "09:30:00",
  "status_agendamento": "confirmado",
  "servico_nome": "Corte Simples",
  "empresa_nome": "Barbearia Estilo",
  "endereco": "Rua das Flores, 100"
}
```

---

### Histórico de score (pontuação de confiabilidade)
**GET** `/api/cliente/score`

Mostra cada variação: `+1` por comparecer, `-1` por não comparecer, etc.

---

### Enviar documento
**POST** `/api/cliente/documentos`

```json
{
  "tipo": "rg",
  "arquivo_url": "/uploads/meu_rg.pdf"
}
```
Tipos aceitos: `rg`, `certidao_nascimento`, `laudo_medico`, `comprovante_residencia`, `outro`.

---

### Listar documentos enviados
**GET** `/api/cliente/documentos`

Cada documento tem `status`: `pendente`, `aprovado` ou `rejeitado`.

---

### Salvar cartão (tokenizado)
**POST** `/api/cliente/cartoes`

```json
{
  "token_referencia": "tok_abc123",
  "ultimos_quatro": "4242",
  "bandeira": "Visa",
  "titular": "JOAO SILVA",
  "principal": true
}
```
> ⚠️ Nunca envie o número completo do cartão. Use um gateway (ex: Stripe, Pagar.me) que te dá o token.

---

### Remover cartão
**DELETE** `/api/cliente/cartoes/:id`

---

## 📅 Agendamentos — Cliente

### Criar agendamento
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

O `status` volta como:
- `confirmado` — aceitamento automático
- `pendente` — empresa precisa aceitar manualmente

---

### Meus agendamentos
**GET** `/api/agendamentos/cliente`

Parâmetros opcionais: `status=confirmado` | `pendente` | `cancelado` | `concluido`

---

### Cancelar agendamento
**PUT** `/api/agendamentos/:id/cancelar`

```json
{ "motivo": "Viagem inesperada" }
```

A resposta inclui `taxaInfo` quando há taxa de cancelamento configurada pela empresa:
```json
{
  "agendamento": { ... },
  "taxaInfo": {
    "taxa": 15.00,
    "mensagem": "Taxa de 30% aplicada por cancelamento tardio."
  }
}
```
> Mostre a taxa na tela antes do cliente confirmar o cancelamento.

---

### Reagendar
**PUT** `/api/agendamentos/:id/reagendar`

```json
{
  "data_agendamento": "2025-06-15",
  "hora_inicio": "10:00",
  "motivo": "Conflito de horário"
}
```
Se a empresa tiver regra de prazo mínimo e o cliente tentar reagendar tarde demais, recebe `409` com a mensagem explicando.

---

### Ver detalhe de um agendamento
**GET** `/api/agendamentos/:id`

---

### Avaliar agendamento concluído
**POST** `/api/avaliacoes/agendamento/:agendamento_id`

```json
{
  "estrelas": 5,
  "feedback": "Atendimento excelente!"
}
```
Só funciona se o agendamento estiver com status `concluido`.

---

## 🏢 Área da Empresa *(todas precisam de token de empresa)*

### Ver/atualizar perfil
**GET / PUT** `/api/empresa/perfil`

No PUT pode enviar qualquer combinação:
```json
{
  "nome_fantasia": "Novo Nome",
  "descricao": "Descrição da empresa",
  "cidade": "Indaiatuba",
  "estado": "SP",
  "nicho": "beleza",
  "cor_primaria": "#1a1a2e",
  "logo_url": "/uploads/logo.png"
}
```

---

### Dashboard
**GET** `/api/empresa/dashboard`

Retorna:
```json
{
  "total_clientes": 42,
  "total_agendamentos": 150,
  "concluidos": 120,
  "cancelados": 10,
  "pendentes": 5,
  "receita_total": 4500.00,
  "media_avaliacao": 4.7,
  "por_servico": [ ... ],
  "ultimos": [ ... ]
}
```

---

### Serviços — CRUD
| Ação | Método | Rota |
|------|--------|------|
| Listar | GET | `/api/servicos` |
| Criar | POST | `/api/servicos` |
| Editar | PUT | `/api/servicos/:id` |
| Desativar | DELETE | `/api/servicos/:id` |

Criar serviço:
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
  "horarios": [
    { "dia_semana": 1, "hora_inicio": "09:00", "hora_fim": "18:00" },
    { "dia_semana": 2, "hora_inicio": "09:00", "hora_fim": "18:00" }
  ]
}
```
`dia_semana`: 0=Domingo, 1=Segunda … 6=Sábado. Use `null` para todos os dias.

---

### Tags de calendário — CRUD
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

### Regras de calendário — CRUD
| Ação | Método | Rota |
|------|--------|------|
| Listar | GET | `/api/regras` |
| Criar | POST | `/api/regras` |
| Editar | PUT | `/api/regras/:id` |
| Remover | DELETE | `/api/regras/:id` |

```json
{
  "tag_id": 1,
  "tipo": "padrao",
  "dia_semana": 0,
  "prioridade": 5
}
```

**Tipos de regra:**
- `padrao` — repete sempre (ex: todo domingo)
- `excecao` — sobrepõe o padrão (ex: 1ª segunda de setembro)
- `unico` — acontece uma vez (ex: feriado específico)

**Ver calendário do mês completo:**
**GET** `/api/regras/calendario?ano=2025&mes=6`

**Ver um dia específico:**
**GET** `/api/regras/dia?data=2025-06-10`

---

### Regras de negócio
**GET / POST / PUT / DELETE** `/api/regras-negocio`

Criar uma notificação automática:
```json
{
  "tipo": "notificacao",
  "nome": "Lembrete 12h antes",
  "antecedencia_horas": 12,
  "mensagem_template": "Olá {nome_cliente}! Seu {servico} é amanhã às {hora} na {nome_empresa}.",
  "tipo_notificacao": "lembrete"
}
```

Criar política de cancelamento:
```json
{
  "tipo": "cancelamento",
  "nome": "Taxa cancelamento tardio",
  "limite_horas": 24,
  "taxa_percentual": 30,
  "mensagem_template": "Cancelamento com menos de 24h. Taxa de {taxa} aplicada."
}
```

**Ver as variáveis disponíveis para templates:**
**GET** `/api/regras-negocio/template/vars`

**Testar como a mensagem vai ficar:**
**GET** `/api/regras-negocio/:id/preview`

---

### Agendamentos da empresa
**GET** `/api/agendamentos/empresa`

Parâmetros opcionais: `status`, `data_inicio`, `data_fim`, `pagina`, `limite`

**Aceitar um agendamento pendente:**
**PUT** `/api/agendamentos/:id/aceitar`

**Recusar:**
**PUT** `/api/agendamentos/:id/recusar`
```json
{ "motivo": "Sem disponibilidade" }
```

**Marcar como concluído:**
**PUT** `/api/agendamentos/:id/concluir`

---

### Avaliações recebidas
**GET** `/api/avaliacoes`

Filtros: `?estrelas_min=4&estrelas_max=5`

**Estatísticas:**
**GET** `/api/avaliacoes/stats`

**Responder avaliação:**
**PUT** `/api/avaliacoes/:id`
```json
{ "resposta": "Obrigado pelo feedback!" }
```

---

### Mensagens — Chat com clientes
**Listar todas as conversas:**
**GET** `/api/mensagens/conversas`

Retorna uma conversa por cliente, com a última mensagem e quantas não foram lidas.

**Ver histórico de uma conversa:**
**GET** `/api/mensagens/conversas/:cliente_id`

**Enviar mensagem para cliente:**
**POST** `/api/mensagens/conversas/:cliente_id`
```json
{ "mensagem": "Confirme seu horário de amanhã!", "tipo": "lembrete" }
```

**Configurar mensagem de abertura do chat:**
**PUT** `/api/mensagens/chat-config`
```json
{
  "mensagem_abertura": "Olá! Bem-vindo à Barbearia Estilo 💈 Como posso ajudar?",
  "ativo": true
}
```

**Adicionar pergunta frequente (FAQ):**
**POST** `/api/mensagens/chat-config/faq`
```json
{
  "pergunta": "Qual o horário de funcionamento?",
  "resposta": "Seg a Sab, 9h às 18h.",
  "ordem": 1
}
```

---

### Capacidade de horário
Limite global de agendamentos simultâneos (ex: só tem 5 barbeiros).

**POST** `/api/empresa/capacidades`
```json
{
  "hora_inicio": "09:00",
  "hora_fim": "12:00",
  "max_agendamentos": 5
}
```

---

### FAQ público (sem login — para mostrar no chat antes do login)
**GET** `/api/mensagens/publico/:empresa_id/faq`

---

## 💬 Cliente enviando mensagem para empresa
**POST** `/api/mensagens/empresa/:empresa_id` *(precisa de token de cliente)*
```json
{ "mensagem": "Tenho alguma dúvida sobre o serviço." }
```

---

## 🔁 Fluxo completo — do zero ao agendamento

```
1. GET  /api/empresas/destaques          → tela inicial
2. GET  /api/empresas?busca=...          → busca
3. GET  /api/empresas/:id                → perfil da empresa
4. GET  /api/empresas/:id/calendario     → mês disponível
5. GET  /api/empresas/:id/disponibilidade?servico_id=&data=  → slots do dia
6. POST /api/auth/login                  → login do cliente
7. POST /api/agendamentos                → criar agendamento
8. GET  /api/agendamentos/cliente        → confirmar na lista
```

---

## ⚠️ Erros mais comuns

| Código | O que significa | O que fazer |
|--------|----------------|-------------|
| `400` | Dados inválidos enviados | Leia `errors` na resposta para saber qual campo |
| `401` | Sem token ou token expirado | Redireciona para login ou renova o token |
| `403` | Tipo de usuário errado | Cliente tentou acessar rota de empresa (ou vice-versa) |
| `404` | Recurso não existe | Empresa, agendamento ou avaliação não encontrada |
| `409` | Conflito | Horário já ocupado, email duplicado, avaliação já feita |
| `500` | Erro interno | Problema no servidor — tente de novo |

---

## 🗝️ Exemplo completo — Login e carregar perfil

```html
<button onclick="fazerLogin()">Entrar</button>

<script>
  const API = 'http://localhost:3000';

  async function api(method, path, body = null, token = null) {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const res = await fetch(`${API}${path}`, {
      method, headers,
      body: body ? JSON.stringify(body) : null
    });
    return res.json();
  }

  async function fazerLogin() {
    const res = await api('POST', '/api/auth/login', {
      email: 'joao@email.com',
      senha: 'minhasenha123'
    });

    if (!res.success) {
      alert('Erro: ' + res.message);
      return;
    }

    localStorage.setItem('token', res.data.tokens.access);
    localStorage.setItem('refresh', res.data.tokens.refresh);
    localStorage.setItem('tipo', res.data.user.tipo);

    // Carrega dados do usuário
    const token = localStorage.getItem('token');
    const perfil = await api('GET', '/api/auth/me', null, token);
    console.log('Usuário logado:', perfil.data);
  }
</script>
```

---

> **Dúvidas?** Cada rota retorna `message` descrevendo o erro. Leia essa mensagem no console durante o desenvolvimento — ela vai te dizer exatamente o que está errado.
