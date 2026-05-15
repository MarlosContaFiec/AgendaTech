'use strict';
const router = require('express').Router();
const ctrl = require('./dependente.controller');
const { requireCliente } = require('../../middlewares/auth');
const { validate, schemas } = require('../../middlewares/validate');

router.get('/', requireCliente, ctrl.list);
router.post('/', requireCliente, validate(schemas.createDependente), ctrl.create);
router.put('/:id', requireCliente, validate(schemas.updateDependente), ctrl.update);
router.delete('/:id', requireCliente, ctrl.remove);

module.exports = router;
