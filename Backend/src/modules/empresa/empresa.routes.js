'use strict';
const router = require('express').Router();
const ctrl   = require('./empresa.controller');
const { requireEmpresa } = require('../../middlewares/auth');
const { validate, schemas } = require('../../middlewares/validate');

router.get('/perfil', requireEmpresa, ctrl.getPerfil);
router.put('/perfil', requireEmpresa, validate(schemas.updatePerfil), ctrl.updatePerfil);
router.get('/dashboard', requireEmpresa, ctrl.getDashboard);
router.get('/capacidades', requireEmpresa, ctrl.getCapacidades);
router.post('/capacidades', requireEmpresa, validate(schemas.capacidadeHorario), ctrl.upsertCapacidade);
router.delete('/capacidades/:id', requireEmpresa, ctrl.deleteCapacidade);

module.exports = router;
