'use strict';
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('node:crypto');
const db = require('../../config/database');
const env = require('../../config/env');
const AppError = require('../../utils/AppError');
const email = require('../../utils/email');
const cpf_ = require('../../utils/cpf');
const cnpj_ = require('../../utils/cnpj');



class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}


if (!env.jwt.secret || !env.jwt.refreshSecret) {
  throw new Error('JWT secrets não configurados no .env');
}

function generateTokens(user) {
  const accessPayload  = { sub: user.id, tipo: user.tipo, email: user.email };
  const refreshPayload = { sub: user.id, jti: crypto.randomUUID() };

  const access  = jwt.sign(accessPayload,  env.jwt.secret,        { expiresIn: env.jwt.expiresIn });
  const refresh = jwt.sign(refreshPayload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });

  return { access, refresh };
}

async function registerCliente(data) {
  const { nome, email: emailAddr, senha, cpf, telefone, data_nascimento } = data;

  if (!nome?.trim()) throw new AppError(400, 'Nome é obrigatório');
  if (!emailAddr?.trim()) throw new AppError(400, 'Email é obrigatório');
  if (!senha || senha.length < 6) throw new AppError(400, 'Senha muito curta');
  if (cpf && !cpf_.validate(cpf)) throw new AppError(400, 'CPF inválido');

  const exists = await db.queryOne('SELECT id FROM usuario WHERE email = ?', [emailAddr]);
  if (exists) throw new AppError(409, 'Email já cadastrado');

  const conn = await db.beginTransaction();
  try {
    const hash = await bcrypt.hash(senha, 10);
    const token = crypto.randomBytes(32).toString('hex');

    const r = await conn.execute(
      `INSERT INTO usuario (tipo, email, senha_hash, token_verificacao, token_expira_em) VALUES ('cliente', ?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))`,
      [emailAddr, hash, token]
    );
    const userId = r[0].insertId;

    await conn.execute(
      `INSERT INTO cliente (id, nome, cpf, telefone, data_nascimento, score) VALUES (?, ?, ?, ?, ?, 100.00)`,
      [userId, nome, cpf || null, telefone || null, data_nascimento || null]
    );

    await conn.commit();
    conn.release();

    const link = `${env.app.url}/api/auth/verificar/${token}`;
    const html = email.verificacaoTemplate(nome, link);
    await email.send(emailAddr, 'Confirme seu email - AgendaTech', html);

    const user = { id: userId, tipo: 'cliente', email: emailAddr };
    return { user, tokens: generateTokens(user), emailVerificado: false };
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error('Erro no registro de cliente:', err);
    throw new AppError(500, 'Erro ao registrar usuário');
  }
}


