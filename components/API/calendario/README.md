# Calendário de Regras — API PHP

Backend PHP puro + MySQL para gerenciamento de calendário com tags e regras.

---

## Estrutura do projeto

```
calendario/
├── config/
│   └── database.php          # credenciais do banco
├── sql/
│   └── schema.sql            # criação das tabelas + seed
├── src/
│   ├── Config/
│   │   └── Database.php      # singleton PDO
│   ├── Models/
│   │   ├── TagModel.php      # CRUD de tags
│   │   └── RegraModel.php    # CRUD de regras
│   ├── Services/
│   │   └── CalendarioService.php  # lógica de resolução
│   └── Api/
│       └── Response.php      # helper JSON
├── index.php                 # router / entry point
├── .htaccess                 # rewrite Apache
└── composer.json
```

---

## Instalação

```bash
# 1. Instalar dependências (apenas autoload PSR-4)
composer install

# 2. Importar o banco
mysql -u root -p < sql/schema.sql

# 3. Ajustar credenciais
# edite config/database.php ou use variáveis de ambiente:
export DB_HOST=localhost
export DB_NAME=calendario
export DB_USER=root
export DB_PASSWORD=senha
```

---

## Tipos de regra

| tipo     | descrição                                              | prioridade padrão |
|----------|--------------------------------------------------------|-------------------|
| padrao   | repete toda semana/mês indefinidamente                 | 10                |
| excecao  | sobrescreve um padrão em contexto específico           | 20                |
| unico    | data pontual, com opção de repetir anualmente          | 30                |

**Resolução:** exceção remove o padrão com mesma condição. Únicos sempre aparecem.
`aceita_agendamento` = false se **qualquer** tag ativa no dia tiver false.

---

## Endpoints

### TAGS

#### Listar tags da empresa
```
GET /api/tags?empresa_id=1
```

#### Criar tag
```
POST /api/tags
Content-Type: application/json

{
  "empresa_id": 1,
  "nome": "fechado",
  "label": "Fechado",
  "cor": "#E24B4A",
  "aceita_agendamento": false,
  "info": "Estabelecimento fechado neste dia."
}
```

#### Atualizar tag
```
PUT /api/tags/1?empresa_id=1
{ "nome": "fechado", "label": "Fechado", "cor": "#E24B4A", "aceita_agendamento": false }
```

#### Deletar tag
```
DELETE /api/tags/1?empresa_id=1
```

---

### REGRAS

#### Listar regras ativas
```
GET /api/regras?empresa_id=1
```

#### Criar regra — padrão (todo domingo)
```
POST /api/regras
{
  "empresa_id": 1,
  "tag_id": 1,
  "tipo": "padrao",
  "dia_semana": 0,
  "nth_do_mes": 0
}
```
> `nth_do_mes: 0` = toda semana. `nth_do_mes: 1` = apenas a 1ª ocorrência.

#### Criar regra — padrão (toda 1ª segunda-feira do mês)
```json
{
  "empresa_id": 1,
  "tag_id": 4,
  "tipo": "padrao",
  "dia_semana": 1,
  "nth_do_mes": 1
}
```

#### Criar regra — exceção (1ª segunda de setembro = dia normal)
```json
{
  "empresa_id": 1,
  "tag_id": 5,
  "tipo": "excecao",
  "dia_semana": 1,
  "nth_do_mes": 1,
  "mes": 8
}
```
> `mes` é 0-based: 0=jan … 8=set … 11=dez

#### Criar regra — único (5 de julho, todo ano)
```json
{
  "empresa_id": 1,
  "tag_id": 2,
  "tipo": "unico",
  "unico_dia": 5,
  "unico_mes": 6,
  "unico_repete_anual": true
}
```

#### Criar regra — único (14/02/2026, só esse ano)
```json
{
  "empresa_id": 1,
  "tag_id": 6,
  "tipo": "unico",
  "unico_dia": 14,
  "unico_mes": 1,
  "unico_ano": 2026,
  "unico_repete_anual": false
}
```

#### Ativar / desativar regra
```
PATCH /api/regras/3/ativo?empresa_id=1
{ "ativo": false }
```

#### Deletar regra
```
DELETE /api/regras/3?empresa_id=1
```

---

### CALENDÁRIO (consulta do cliente)

#### Mês completo
```
GET /api/calendario/1/2026/4
```

Resposta:
```json
{
  "success": true,
  "data": [
    {
      "data": "2026-04-01",
      "dia": 1,
      "dia_semana": 3,
      "aceita_agendamento": true,
      "tags": []
    },
    {
      "data": "2026-04-05",
      "dia": 5,
      "dia_semana": 0,
      "aceita_agendamento": false,
      "tags": [
        {
          "regra_id": 1,
          "tipo": "padrao",
          "tag_nome": "fechado",
          "tag_label": "Fechado",
          "cor": "#E24B4A",
          "aceita_agendamento": false,
          "info": "Restaurante fechado aos domingos.",
          "prioridade": 10
        },
        {
          "regra_id": 3,
          "tipo": "excecao",
          "tag_nome": "pascoa",
          "tag_label": "Páscoa",
          "cor": "#1D9E75",
          "aceita_agendamento": true,
          "info": "Funcionamento especial de Páscoa.",
          "prioridade": 20
        }
      ]
    }
  ]
}
```

#### Data específica
```
GET /api/calendario/1/data/2026-04-05
```

---

## Campos de condição por tipo

| campo              | padrao | excecao | unico |
|--------------------|--------|---------|-------|
| dia_semana         | ✓      | ✓       | —     |
| nth_do_mes         | ✓      | ✓       | —     |
| mes                | —      | ✓       | —     |
| unico_dia          | —      | —       | ✓     |
| unico_mes          | —      | —       | ✓     |
| unico_ano          | —      | —       | ✓     |
| unico_repete_anual | —      | —       | ✓     |

---

