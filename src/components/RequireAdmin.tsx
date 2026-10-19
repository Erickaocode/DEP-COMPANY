import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { useAdmin } from '@/hooks/useAdmin'
import UserNotRegisteredError from '@/components/UserNotRegisteredError'

export default function RequireAdmin({ children }: { children: React.ReactNode }) {
  const { loading, session, isAdmin } = useAdmin()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />
  }

  if (!isAdmin) return <UserNotRegisteredError email={session.user.email} />

  return <>{children}</>
}
