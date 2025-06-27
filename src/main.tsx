import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import AppRoutes from './routing/AppRoutes.tsx'
import { AuthProvider } from './auth/core/AuthContext.tsx'
import { LayoutProvider } from './layout/core/LayoutProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LayoutProvider>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </LayoutProvider>
  </StrictMode>,
)
