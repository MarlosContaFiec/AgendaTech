'use strict';
const router = require('express').Router();
const ctrl = require('./solicitacao.controller');
const { requireCliente, requireEmpresa } = require('../../middlewares/auth');
const { validate, schemas } = require('../../middlewares/validate');

router.post('/', requireCliente, validate(schemas.solicitacaoHorario), ctrl.create);
router.get('/pendentes', requireEmpresa, ctrl.listPendentes);
router.put('/:id/responder', requireEmpresa, validate(schemas.responderSolicitacao), ctrl.responder);

module.exports = router;
