import apiClient from './apiClient'

/**
 * Register a new user (rol = 'cliente' assigned by backend)
 * @param {{ email: string, nombre: string, password: string }} data
 * @returns {{ user, token }}
 */
export async function register({ email, nombre, password }) {
  const response = await apiClient.post('/auth/register', { email, nombre, password })
  return response.data
}

/**
 * Login with email + password
 * @param {{ email: string, password: string }} data
 * @returns {{ user, token }}
 */
export async function login({ email, password }) {
  const response = await apiClient.post('/auth/login', { email, password })
  return response.data
}

/**
 * Get current authenticated user info
 * @returns {{ user }}
 */
export async function me() {
  const response = await apiClient.get('/auth/me')
  return response.data
}
