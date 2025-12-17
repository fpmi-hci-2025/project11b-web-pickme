import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import { userService } from '../services/users'
import Input from '../components/common/Input'
import TextArea from '../components/common/TextArea'
import Button from '../components/common/Button'
import Avatar from '../components/common/Avatar'
import toast from 'react-hot-toast'

export default function EditProfilePage() {
  const { user, updateUser } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const [avatarPreview, setAvatarPreview] = useState(user?.avatar)
  const fileInputRef = useRef(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: user?.username || '',
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      bio: user?.bio || '',
    },
  })

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setAvatarPreview(reader.result)
    }
    reader.readAsDataURL(file)

    // Upload
    try {
      const data = await userService.uploadAvatar(user.id, file)
      updateUser(data)
      toast.success('Аватар обновлён')
    } catch (error) {
      toast.error('Ошибка загрузки аватара')
      setAvatarPreview(user?.avatar)
    }
  }

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      const updatedUser = await userService.updateUser(user.id, data)
      updateUser(updatedUser)
      toast.success('Профиль обновлён')
      navigate(`/profile/${user.id}`)
    } catch (error) {
      toast.error('Ошибка обновления профиля')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-h2 mb-6">Редактирование профиля</h1>
      
      <div className="card">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-6">
          <Avatar src={avatarPreview} alt={user?.username} size="xl" />
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleAvatarChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="mt-3 text-primary-pink hover:underline text-sm"
          >
            <i className="fas fa-camera mr-2"></i>
            Изменить фото
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Имя пользователя"
            {...register('username', {
              required: 'Имя пользователя обязательно',
              minLength: {
                value: 3,
                message: 'Минимум 3 символа',
              },
            })}
            error={errors.username?.message}
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Имя"
              {...register('first_name')}
            />
            <Input
              label="Фамилия"
              {...register('last_name')}
            />
          </div>
          
          <TextArea
            label="О себе"
            {...register('bio', {
              maxLength: {
                value: 500,
                message: 'Максимум 500 символов',
              },
            })}
            error={errors.bio?.message}
            rows={4}
          />
          
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
              Сохранить
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
