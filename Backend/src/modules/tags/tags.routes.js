'use strict';
const router = require('express').Router();
const ctrl   = require('./tags.controller');
const { requireEmpresa }    = require('../../middlewares/auth');
const { validate, schemas } = require('../../middlewares/validate');

router.get('/',       requireEmpresa, ctrl.list);
router.post('/',      requireEmpresa, validate(schemas.createTag),  ctrl.create);
router.put('/:id',    requireEmpresa, validate(schemas.updateTag),  ctrl.update);
router.delete('/:id', requireEmpresa, ctrl.remove);

module.exports = router;
