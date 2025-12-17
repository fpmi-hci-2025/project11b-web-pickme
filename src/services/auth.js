import api from './api'

export const authService = {
  async login(email, password) {
    const response = await api.post('/auth/login/', { email, password })
    return response.data
  },

  async register(data) {
    const response = await api.post('/auth/register/', data)
    return response.data
  },

  async logout(refreshToken) {
    await api.post('/auth/logout/', { refresh: refreshToken })
  },

  async getCurrentUser() {
    const response = await api.get('/users/me/')
    return response.data
  },
}
