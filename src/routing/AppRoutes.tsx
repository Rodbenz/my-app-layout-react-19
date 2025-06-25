
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import App from '../App'
import { AuthPage } from '../auth/AuthPage'
import { ProtectedRoute } from './ProtectedRoute'
import { useAuth } from '../auth/core/AuthContext'
import { Logout } from '../auth/Logout'
import { ErrorsPage } from '../errors/ErrorsPage'

/**
 * Base URL of the website.
 *
 * @see https://facebook.github.io/create-react-app/docs/using-the-public-folder
 */
const { BASE_URL } = import.meta.env

export default function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <BrowserRouter basename={BASE_URL}>
      <Routes>
        <Route element={<App />}>
          <Route path='error/*' element={<ErrorsPage />} />
          <Route path='logout' element={<Logout />} />
          {isAuthenticated ? (
            <>
              <Route path='/*' element={<ProtectedRoute />} />
              <Route index element={<Navigate to='/home' />} />
            </>
          ) : (
            <>
              <Route path='auth/*' element={<AuthPage />} />
              <Route path='*' element={<Navigate to='/auth' />} />
            </>
          )}
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
