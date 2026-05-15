'use strict';
const router     = require('express').Router();
const ctrl       = require('./auth.controller');
const { validate, schemas } = require('../../middlewares/validate');
const { authenticate }      = require('../../middlewares/auth');

router.post('/register/cliente',validate(schemas.registerCliente),ctrl.registerCliente);
router.post('/register/empresa',validate(schemas.registerEmpresa),ctrl.registerEmpresa);
router.post('/login',validate(schemas.login),ctrl.login);
router.post('/refresh', validate(schemas.refresh), ctrl.refresh);
router.get('/me',authenticate,ctrl.me);
router.get('/verificar/:token', ctrl.verificarEmail);
router.post('/reenviar-verificacao', validate(schemas.reenviarVerificacao), ctrl.reenviarVerificacao);

module.exports = router;
