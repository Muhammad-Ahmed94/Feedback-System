import { Route, Routes } from 'react-router-dom'
import Homepage from './pages/Homepage'
import SignupPage from './pages/SignupPage'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import { Toaster } from 'react-hot-toast'
import useUserStore from './stores/useUserStore'
import { useEffect } from 'react'
import Feedbackpage from './pages/Feedbackpage'


const App = () => {
  const { user, checkingAuth, checkAuth} = useUserStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (checkingAuth) {
  return (
    <div className="min-h-screen bg-bg-primary flex items-center justify-center">
      <div className="text-font-main text-xl">Loading...</div>
    </div>
  )
 }

  return (
    <div className="p-4 min-h-screen overflow-hidden">
      <Navbar />
      <Routes>
        <Route path='/' element={<Homepage />} />

        <Route path='/signup' element={!user ? <SignupPage /> : <Feedbackpage />} />

        <Route path='/login' element={!user ? <LoginPage /> : <Feedbackpage />} />

      </Routes>
      <Toaster />
    </div>
  )
}

export default App