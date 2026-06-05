import apiClient from './apiClient'

export async function listAll() {
  const response = await apiClient.get('/categorias')
  return response.data
}

export async function getById(id) {
  const response = await apiClient.get(`/categorias/${id}`)
  return response.data
}

export async function create(data) {
  const response = await apiClient.post('/categorias', data)
  return response.data
}

export async function update(id, data) {
  const response = await apiClient.put(`/categorias/${id}`, data)
  return response.data
}

export async function softDelete(id) {
  const response = await apiClient.delete(`/categorias/${id}`)
  return response.data
}
