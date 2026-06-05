import apiClient from './apiClient'

export async function listAll(params = {}) {
  const response = await apiClient.get('/usuarios', { params })
  return response.data
}

export async function getById(id) {
  const response = await apiClient.get(`/usuarios/${id}`)
  return response.data
}

export async function create(data) {
  const response = await apiClient.post('/usuarios', data)
  return response.data
}

export async function update(id, data) {
  const response = await apiClient.put(`/usuarios/${id}`, data)
  return response.data
}

export async function softDelete(id) {
  const response = await apiClient.delete(`/usuarios/${id}`)
  return response.data
}

export async function reactivate(id) {
  const response = await apiClient.post(`/usuarios/${id}/reactivar`)
  return response.data
}
