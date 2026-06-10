'use strict';
const res_ = require('../../utils/response');
const { getFileInfo } = require('./upload.service');
const wrap = require('../../utils/wrapAsync');

const single = wrap(async (req, res) => {
  if (!req.file) return res_.badRequest(res, 'Nenhum arquivo enviado');
  res_.ok(res, getFileInfo(req.file), 'Arquivo enviado');
});

const multiple = wrap(async (req, res) => {
  if (!req.files?.length) return res_.badRequest(res, 'Nenhum arquivo enviado');
  res_.ok(res, req.files.map(getFileInfo), 'Arquivos enviados');
});

module.exports = { single, multiple };
