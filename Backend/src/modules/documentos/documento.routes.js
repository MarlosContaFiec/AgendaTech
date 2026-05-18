'use strict';
const router = require('express').Router();
const ctrl = require('./documento.controller');
const { requireCliente, requireEmpresa } = require('../../middlewares/auth');
const { validate, schemas } = require('../../middlewares/validate');

router.get('/', requireCliente, ctrl.list);
router.post('/', requireCliente, validate(schemas.createDocumento), ctrl.create);
router.delete('/:id', requireCliente, ctrl.remove);

router.get('/empresa', requireEmpresa, ctrl.listEmpresaDocs);
router.put('/:id/revisar', requireEmpresa, validate(schemas.revisarDocumento), ctrl.revisar);

module.exports = router;
