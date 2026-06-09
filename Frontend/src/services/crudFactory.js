import { api } from './api'

/**
 * Creates standard CRUD service functions for a given API base path.
 * Eliminates repetitive list/get/create/update/delete boilerplate.
 *
 * Usage:
 *   const tagService = createCrudService('/api/tags');
 *   tagService.list()          // GET /api/tags
 *   tagService.get(1)          // GET /api/tags/1
 *   tagService.create(payload) // POST /api/tags
 *   tagService.update(1, payload) // PUT /api/tags/1
 *   tagService.remove(1)       // DELETE /api/tags/1
 */
export function createCrudService(basePath) {
  return {
    list:   (query = '')     => api(`${basePath}${query}`),
    get:    (id)             => api(`${basePath}/${id}`),
    create: (payload)        => api(basePath, { method: 'POST', body: payload }),
    update: (id, payload)    => api(`${basePath}/${id}`, { method: 'PUT', body: payload }),
    remove: (id)             => api(`${basePath}/${id}`, { method: 'DELETE' }),
  }
}
