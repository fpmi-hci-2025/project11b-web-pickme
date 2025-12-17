import { useState } from 'react'
import { Link } from 'react-router-dom'
import { userService } from '../services/users'
import Input from '../components/common/Input'
import Button from '../components/common/Button'
import Avatar from '../components/common/Avatar'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async () => {
    if (query.length < 2) return
    
    setIsLoading(true)
    setHasSearched(true)
    try {
      const data = await userService.searchUsers(query)
      setResults(data)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-h2 mb-6">Поиск пользователей</h1>
      
      <div className="flex gap-2 mb-6">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Введите имя или ник"
          className="mb-0 flex-1"
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        />
        <Button
          variant="filled"
          onClick={handleSearch}
          disabled={isLoading || query.length < 2}
        >
          {isLoading ? (
            <i className="fas fa-spinner fa-spin"></i>
          ) : (
            <>
              <i className="fas fa-search mr-2"></i>
              Найти
            </>
          )}
        </Button>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-pink border-t-transparent"></div>
        </div>
      ) : results.length > 0 ? (
        <div className="space-y-4">
          {results.map(user => (
            <Link
              key={user.id}
              to={`/profile/${user.id}`}
              className="card flex items-center gap-4 hover:border-primary-pink transition-colors"
            >
              <Avatar src={user.avatar} alt={user.username} size="lg" />
              <div>
                <h3 className="text-h5">
                  {user.first_name} {user.last_name}
                </h3>
                <p className="text-body2 text-text-secondary">
                  @{user.username}
                </p>
              </div>
            </Link>
          ))}
        </div>
      ) : hasSearched ? (
        <div className="card text-center py-8">
          <i className="fas fa-user-slash text-4xl text-text-secondary mb-4"></i>
          <p className="text-text-secondary">Пользователи не найдены</p>
        </div>
      ) : (
        <div className="card text-center py-8">
          <i className="fas fa-search text-4xl text-text-secondary mb-4"></i>
          <p className="text-text-secondary">
            Введите имя или ник для поиска
          </p>
        </div>
      )}
    </div>
  )
}
