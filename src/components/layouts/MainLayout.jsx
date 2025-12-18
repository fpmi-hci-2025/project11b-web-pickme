import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function MainLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/', icon: 'fa-home', label: 'Лента' },
    { to: '/search', icon: 'fa-search', label: 'Поиск' },
    { to: '/create', icon: 'fa-plus-circle', label: 'Создать' },
    { to: '/groups', icon: 'fa-users', label: 'Группы' },
    { to: `/profile/${user?.id}`, icon: 'fa-user', label: 'Профиль' },
  ]

  return (
    <div className="min-h-screen bg-background-light">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-64 bg-white border-r border-primary-soft/30 flex-col">
        <div className="p-6">
          <h1 className="text-h3 text-primary-pink font-bold">PickMe</h1>
        </div>
        
        <nav className="flex-1 px-4">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors ${
                  isActive
                    ? 'bg-primary-pink text-white'
                    : 'text-text-primary hover:bg-background-light'
                }`
              }
            >
              <i className={`fas ${item.icon} w-5`}></i>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        
        <div className="p-4 border-t border-primary-soft/30">
          <div className="flex items-center gap-3 mb-4">
            <img
              src={user?.avatar || '/default-avatar.svg'}
              alt={user?.username}
              className="w-10 h-10 avatar"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{user?.username}</p>
              <p className="text-xs text-text-secondary truncate">{user?.email}</p>
            </div>
          </div>
          {user?.is_superuser && (
            <a
              href={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000'}/admin/`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full btn btn-primary text-sm mb-2 inline-flex items-center justify-center"
            >
              <i className="fas fa-cog mr-2"></i>
              Перейти в админ-панель
            </a>
          )}
          <button
            onClick={handleLogout}
            className="w-full btn btn-outline text-sm"
          >
            <i className="fas fa-sign-out-alt mr-2"></i>
            Выйти
          </button>
        </div>
      </aside>
      
      {/* Main Content */}
      <main className="md:ml-64 pb-20 md:pb-6">
        <div className="max-w-2xl mx-auto p-4">
          <Outlet />
        </div>
      </main>
      
      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-primary-soft/30 z-50">
        <div className="flex justify-around py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center py-2 px-3 xs:px-2 ${
                  isActive ? 'text-primary-pink' : 'text-text-secondary'
                }`
              }
            >
              <i className={`fas ${item.icon} text-xl xs:text-lg`}></i>
              <span className="text-xs mt-1 xs:hidden">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </div>
  )
}
