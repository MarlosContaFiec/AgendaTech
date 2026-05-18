'use strict';
const res_ = require('../../utils/response');
const { getFileInfo } = require('./upload.service');

async function single(req, res, next) {
  try {
    if (!req.file) return res_.badRequest(res, 'Nenhum arquivo enviado');
    res_.ok(res, getFileInfo(req.file), 'Arquivo enviado');
  } catch (e) { next(e); }
}

async function multiple(req, res, next) {
  try {
    if (!req.files?.length) return res_.badRequest(res, 'Nenhum arquivo enviado');
    res_.ok(res, req.files.map(getFileInfo), 'Arquivos enviados');
  } catch (e) { next(e); }
}

module.exports = { single, multiple };
