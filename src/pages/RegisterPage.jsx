import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const { register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm()

  const password = watch('password')

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await registerUser({
        email: data.email,
        username: data.username,
        password: data.password,
        password_confirm: data.password_confirm,
        first_name: data.first_name || '',
        last_name: data.last_name || '',
      })
      toast.success('Регистрация успешна!')
      navigate('/')
    } catch (error) {
      const errorData = error.response?.data
      if (errorData) {
        Object.keys(errorData).forEach(key => {
          toast.error(`${key}: ${errorData[key]}`)
        })
      } else {
        toast.error('Ошибка регистрации')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-h3 text-center mb-6">Регистрация</h2>
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <Input
          label="Email"
          type="email"
          {...register('email', {
            required: 'Email обязателен',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Неверный формат email',
            },
          })}
          error={errors.email?.message}
          placeholder="your@email.com"
        />
        
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
          placeholder="username"
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Имя"
            {...register('first_name')}
            placeholder="Имя"
          />
          <Input
            label="Фамилия"
            {...register('last_name')}
            placeholder="Фамилия"
          />
        </div>
        
        <Input
          label="Пароль"
          type="password"
          {...register('password', {
            required: 'Пароль обязателен',
            minLength: {
              value: 8,
              message: 'Минимум 8 символов',
            },
          })}
          error={errors.password?.message}
          placeholder="••••••••"
        />
        
        <Input
          label="Подтверждение пароля"
          type="password"
          {...register('password_confirm', {
            required: 'Подтвердите пароль',
            validate: value => value === password || 'Пароли не совпадают',
          })}
          error={errors.password_confirm?.message}
          placeholder="••••••••"
        />
        
        <Button
          type="submit"
          variant="filled"
          isLoading={isLoading}
          className="w-full mt-4"
        >
          Зарегистрироваться
        </Button>
      </form>
      
      <p className="text-center mt-6 text-body2 text-text-secondary">
        Уже есть аккаунт?{' '}
        <Link to="/login" className="text-primary-pink hover:underline">
          Войти
        </Link>
      </p>
    </div>
  )
}
