import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { groupService } from '../services/groups'
import { userService } from '../services/users'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Avatar from '../components/common/Avatar'
import Modal from '../components/common/Modal'
import toast from 'react-hot-toast'

export default function GroupDetailPage() {
  const { groupId } = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)
  const [members, setMembers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm()

  useEffect(() => {
    loadGroupData()
  }, [groupId])

  const loadGroupData = async () => {
    try {
      const [groupData, membersData] = await Promise.all([
        groupService.getGroup(groupId),
        groupService.getGroupMembers(groupId),
      ])
      setGroup(groupData)
      setMembers(membersData)
      setValue('name', groupData.name)
    } catch (error) {
      toast.error('Ошибка загрузки группы')
      navigate('/groups')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSearch = async () => {
    if (searchQuery.length < 2) return
    
    setIsSearching(true)
    try {
      const results = await userService.searchUsers(searchQuery)
      // Filter out existing members
      const memberIds = members.map(m => m.id)
      setSearchResults(results.filter(u => !memberIds.includes(u.id)))
    } catch (error) {
      toast.error('Ошибка поиска')
    } finally {
      setIsSearching(false)
    }
  }

  const handleAddMember = async (userId) => {
    try {
      await groupService.addMember(groupId, userId)
      await loadGroupData()
      setSearchResults(prev => prev.filter(u => u.id !== userId))
      toast.success('Пользователь добавлен')
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Ошибка добавления')
    }
  }

  const handleRemoveMember = async (userId) => {
    if (!window.confirm('Удалить участника из группы?')) return
    
    try {
      await groupService.removeMember(groupId, userId)
      setMembers(prev => prev.filter(m => m.id !== userId))
      toast.success('Участник удалён')
    } catch (error) {
      toast.error('Ошибка удаления')
    }
  }

  const onSubmitName = async (data) => {
    try {
      await groupService.updateGroup(groupId, data.name)
      setGroup(prev => ({ ...prev, name: data.name }))
      setIsEditing(false)
      toast.success('Название обновлено')
    } catch (error) {
      toast.error(error.response?.data?.name?.[0] || 'Ошибка обновления')
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
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate('/groups')}
          className="text-text-secondary hover:text-text-primary"
        >
          <i className="fas fa-arrow-left text-xl"></i>
        </button>
        
        {isEditing ? (
          <form onSubmit={handleSubmit(onSubmitName)} className="flex-1 flex gap-2">
            <Input
              {...register('name', { required: true })}
              className="mb-0"
            />
            <Button type="submit" variant="filled" size="sm">
              <i className="fas fa-check"></i>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              <i className="fas fa-times"></i>
            </Button>
          </form>
        ) : (
          <>
            <h1 className="text-h3 flex-1">{group?.name}</h1>
            <button
              onClick={() => setIsEditing(true)}
              className="text-text-secondary hover:text-primary-pink"
            >
              <i className="fas fa-edit"></i>
            </button>
          </>
        )}
      </div>
      
      {/* Members */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-h4">Участники ({members.length})</h2>
          <Button variant="outline" size="sm" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-user-plus mr-2"></i>
            Добавить
          </Button>
        </div>
        
        {members.length === 0 ? (
          <p className="text-text-secondary text-center py-4">
            В группе пока нет участников
          </p>
        ) : (
          <div className="space-y-3">
            {members.map(member => (
              <div
                key={member.id}
                className="flex items-center justify-between p-3 bg-background-light rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={member.avatar} alt={member.username} size="sm" />
                  <div>
                    <p className="font-medium">
                      {member.first_name} {member.last_name}
                    </p>
                    <p className="text-body2 text-text-secondary">
                      @{member.username}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  className="text-red-400 hover:text-red-500 p-2"
                >
                  <i className="fas fa-user-minus"></i>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Add Member Modal */}
      <Modal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false)
          setSearchQuery('')
          setSearchResults([])
        }}
        title="Добавить участника"
      >
        <div className="flex gap-2 mb-4">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Поиск по имени или нику"
            className="mb-0 flex-1"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button
            variant="filled"
            onClick={handleSearch}
            disabled={isSearching || searchQuery.length < 2}
          >
            {isSearching ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-search"></i>
            )}
          </Button>
        </div>
        
        {searchResults.length > 0 ? (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {searchResults.map(user => (
              <div
                key={user.id}
                className="flex items-center justify-between p-3 bg-background-light rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <Avatar src={user.avatar} alt={user.username} size="sm" />
                  <div>
                    <p className="font-medium">
                      {user.first_name} {user.last_name}
                    </p>
                    <p className="text-body2 text-text-secondary">
                      @{user.username}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddMember(user.id)}
                >
                  Добавить
                </Button>
              </div>
            ))}
          </div>
        ) : searchQuery.length >= 2 && !isSearching ? (
          <p className="text-text-secondary text-center py-4">
            Пользователи не найдены
          </p>
        ) : null}
      </Modal>
    </div>
  )
}
