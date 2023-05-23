import { Navigate, Outlet, useLocation } from "react-router-dom"
import useAuth from "../hooks/useAuth"

function RequireAuth({requireAdmin}) {
  const {auth} = useAuth()
  const location = useLocation()
  
  return (
      requireAdmin
      ? auth?.isAdmin
        ? <Outlet />
        : <Navigate to="/" state={{from: location}} replace />
      : auth?.accessToken
        ? <Outlet />
        : <Navigate to="/auth" state={{from: location}} replace />
  )
}

export default RequireAuth