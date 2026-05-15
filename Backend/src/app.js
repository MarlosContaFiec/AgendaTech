'use strict';
const express      = require('express');
const helmet       = require('helmet');
const cors         = require('cors');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');
const path         = require('path');
const env          = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');

const app = express();


app.use(helmet());
'use strict';
const express      = require('express');
const helmet       = require('helmet');
const cors         = require('cors');
const morgan       = require('morgan');
const rateLimit    = require('express-rate-limit');
const path         = require('path');
const env          = require('./config/env');
const errorHandler = require('./middlewares/errorHandler');

const app = express();


app.use(helmet());
app.use(cors({ origin: '*', methods: ['GET','POST','PUT','DELETE','PATCH'] }));
const allowedOrigins = (process.env.CORS_ORIGINS || '*').split(',');
app.use(cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin)) {
      return cb(null, true);
    }
    cb(new Error('CORS não permitido'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
}));



app.use(rateLimit({
  windowMs: env.rateLimit.windowMs,
  max:      env.rateLimit.max,
  message:  { success: false, message: 'Muitas requisições. Tente novamente mais tarde.' },
}));


app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));


if (env.server.env !== 'test') {
  app.use(morgan('dev'));
}


app.use('/uploads', express.static(path.resolve(env.upload.path)));


app.get('/health', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.get('/health/db', async (_req, res) => {
  try {
    const db = require('./config/database');
    await db.queryOne('SELECT 1');
    res.json({ db: 'ok' });
  } catch (err) {
    res.status(503).json({ db: 'error' });
  }
});

app.use('/api/auth',          require('./modules/auth/auth.routes'));
app.use('/api/empresa',       require('./modules/empresa/empresa.routes'));
app.use('/api/servicos',      require('./modules/servico/servico.routes'));
app.use('/api/fila', require('./modules/fila/fila.routes'));
app.use('/api/tags',          require('./modules/tags/tags.routes'));
app.use('/api/regras',        require('./modules/regras/regras.routes'));
app.use('/api/documentos', require('./modules/documento/documento.routes'));
app.use('/api/solicitacoes', require('./modules/solicitacao/solicitacao.routes'));
app.use('/api/cliente/dependentes', require('./modules/dependente/dependente.routes'));
app.use('/api/regras-negocio',require('./modules/regras_negocio/regras_negocio.routes'));
app.use('/api/agendamentos',  require('./modules/agendamento/agendamento.routes'));
app.use('/api/avaliacoes',    require('./modules/avaliacao/avaliacao.routes'));
app.use('/api/mensagens',     require('./modules/mensagem/mensagem.routes'));
app.use('/api/cliente',       require('./modules/cliente/cliente.routes'));
app.use('/api/upload', require('./modules/upload/upload.routes'));
app.use('/api',               require('./modules/publico/publico.routes'));


app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Rota não encontrada' });
});


app.use(errorHandler);

module.exports = app;
