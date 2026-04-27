'use strict';
const svc  = require('./tags.service');
const res_ = require('../../utils/response');

const list   = async (req, res, next) => { try { res_.ok(res, await svc.list(req.user.id)); }                         catch (e) { next(e); }};
const create = async (req, res, next) => { try { res_.created(res, await svc.create(req.user.id, req.body)); }        catch (e) { next(e); }};
const update = async (req, res, next) => { try { res_.ok(res, await svc.update(req.user.id, req.params.id, req.body));} catch (e) { next(e); }};
const remove = async (req, res, next) => { try { await svc.remove(req.user.id, req.params.id); res_.ok(res, null, 'Tag removida'); } catch (e) { next(e); }};

module.exports = { list, create, update, remove };
