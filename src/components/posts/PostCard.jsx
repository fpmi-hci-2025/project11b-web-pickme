import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { formatDistanceToNow } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useAuth } from '../../hooks/useAuth'
import { postService } from '../../services/posts'
import Avatar from '../common/Avatar'
import toast from 'react-hot-toast'

export default function PostCard({ post, onDelete }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [showMenu, setShowMenu] = useState(false)

  const isOwn = post.author.id === user?.id

  const handleDelete = async () => {
    if (window.confirm('Удалить этот пост?')) {
      try {
        await postService.deletePost(post.id)
        toast.success('Пост удалён')
        onDelete?.(post.id)
      } catch (error) {
        toast.error('Ошибка при удалении')
      }
    }
    setShowMenu(false)
  }

  const getAudienceIcon = () => {
    switch (post.audience_type) {
      case 'only_me':
        return 'fa-lock'
      case 'groups':
        return 'fa-users'
      default:
        return 'fa-globe'
    }
  }

  const getAudienceLabel = () => {
    switch (post.audience_type) {
      case 'only_me':
        return 'Только я'
      case 'groups':
        return post.audience_groups_detail?.map(g => g.name).join(', ') || 'Группы'
      default:
        return 'Все'
    }
  }

  return (
    <div className="card mb-4">
      <div className="flex items-start justify-between">
        <Link
          to={`/profile/${post.author.id}`}
          className="flex items-center gap-3 hover:opacity-80"
        >
          <Avatar src={post.author.avatar} alt={post.author.username} />
          <div>
            <p className="font-medium text-text-primary">
              {post.author.first_name} {post.author.last_name}
            </p>
            <p className="text-body2 text-text-secondary">@{post.author.username}</p>
          </div>
        </Link>
        
        {isOwn && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 text-text-secondary hover:text-text-primary"
            >
              <i className="fas fa-ellipsis-h"></i>
            </button>
            
            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setShowMenu(false)}
                ></div>
                <div className="absolute right-0 top-full mt-1 bg-white rounded-lg shadow-lg border border-primary-soft/30 py-2 z-20 min-w-[120px]">
                  <button
                    onClick={() => {
                      navigate(`/post/${post.id}`)
                      setShowMenu(false)
                    }}
                    className="w-full px-4 py-2 text-left hover:bg-background-light text-sm"
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Редактировать
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left hover:bg-background-light text-sm text-red-500"
                  >
                    <i className="fas fa-trash mr-2"></i>
                    Удалить
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4">
        {post.content_type === 'text' ? (
          <p className="text-body1 whitespace-pre-wrap">{post.text_content}</p>
        ) : (
          <div>
            {post.text_content && (
              <p className="text-body1 mb-3 whitespace-pre-wrap">{post.text_content}</p>
            )}
            {post.media_type === 'photo' && post.media_file && (
              <img
                src={post.media_file}
                alt="Post media"
                className="rounded-lg max-h-96 w-full object-cover"
              />
            )}
            {post.media_type === 'video' && post.media_file && (
              <video
                src={post.media_file}
                controls
                className="rounded-lg max-h-96 w-full"
              />
            )}
            {post.media_type === 'link' && post.media_url && (
              <a
                href={post.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 bg-background-light rounded-lg hover:bg-primary-soft/20 transition-colors"
              >
                <i className="fas fa-external-link-alt mr-2 text-primary-pink"></i>
                <span className="text-primary-pink break-all">{post.media_url}</span>
              </a>
            )}
          </div>
        )}
      </div>
      
      <div className="mt-4 pt-4 border-t border-primary-soft/30 flex items-center justify-between text-body2 text-text-secondary">
        <div className="flex items-center gap-2">
          <i className={`fas ${getAudienceIcon()}`}></i>
          <span>{getAudienceLabel()}</span>
        </div>
        <time>
          {formatDistanceToNow(new Date(post.created_at), {
            addSuffix: true,
            locale: ru,
          })}
        </time>
      </div>
    </div>
  )
}
