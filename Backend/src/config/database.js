'use strict';
const mysql  = require('mysql2/promise');
const env    = require('./env');

const pool = mysql.createPool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  timezone: '-03:00',
  charset: 'utf8mb4',
});


/** Executa query com parâmetros e retorna rows */
async function query(sql, params = []) {
  const [rows] = await pool.execute(sql, params);
  return rows;
}


/** Executa query SEM prepared statement (necessário para LIMIT/OFFSET dinâmicos no MySQL 8) */
async function queryRaw(sql, params = []) {
  const [rows] = await pool.query(sql, params);
  return rows;
}

/** Executa query e retorna primeira linha ou null */
async function queryOne(sql, params = []) {
  const rows = await query(sql, params);
  return rows[0] || null;
}

/** Executa query de inserção/update e retorna ResultSetHeader */
async function execute(sql, params = []) {
  const [result] = await pool.execute(sql, params);
  return result;
}

/** Inicia uma transação e retorna a conexão */
async function beginTransaction() {
  const conn = await pool.getConnection();
  await conn.beginTransaction();
  return conn;
}

module.exports = { pool, query, queryRaw, queryOne, execute, beginTransaction };
