'use strict';
const router = require('express').Router();
const ctrl   = require('./servico.controller');
const { requireEmpresa }    = require('../../middlewares/auth');
const { validate, schemas } = require('../../middlewares/validate');

router.get('/',        requireEmpresa, ctrl.list);
router.post('/',       requireEmpresa, validate(schemas.createServico), ctrl.create);
router.get('/:id',     requireEmpresa, ctrl.getById);
router.put('/:id',     requireEmpresa, validate(schemas.createServico), ctrl.update);
router.delete('/:id',  requireEmpresa, ctrl.remove);

module.exports = router;
