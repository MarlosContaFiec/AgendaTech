'use strict';
const router = require('express').Router();
const { authenticate } = require('../../middlewares/auth');
const db = require('../../config/database');

router.get('/', authenticate, async (req, res, next) => {
  try {
    const userId = req.user.id;
    const tipo = req.user.tipo;
    const where = tipo === 'empresa' ? 'n.empresa_id = ?' : 'n.cliente_id = ?';

    const rows = await db.query(
      `SELECT n.id, n.tipo, n.mensagem, n.enviado_em,
              CASE WHEN n.enviado_em > DATE_SUB(NOW(), INTERVAL 1 HOUR) THEN 0 ELSE 1 END AS lida
       FROM notificacao_log n
       WHERE ${where}
       ORDER BY n.enviado_em DESC
       LIMIT 50`,
      [userId]
    );

    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
