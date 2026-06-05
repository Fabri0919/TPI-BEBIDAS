import apiClient from './apiClient'

/**
 * List products with optional filters
 * @param {{ categoriaId?, search?, priceMin?, priceMax?, includeOutOfStock?, page?, limit? }} params
 */
export async function list(params = {}) {
  const query = {}
  if (params.categoriaId) query.categoria_id = params.categoriaId
  if (params.subcategoria) query.subcategoria = params.subcategoria
  if (params.search) query.q = params.search
  if (params.priceMin !== undefined) query.precio_min = params.priceMin
  if (params.priceMax !== undefined) query.precio_max = params.priceMax
  if (params.includeOutOfStock) query.includeAgotados = true
  if (params.page) query.page = params.page
  if (params.limit) query.limit = params.limit

  const response = await apiClient.get('/productos', { params: query })
  return response.data
}

export async function getById(id) {
  const response = await apiClient.get(`/productos/${id}`)
  return response.data
}

export async function create(data) {
  const response = await apiClient.post('/productos', data)
  return response.data
}

export async function update(id, data) {
  const response = await apiClient.put(`/productos/${id}`, data)
  return response.data
}

export async function softDelete(id) {
  const response = await apiClient.delete(`/productos/${id}`)
  return response.data
}
