import api from './api'

export const postService = {
  async getPosts(page = 1) {
    const response = await api.get(`/posts/?page=${page}`)
    return response.data
  },

  async getPost(postId) {
    const response = await api.get(`/posts/${postId}/`)
    return response.data
  },

  async getUserPosts(userId, page = 1) {
    const response = await api.get(`/posts/user/${userId}/?page=${page}`)
    return response.data
  },

  async createPost(data) {
    const formData = new FormData()

    Object.keys(data).forEach(key => {
      if (key === 'audience_groups') {
        data[key].forEach(groupId => {
          formData.append('audience_groups', groupId)
        })
      } else if (key === 'media_file' && data[key]) {
        formData.append('media_file', data[key])
      } else if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key])
      }
    })

    const response = await api.post('/posts/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  },

  async updatePost(postId, data) {
    const response = await api.patch(`/posts/${postId}/`, data)
    return response.data
  },

  async deletePost(postId) {
    await api.delete(`/posts/${postId}/`)
  },

  async likePost(postId) {
    const response = await api.post(`/posts/${postId}/like/`)
    return response.data
  },

  async unlikePost(postId) {
    const response = await api.delete(`/posts/${postId}/like/`)
    return response.data
  },
}
