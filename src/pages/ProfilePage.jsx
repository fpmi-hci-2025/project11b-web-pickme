import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { userService } from '../services/users'
import { postService } from '../services/posts'
import Avatar from '../components/common/Avatar'
import PostList from '../components/posts/PostList'
import toast from 'react-hot-toast'

export default function ProfilePage() {
  const { userId } = useParams()
  const { user: currentUser } = useAuth()
  const [profile, setProfile] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const isOwnProfile = currentUser?.id === parseInt(userId)

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const data = await userService.getUser(userId)
        setProfile(data)
      } catch (error) {
        toast.error('Ошибка загрузки профиля')
      } finally {
        setIsLoading(false)
      }
    }

    loadProfile()
  }, [userId])

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-pink border-t-transparent"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <i className="fas fa-user-slash text-4xl text-text-secondary mb-4"></i>
        <p className="text-text-secondary">Пользователь не найден</p>
      </div>
    )
  }

  return (
    <div>
      {/* Profile Header */}
      <div className="card mb-6">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Avatar src={profile.avatar} alt={profile.username} size="xl" />
          
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-h3 text-text-primary">
              {profile.first_name} {profile.last_name}
            </h1>
            <p className="text-body1 text-text-secondary">@{profile.username}</p>
            {profile.bio && (
              <p className="text-body2 text-text-primary mt-2">{profile.bio}</p>
            )}
          </div>
          
          {isOwnProfile && (
            <Link to="/profile/edit" className="btn btn-outline">
              <i className="fas fa-edit mr-2"></i>
              Редактировать
            </Link>
          )}
        </div>
      </div>
      
      {/* Posts */}
      <h2 className="text-h4 mb-4">Публикации</h2>
      <PostList fetchPosts={(page) => postService.getUserPosts(userId, page)} />
    </div>
  )
}
