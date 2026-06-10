'use strict';
const AppError = require('./AppError');

/**
 * Builds SET clause fragments for a dynamic UPDATE statement.
 * Only includes fields present in `data` (value !== undefined).
 *
 * @param {Object}   data           - Object with field values
 * @param {string[]} allowedFields  - Whitelist of column names
 * @param {Object}   [transforms]   - Optional { fieldName: (value) => transformedValue }
 * @returns {{ sets: string[], vals: any[] }}
 */
function buildUpdateSets(data, allowedFields, transforms = {}) {
  const sets = [];
  const vals = [];
  for (const field of allowedFields) {
    if (data[field] !== undefined) {
      sets.push(`${field} = ?`);
      const transform = transforms[field];
      vals.push(transform ? transform(data[field]) : data[field]);
    }
  }
  return { sets, vals };
}

/**
 * Throws AppError(404) when affectedRows === 0 after an UPDATE or DELETE.
 *
 * @param {Object} result     - MySQL ResultSetHeader with affectedRows
 * @param {string} entityName - Human-readable entity name for the error message
 */
function ensureAffected(result, entityName) {
  if (result.affectedRows === 0) {
    throw new AppError(404, `${entityName} não encontrado`);
  }
}

module.exports = { buildUpdateSets, ensureAffected };
