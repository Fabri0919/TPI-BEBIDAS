import apiClient from './apiClient'

/**
 * Place a new order
 * @param {{ items: Array<{producto_id, cantidad}>, direccion_envio: object, notas?: string }} payload
 */
export async function placeOrder({ items, direccion_envio, notas }) {
  const response = await apiClient.post('/pedidos', {
    items,
    direccion_entrega: direccion_envio,
    notas,
  })
  return response.data
}

/**
 * List orders (cliente sees only own; admin sees all)
 */
export async function listMine(filters = {}) {
  const response = await apiClient.get('/pedidos', { params: filters })
  return response.data
}

/**
 * List all orders (admin/super-admin)
 */
export async function listAll(filters = {}) {
  const response = await apiClient.get('/pedidos', { params: filters })
  return response.data
}

export async function getById(id) {
  const response = await apiClient.get(`/pedidos/${id}`)
  return response.data
}

export async function changeState(id, estado) {
  const response = await apiClient.patch(`/pedidos/${id}/estado`, { estado })
  return response.data
}
