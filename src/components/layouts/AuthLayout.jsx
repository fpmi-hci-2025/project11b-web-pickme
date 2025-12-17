import { Outlet } from 'react-router-dom'

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-background-light flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-h1 text-primary-pink mb-2">PickMe</h1>
          <p className="text-body2 text-text-secondary">
            Социальная сеть с гибкой приватностью
          </p>
        </div>
        <div className="card">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
