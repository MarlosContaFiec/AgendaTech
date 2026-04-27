'use strict';
const bcrypt = require('bcryptjs');
const jwt    = require('jsonwebtoken');
const db     = require('../../config/database');
const env    = require('../../config/env');
const cpf_   = require('../../utils/cpf');
const cnpj_  = require('../../utils/cnpj');

function generateTokens(user) {
  const payload = { sub: user.id, tipo: user.tipo, email: user.email };
  const access  = jwt.sign(payload, env.jwt.secret,        { expiresIn: env.jwt.expiresIn });
  const refresh = jwt.sign(payload, env.jwt.refreshSecret, { expiresIn: env.jwt.refreshExpiresIn });
  return { access, refresh };
}

async function registerCliente(data) {
  const { nome, email, senha, cpf, telefone, data_nascimento } = data;

  
  if (cpf && !cpf_.validate(cpf)) throw { statusCode: 400, message: 'CPF inválido' };

  const conn = await db.beginTransaction();
  try {
    const hash = await bcrypt.hash(senha, 10);

    const r = await conn.execute(
      `INSERT INTO usuario (tipo, email, senha_hash) VALUES ('cliente', ?, ?)`,
      [email, hash]
    );
    const userId = r[0].insertId;

    await conn.execute(
      `INSERT INTO cliente (id, nome, cpf, telefone, data_nascimento, score)
       VALUES (?, ?, ?, ?, ?, 100.00)`,
      [userId, nome, cpf || null, telefone || null, data_nascimento || null]
    );

    await conn.commit();
    conn.release();

    const user = { id: userId, tipo: 'cliente', email };
    return { user, tokens: generateTokens(user) };
  } catch (err) {
    await conn.rollback();
    conn.release();
    throw err;
  }
}

async function registerEmpresa(data) {
  const { email, senha, cnpj, razao_social, nome_fantasia, telefone, cep } = data;

  if (!cnpj_.validate(cnpj)) throw { statusCode: 400, message: 'CNPJ inválido' };

  const conn = await db.beginTransaction();
  try {
    const hash = await bcrypt.hash(senha, 10);

    const r = await conn.execute(
      `INSERT INTO usuario (tipo, email, senha_hash) VALUES ('empresa', ?, ?)`,
      [email, hash]
    );
    const userId = r[0].insertId;

    await conn.execute(
      `INSERT INTO empresa (id, cnpj, razao_social, nome_fantasia, telefone, cep)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, cnpj, razao_social, nome_fantasia, telefone || null, cep || null]
    );

    await conn.execute(
      `INSERT INTO empresaProfile (empresa_id, ativo) VALUES (?, TRUE)`,
      [userId]
    );

    await conn.commit();
    conn.release();

    const user = { id: userId, tipo: 'empresa', email };
    return { user, tokens: generateTokens(user) };
  } catch (err) {
    await conn.rollback();
    conn.release();
    throw err;
  }
}

async function login(email, senha) {
  const user = await db.queryOne(
    `SELECT u.id, u.tipo, u.email, u.senha_hash, u.ativo
     FROM usuario u WHERE u.email = ?`,
    [email]
  );

  if (!user) throw { statusCode: 401, message: 'Credenciais inválidas' };
  if (!user.ativo) throw { statusCode: 403, message: 'Conta desativada' };

  const match = await bcrypt.compare(senha, user.senha_hash);
  if (!match) throw { statusCode: 401, message: 'Credenciais inválidas' };

  const u = { id: user.id, tipo: user.tipo, email: user.email };
  return { user: u, tokens: generateTokens(u) };
}

async function refresh(refreshToken) {
  let payload;
  try {
    payload = jwt.verify(refreshToken, env.jwt.refreshSecret);
  } catch {
    throw { statusCode: 401, message: 'Refresh token inválido ou expirado' };
  }

  const user = await db.queryOne(
    `SELECT id, tipo, email, ativo FROM usuario WHERE id = ?`,
    [payload.sub]
  );

  if (!user || !user.ativo) throw { statusCode: 401, message: 'Usuário inativo' };

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
  } else {
    return db.queryOne(
      `SELECT u.id, u.email, u.ativo, u.data_criacao, u.foto,
              c.nome, c.cpf, c.verificado, c.data_nascimento, c.telefone, c.score
       FROM usuario u
       JOIN cliente c ON c.id = u.id
       WHERE u.id = ?`,
      [userId]
    );
  }
}

module.exports = { registerCliente, registerEmpresa, login, refresh, me };
