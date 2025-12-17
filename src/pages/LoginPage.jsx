import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { useAuth } from '../hooks/useAuth'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await login(data.email, data.password)
      toast.success('Добро пожаловать!')
      navigate('/')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка входа')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h2 className="text-h3 text-center mb-6">Вход</h2>
      
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
          label="Пароль"
          type="password"
          {...register('password', {
            required: 'Пароль обязателен',
          })}
          error={errors.password?.message}
          placeholder="••••••••"
        />
        
        <Button
          type="submit"
          variant="filled"
          isLoading={isLoading}
          className="w-full mt-4"
        >
          Войти
        </Button>
      </form>
      
      <p className="text-center mt-6 text-body2 text-text-secondary">
        Нет аккаунта?{' '}
        <Link to="/register" className="text-primary-pink hover:underline">
          Зарегистрироваться
        </Link>
      </p>
    </div>
  )
}
