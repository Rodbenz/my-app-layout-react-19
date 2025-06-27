import './App.css'
import { Outlet } from 'react-router-dom'
import { SplashScreenProvider } from './auth/core/SplashScreen'
import { useLayout } from './layout/core/LayoutProvider';
import LoadingScreen from './layout/LoadingScreen';

function App() {
  const { isLoadingScreen } = useLayout();

  return (
    <SplashScreenProvider>
       {isLoadingScreen && <LoadingScreen loading={isLoadingScreen} />}
      <Outlet />
    </SplashScreenProvider>
  )
}

export default App
