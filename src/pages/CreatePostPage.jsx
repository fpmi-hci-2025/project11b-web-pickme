import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { postService } from '../services/posts'
import { groupService } from '../services/groups'
import TextArea from '../components/common/TextArea'
import Input from '../components/common/Input'
import Select from '../components/common/Select'
import Button from '../components/common/Button'
import toast from 'react-hot-toast'

export default function CreatePostPage() {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [groups, setGroups] = useState([])
  const [selectedGroups, setSelectedGroups] = useState([])
  const [mediaPreview, setMediaPreview] = useState(null)
  const [mediaFile, setMediaFile] = useState(null)
  const fileInputRef = useRef(null)
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      content_type: 'text',
      audience_type: 'everyone',
      media_type: '',
    },
  })

  const contentType = watch('content_type')
  const audienceType = watch('audience_type')
  const mediaType = watch('media_type')

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const data = await groupService.getGroups()
        setGroups(data.results || [])
      } catch (error) {
        console.error('Error loading groups:', error)
      }
    }
    loadGroups()
  }, [])

  const handleMediaChange = (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setMediaFile(file)
    
    if (file.type.startsWith('image/') || file.type.startsWith('video/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setMediaPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const toggleGroup = (groupId) => {
    setSelectedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    )
  }

  const onSubmit = async (data) => {
    if (audienceType === 'groups' && selectedGroups.length === 0) {
      toast.error('Выберите хотя бы одну группу')
      return
    }

    setIsLoading(true)
    try {
      const postData = {
        content_type: data.content_type,
        text_content: data.text_content || '',
        audience_type: data.audience_type,
        audience_groups: selectedGroups,
      }

      if (contentType === 'media') {
        postData.media_type = data.media_type
        if (data.media_type === 'link') {
          postData.media_url = data.media_url
        } else if (mediaFile) {
          postData.media_file = mediaFile
        }
      }

      await postService.createPost(postData)
      toast.success('Пост опубликован!')
      navigate('/')
    } catch (error) {
      const errorData = error.response?.data
      if (errorData) {
        Object.keys(errorData).forEach(key => {
          toast.error(`${key}: ${errorData[key]}`)
        })
      } else {
        toast.error('Ошибка публикации')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-h2 mb-6">Новый пост</h1>
      
      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Content Type */}
          <div className="mb-4">
            <label className="block text-body2 text-text-primary mb-2 font-medium">
              Тип контента
            </label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="text"
                  {...register('content_type')}
                  className="text-primary-pink"
                />
                <span>Текст</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  value="media"
                  {...register('content_type')}
                  className="text-primary-pink"
                />
                <span>Медиа</span>
              </label>
            </div>
          </div>
          
          {/* Text Content */}
          <TextArea
            label={contentType === 'text' ? 'Текст поста' : 'Описание (опционально)'}
            {...register('text_content', {
              required: contentType === 'text' ? 'Введите текст поста' : false,
              maxLength: {
                value: 5000,
                message: 'Максимум 5000 символов',
              },
            })}
            error={errors.text_content?.message}
            placeholder="Что у вас нового?"
            rows={5}
          />
          
          {/* Media Options */}
          {contentType === 'media' && (
            <div className="mb-4">
              <Select
                label="Тип медиа"
                {...register('media_type', {
                  required: contentType === 'media' ? 'Выберите тип медиа' : false,
                })}
                error={errors.media_type?.message}
                options={[
                  { value: '', label: 'Выберите тип' },
                  { value: 'photo', label: 'Фото' },
                  { value: 'video', label: 'Видео' },
                  { value: 'link', label: 'Ссылка' },
                ]}
              />
              
              {mediaType === 'link' ? (
                <Input
                  label="URL ссылки"
                  type="url"
                  {...register('media_url', {
                    required: mediaType === 'link' ? 'Введите URL' : false,
                  })}
                  error={errors.media_url?.message}
                  placeholder="https://..."
                />
              ) : mediaType && (
                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleMediaChange}
                    accept={mediaType === 'photo' ? 'image/*' : 'video/*'}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full p-8 border-2 border-dashed border-primary-soft rounded-lg hover:border-primary-pink transition-colors"
                  >
                    {mediaPreview ? (
                      mediaType === 'photo' ? (
                        <img src={mediaPreview} alt="Preview" className="max-h-48 mx-auto rounded" />
                      ) : (
                        <video src={mediaPreview} className="max-h-48 mx-auto rounded" controls />
                      )
                    ) : (
                      <div className="text-text-secondary">
                        <i className={`fas ${mediaType === 'photo' ? 'fa-image' : 'fa-video'} text-3xl mb-2`}></i>
                        <p>Нажмите для выбора {mediaType === 'photo' ? 'фото' : 'видео'}</p>
                      </div>
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
          
          {/* Audience */}
          <div className="mb-4">
            <label className="block text-body2 text-text-primary mb-2 font-medium">
              Кто увидит пост
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg hover:bg-background-light">
                <input
                  type="radio"
                  value="everyone"
                  {...register('audience_type')}
                  className="text-primary-pink"
                />
                <i className="fas fa-globe text-primary-pink"></i>
                <span>Все</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg hover:bg-background-light">
                <input
                  type="radio"
                  value="groups"
                  {...register('audience_type')}
                  className="text-primary-pink"
                />
                <i className="fas fa-users text-primary-pink"></i>
                <span>Определённые группы</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-3 rounded-lg hover:bg-background-light">
                <input
                  type="radio"
                  value="only_me"
                  {...register('audience_type')}
                  className="text-primary-pink"
                />
                <i className="fas fa-lock text-primary-pink"></i>
                <span>Только я</span>
              </label>
            </div>
          </div>
          
          {/* Group Selection */}
          {audienceType === 'groups' && (
            <div className="mb-4">
              <label className="block text-body2 text-text-primary mb-2 font-medium">
                Выберите группы
              </label>
              {groups.length === 0 ? (
                <p className="text-text-secondary text-sm">
                  У вас нет групп.{' '}
                  <a href="/groups" className="text-primary-pink hover:underline">
                    Создайте группу
                  </a>
                </p>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {groups.map(group => (
                    <label
                      key={group.id}
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                        selectedGroups.includes(group.id)
                          ? 'bg-primary-pink/10 border border-primary-pink'
                          : 'bg-background-light hover:bg-primary-soft/20'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedGroups.includes(group.id)}
                        onChange={() => toggleGroup(group.id)}
                        className="hidden"
                      />
                      <i className={`fas ${
                        selectedGroups.includes(group.id) ? 'fa-check-square' : 'fa-square'
                      } text-primary-pink`}></i>
                      <span>{group.name}</span>
                      <span className="text-text-secondary text-sm ml-auto">
                        {group.members_count} чел.
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
          
          {/* Submit */}
          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate(-1)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="filled"
              isLoading={isLoading}
              className="flex-1"
            >
              Опубликовать
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
