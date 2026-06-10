'use strict';

/**
 * Wraps an async Express handler so that any thrown error is forwarded to next().
 * Eliminates the repetitive try/catch pattern in every controller action.
 *
 * Usage:
 *   const wrap = require('../../utils/wrapAsync');
 *   const list = wrap(async (req, res) => { res_.ok(res, await svc.list(req.user.id)); });
 */
const wrapAsync = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

module.exports = wrapAsync;