async function registerEmpresa(data) {
  const { email: emailAddr, senha, cnpj, razao_social, nome_fantasia, telefone, cep } = data;

  if (!emailAddr?.trim()) throw new AppError(400, 'Email é obrigatório');
  if (!senha || senha.length < 6) throw new AppError(400, 'Senha muito curta');
  if (!cnpj) throw new AppError(400, 'CNPJ é obrigatório');
  if (!cnpj_.validate(cnpj)) throw new AppError(400, 'CNPJ inválido');
  if (!razao_social?.trim()) throw new AppError(400, 'Razão social é obrigatória');
  if (!nome_fantasia?.trim()) throw new AppError(400, 'Nome fantasia é obrigatório');

  const exists = await db.queryOne('SELECT id FROM usuario WHERE email = ?', [emailAddr]);
  if (exists) throw new AppError(409, 'Email já cadastrado');

  const conn = await db.beginTransaction();
  try {
    const hash = await bcrypt.hash(senha, 10);
    const token = crypto.randomBytes(32).toString('hex');

    const r = await conn.execute(
      `INSERT INTO usuario (tipo, email, senha_hash, token_verificacao, token_expira_em) VALUES ('empresa', ?, ?, ?, DATE_ADD(NOW(), INTERVAL 24 HOUR))`,
      [emailAddr, hash, token]
    );
    const userId = r[0].insertId;

    await conn.execute(
      `INSERT INTO empresa (id, cnpj, razao_social, nome_fantasia, telefone, cep) VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, cnpj, razao_social, nome_fantasia, telefone || null, cep || null]
    );

    await conn.execute(
      `INSERT INTO empresaProfile (empresa_id, ativo) VALUES (?, TRUE)`,
      [userId]
    );

    await conn.commit();
    conn.release();

    const link = `${env.app.url}/api/auth/verificar/${token}`;
    const html = email.verificacaoTemplate(nome_fantasia, link);
    await email.send(emailAddr, 'Confirme seu email - AgendaTech', html);

    const user = { id: userId, tipo: 'empresa', email: emailAddr };
    return { user, tokens: generateTokens(user), emailVerificado: false };
  } catch (err) {
    await conn.rollback();
    conn.release();
    console.error('Erro no registro de empresa:', err);
    throw new AppError(500, 'Erro ao registrar empresa');
  }
}
async function verificarEmail(token) {
  const user = await db.queryOne(
    `SELECT id, email, email_verificado FROM usuario WHERE token_verificacao = ?`,
    [token]
  );
  if (!user) throw new AppError(400, 'Token inválido');
  if (user.email_verificado) return { message: 'Email já verificado' };

  const r = await db.execute(
    `UPDATE usuario SET email_verificado = TRUE, token_verificacao = NULL, token_expira_em = NULL WHERE id = ? AND token_expira_em > NOW()`,
    [user.id]
  );
  if (r.affectedRows === 0) throw new AppError(400, 'Token expirado. Solicite um novo.');

  return { message: 'Email verificado com sucesso' };
}
async function reenviarVerificacao(emailAddr) {
  const user = await db.queryOne(
    `SELECT id, tipo, email, email_verificado FROM usuario WHERE email = ?`,
    [emailAddr]
  );
  if (!user) throw new AppError(404, 'Usuário não encontrado');
  if (user.email_verificado) throw new AppError(400, 'Email já verificado');

  const token = crypto.randomBytes(32).toString('hex');
  await db.execute(
    `UPDATE usuario SET token_verificacao = ?, token_expira_em = DATE_ADD(NOW(), INTERVAL 24 HOUR) WHERE id = ?`,
    [token, user.id]
  );

  const nome = user.tipo === 'empresa'
    ? (await db.queryOne(`SELECT nome_fantasia FROM empresa WHERE id = ?`, [user.id]))?.nome_fantasia
    : (await db.queryOne(`SELECT nome FROM cliente WHERE id = ?`, [user.id]))?.nome;

  const link = `${env.app.url}/api/auth/verificar/${token}`;
  const html = email.verificacaoTemplate(nome || 'Usuário', link);
  await email.send(emailAddr, 'Confirme seu email - AgendaTech', html);

  return { message: 'Email de verificação reenviado' };
}

async function login(emailAddr, senha) {
  const user = await db.queryOne(
    `SELECT u.id, u.tipo, u.email, u.senha_hash, u.ativo, u.email_verificado
     FROM usuario u WHERE u.email = ?`,
    [emailAddr]
  );

  if (!user || !user.ativo) {
    throw new AppError(401, 'Credenciais inválidas');
  }

  const match = await bcrypt.compare(senha, user.senha_hash);
  if (!match) {
    throw new AppError(401, 'Credenciais inválidas');
  }

  if (!user.email_verificado) {
    throw new AppError(403, 'Confirme seu email antes de fazer login');
  }

  const payload = { id: user.id, tipo: user.tipo, email: user.email };
  return { user: payload, tokens: generateTokens(payload) };
}


async function refresh(refreshToken) {
  let payload;
  try {
    payload = jwt.verify(refreshToken, env.jwt.refreshSecret);
  } catch {
    throw new AppError(401, 'Refresh token inválido ou expirado');
  }

  const user = await db.queryOne(
    `SELECT id, tipo, email, ativo FROM usuario WHERE id = ?`,
    [payload.sub]
  );

  if (!user || !user.ativo) {
    throw new AppError(401, 'Usuário inativo');
  }

  const u = { id: user.id, tipo: user.tipo, email: user.email };
  return { tokens: generateTokens(u) };
}

async function me(userId, tipo) {
  if (tipo === 'empresa') {
    return db.queryOne(
      `SELECT u.id, u.email, u.ativo, u.data_criacao, u.foto,
              e.cnpj, e.razao_social, e.nome_fantasia, e.telefone, e.cep,
              e.endereco, e.numero, e.complemento, e.bairro, e.cidade, e.estado,
              e.nicho, e.sub_nicho, e.verificada,
              ep.descricao, ep.logo_url, ep.cor_primaria, ep.cor_secundaria
       FROM usuario u
       JOIN empresa e ON e.id = u.id
       LEFT JOIN empresaProfile ep ON ep.empresa_id = e.id
       WHERE u.id = ?`,
      [userId]
    );
  }

  return db.queryOne(
    `SELECT u.id, u.email, u.ativo, u.data_criacao, u.foto,
            c.nome, c.cpf, c.verificado, c.data_nascimento, c.telefone, c.score
     FROM usuario u
     JOIN cliente c ON c.id = u.id
     WHERE u.id = ?`,
    [userId]
  );
}

module.exports = { registerCliente, registerEmpresa, login, refresh, me, verificarEmail, reenviarVerificacao };
