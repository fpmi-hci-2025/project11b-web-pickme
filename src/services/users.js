import api from './api'

export const userService = {
  async getUser(userId) {
    const response = await api.get(`/users/${userId}/`)
    return response.data
  },

  async updateUser(userId, data) {
    const response = await api.patch(`/users/${userId}/update/`, data)
    return response.data
  },

  async uploadAvatar(userId, file) {
    const formData = new FormData()
    formData.append('avatar', file)
    
    const response = await api.post(`/users/${userId}/avatar/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async searchUsers(query) {
    const response = await api.get(`/users/search/?q=${query}`)
    return response.data.results
  },
}
