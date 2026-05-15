'use strict';
const router = require('express').Router();
const ctrl = require('./upload.controller');
const { authenticate } = require('../../middlewares/auth');
const { upload } = require('./upload.service');

router.post('/single', authenticate, upload.single('arquivo'), ctrl.single);
router.post('/multiple', authenticate, upload.array('arquivos', 5), ctrl.multiple);

module.exports = router;
