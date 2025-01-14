import React, { useEffect } from 'react'
import Navbar from './components/Navbar'
import { Navigate, Route, Routes } from 'react-router-dom'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import { authStore } from './store/authStore'
import { Loader } from 'lucide-react'
import LoginPage from './pages/LoginPage'
import UpdateProfilePage from './pages/UpdateProfilePage'
import SettingsPage from './pages/SettingsPage'
import { Toaster } from 'react-hot-toast'
import { themeStore } from './store/themeStore'

function App() {
  const {user, checkUser, isLoggingin} = authStore();

  const {theme} = themeStore();

  useEffect(() => {
    console.log('app initialized')
    checkUser();
  },[]);

  if (isLoggingin && !user){
    return <>
      <div className='flex h-screen items-center justify-center'>
        <Loader className='animate-spin size-10'>Loading</Loader>
      </div>
    </>
  }

  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
        <Route path='/' element={ user ? <HomePage/>: <Navigate to={'/login'} />}/>
        <Route path='/signup' element={ !user ? <SignUpPage/> : <Navigate to={'/'} />}/>
        <Route path='/login' element={ !user ? <LoginPage/> : <Navigate to={'/'} />}/>
        <Route path='/update-profile' element={user ? <UpdateProfilePage/>: <Navigate to={'/login'}/> }/>
        <Route path='/settings' element={user ? <SettingsPage/>: <Navigate to={'/login'}/> }/>
      </Routes>
      <Toaster/>
    </div>
  )

}

export default App