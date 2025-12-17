import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import { postService } from '../services/posts'
import { groupService } from '../services/groups'
import TextArea from '../components/common/TextArea'
import Button from '../components/common/Button'
import PostCard from '../components/posts/PostCard'
import toast from 'react-hot-toast'

export default function PostDetailPage() {
  const { postId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [post, setPost] = useState(null)
  const [groups, setGroups] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const { register, handleSubmit, setValue } = useForm()

  useEffect(() => {
    const loadData = async () => {
      try {
        const [postData, groupsData] = await Promise.all([
          postService.getPost(postId),
          groupService.getGroups(),
        ])
        setPost(postData)
        setGroups(groupsData.results || [])
        setSelectedGroups(postData.audience_groups || [])
        setValue('text_content', postData.text_content)
        setValue('audience_type', postData.audience_type)
      } catch (error) {
        toast.error('Ошибка загрузки поста')
        navigate('/')
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [postId, navigate, setValue])

  const isOwn = post?.author.id === user?.id

  const toggleGroup = (groupId) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const onSubmit = async (data) => {
    if (data.audience_type === 'groups' && selectedGroups.length === 0) {
      toast.error('Выберите хотя бы одну группу')
      return
    }

    setIsSaving(true)
    try {
      const updatedPost = await postService.updatePost(postId, {
        text_content: data.text_content,
        audience_type: data.audience_type,
        audience_groups: selectedGroups,
      })
      setPost(updatedPost)
      setIsEditing(false)
      toast.success('Пост обновлён')
    } catch (error) {
      toast.error('Ошибка обновления')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = () => {
    navigate('/')
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-pink border-t-transparent"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary">Пост не найден</p>
      </div>
    )
  }

  if (!isEditing) {
    return (
      <div>
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="text-text-secondary hover:text-text-primary"
          >
            <i className="fas fa-arrow-left text-xl"></i>
          </button>
          <h1 className="text-h3">Пост</h1>
          {isOwn && (
            <button
              onClick={() => setIsEditing(true)}
              className="ml-auto btn btn-outline"
            >
              <i className="fas fa-edit mr-2"></i>
              Редактировать
            </button>
          )}
        </div>
        
        <PostCard post={post} onDelete={handleDelete} />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => setIsEditing(false)}
          className="text-text-secondary hover:text-text-primary"
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        <h1 className="text-h3">Редактирование</h1>
      </div>
      
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)}>
          <TextArea
            label="Текст"
            {...register('text_content')}
            rows={5}
          />
          
          <div className="mb-4">
            <label className="block text-body2 text-text-primary mb-2 font-medium">
              Аудитория
            </label>
            <div className="space-y-2">
              {[
                { value: 'everyone', icon: 'fa-globe', label: 'Все' },
                { value: 'groups', icon: 'fa-users', label: 'Группы' },
                { value: 'only_me', icon: 'fa-lock', label: 'Только я' },
              ].map(option => (
                <label
                  key={option.value}
                  className="flex items-center gap-2 cursor-pointer p-3 rounded-lg hover:bg-background-light"
                >
                  <input
                    type="radio"
                    value={option.value}
                    {...register('audience_type')}
                  />
                  <i className={`fas ${option.icon} text-primary-pink`}></i>
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>
          
          {/* Group Selection for edit mode */}
          {/* Similar to CreatePostPage */}
          
          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="filled"
              isLoading={isSaving}
              className="flex-1"
            >
              Сохранить
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
