'use strict';
const router = require('express').Router();
const ctrl = require('./fila.controller');
const { requireCliente, requireEmpresa } = require('../../middlewares/auth');
const { validate, schemas } = require('../../middlewares/validate');

router.post('/', requireCliente, validate(schemas.entrarFila), ctrl.entrar);
router.delete('/:id', requireCliente, ctrl.sair);
router.get('/', requireCliente, ctrl.listCliente);
router.put('/:id/converter', requireCliente, ctrl.converter);

router.get('/empresa', requireEmpresa, ctrl.listEmpresa);

module.exports = router;