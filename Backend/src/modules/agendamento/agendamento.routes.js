'use strict';
const router = require('express').Router();
const ctrl   = require('./agendamento.controller');
const { authenticate, requireEmpresa, requireCliente } = require('../../middlewares/auth');
const { validate, schemas } = require('../../middlewares/validate');


router.get('/slots', authenticate, ctrl.getSlots);


router.get('/empresa',requireEmpresa, ctrl.listEmpresa);
router.put('/:id/aceitar',requireEmpresa, ctrl.aceitar);
router.put('/:id/recusar',requireEmpresa, validate(schemas.recusar), ctrl.recusar);
router.put('/:id/concluir',requireEmpresa, ctrl.concluir);


router.post('/',requireCliente, validate(schemas.createAgendamento), ctrl.create);
router.get('/cliente',requireCliente, ctrl.listCliente);
router.put('/:id/cancelar',requireCliente, validate(schemas.cancelar), ctrl.cancelarCliente);
router.put('/:id/reagendar',requireCliente, validate(schemas.reagendar), ctrl.reagendar);


router.get('/:id',authenticate, ctrl.getById);

module.exports = router;
