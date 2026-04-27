'use strict';
require('dotenv').config();
const fs    = require('fs');
const path  = require('path');
const mysql = require('mysql2/promise');
const env   = require('../config/env');

const SQL_DIR = path.join(__dirname, 'sql');

async function getConnection() {
  let attempts = 0;
  while (true) {
    try {
      return await mysql.createConnection({
        host:     env.db.host,
        port:     env.db.port,
        database: env.db.database,
        user:     env.db.user,
        password: env.db.password,
        charset:  'utf8mb4',
      });
    } catch (err) {
      attempts++;
      if (attempts >= 30) throw err;
      process.stdout.write(attempts === 1 ? '  Aguardando MySQL.' : '.');
      await new Promise(r => setTimeout(r, 2000));
    }
  }
}

function splitStatements(sql) {
  return sql
    .replace(/\r/g, '')
    .split(/;\s*\n/)
    .map(s =>
      s
        .split('\n')
        .filter(l => !l.trim().startsWith('--'))
        .join('\n')
        .trim()
    )
    .filter(Boolean);
}


const IGNORABLE = new Set([1060, 1061, 1062, 1826, 1050, 1007]);

async function run() {
  const withSeed = process.argv.includes('--seed');
  let conn;

  console.log('\n🔌 Conectando ao MySQL...');
  try {
    conn = await getConnection();
    console.log('   Conexão estabelecida ✓\n');
  } catch (err) {
    console.error('\n❌ Falha ao conectar:', err.message);
    process.exit(1);
  }

  try {
    await conn.execute(`
      CREATE TABLE IF NOT EXISTS _migrations (
        id          INT PRIMARY KEY AUTO_INCREMENT,
        filename    VARCHAR(255) UNIQUE NOT NULL,
        executed_at DATETIME DEFAULT CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    const files = fs.readdirSync(SQL_DIR)
      .filter(f => f.endsWith('.sql'))
      .sort();

    for (const file of files) {
      if (!withSeed && file.startsWith('003')) {
        console.log(`⏭  Pulando (use --seed para incluir): ${file}`);
        continue;
      }

      const [existing] = await conn.execute(
        'SELECT id FROM _migrations WHERE filename = ?', [file]
      );
      if (existing.length > 0) {
        console.log(`⏭  Já executado: ${file}`);
        continue;
      }

      console.log(`▶  Executando: ${file}`);
      const sql        = fs.readFileSync(path.join(SQL_DIR, file), 'utf8');
      const statements = splitStatements(sql);
      let ok = 0, warn = 0;

      for (const stmt of statements) {
        try {
          await conn.execute(stmt);
          ok++;
        } catch (err) {
          if (IGNORABLE.has(err.errno)) {
            console.warn(`   ⚠  (${err.errno}) ${err.sqlMessage}`);
            warn++;
          } else {
            console.error(`\n❌ Erro fatal no statement:\n${stmt}\n\nMensagem: ${err.message}`);
            throw err;
          }
        }
      }

      await conn.execute('INSERT INTO _migrations (filename) VALUES (?)', [file]);
      console.log(`✅ ${file} — ${ok} statements ok, ${warn} avisos\n`);
    }

    console.log('🎉 Migrações concluídas!\n');
  } catch (err) {
    console.error('❌ Falha:', err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

run();
