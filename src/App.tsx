import './App.css'
import { Outlet } from 'react-router-dom'
import { SplashScreenProvider } from './auth/core/SplashScreen'

function App() {

  return (
    <SplashScreenProvider>
      <Outlet />
    </SplashScreenProvider>
  )
}

export default App
