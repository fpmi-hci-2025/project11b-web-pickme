import api from './api'

export const groupService = {
  async getGroups() {
    const response = await api.get('/friend-groups/')
    return response.data
  },

  async getGroup(groupId) {
    const response = await api.get(`/friend-groups/${groupId}/`)
    return response.data
  },

  async createGroup(name) {
    const response = await api.post('/friend-groups/', { name })
    return response.data
  },

  async updateGroup(groupId, name) {
    const response = await api.patch(`/friend-groups/${groupId}/`, { name })
    return response.data
  },

  async deleteGroup(groupId) {
    await api.delete(`/friend-groups/${groupId}/`)
  },

  async getGroupMembers(groupId) {
    const response = await api.get(`/friend-groups/${groupId}/members/`)
    return response.data.results
  },

  async addMember(groupId, userId) {
    const response = await api.post(`/friend-groups/${groupId}/members/add/`, { user_id: userId })
    return response.data
  },

  async removeMember(groupId, userId) {
    await api.delete(`/friend-groups/${groupId}/members/${userId}/`)
  },
}
