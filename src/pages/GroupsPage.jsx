import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { groupService } from '../services/groups'
import GroupCard from '../components/groups/GroupCard'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Modal from '../components/common/Modal'
import toast from 'react-hot-toast'

export default function GroupsPage() {
  const [groups, setGroups] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  
  const { register, handleSubmit, reset, formState: { errors } } = useForm()

  useEffect(() => {
    loadGroups()
  }, [])

  const loadGroups = async () => {
    try {
      const data = await groupService.getGroups()
      setGroups(data.results || [])
    } catch (error) {
      toast.error('Ошибка загрузки групп')
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (data) => {
    setIsCreating(true)
    try {
      const newGroup = await groupService.createGroup(data.name)
      setGroups(prev => [...prev, newGroup])
      setShowModal(false)
      reset()
      toast.success('Группа создана')
    } catch (error) {
      toast.error(error.response?.data?.name?.[0] || 'Ошибка создания группы')
    } finally {
      setIsCreating(false)
    }
  }

  const handleDelete = async (groupId) => {
    if (!window.confirm('Удалить эту группу?')) return
    
    try {
      await groupService.deleteGroup(groupId)
      setGroups(prev => prev.filter(g => g.id !== groupId))
      toast.success('Группа удалена')
    } catch (error) {
      toast.error('Ошибка удаления группы')
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-pink border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-h2">Мои группы</h1>
        <Button variant="filled" onClick={() => setShowModal(true)}>
          <i className="fas fa-plus mr-2"></i>
          Создать группу
        </Button>
      </div>
      
      {groups.length === 0 ? (
        <div className="card text-center py-8">
          <i className="fas fa-users text-4xl text-text-secondary mb-4"></i>
          <p className="text-text-secondary mb-4">У вас пока нет групп</p>
          <p className="text-body2 text-text-secondary">
            Создайте группы для управления приватностью ваших постов
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {groups.map(group => (
            <GroupCard
              key={group.id}
              group={group}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
      
      {/* Create Group Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Новая группа"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <Input
            label="Название группы"
            {...register('name', {
              required: 'Введите название',
              minLength: {
                value: 2,
                message: 'Минимум 2 символа',
              },
            })}
            error={errors.name?.message}
            placeholder="Например: Семья, Друзья, Работа"
          />
          
          <div className="flex gap-4 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
              className="flex-1"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              variant="filled"
              isLoading={isCreating}
              className="flex-1"
            >
              Создать
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
