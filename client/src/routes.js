import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'
import AuthPage from './pages/AuthPage'
import CreatePage from './pages/CreatePage'
import Profile from './pages/Profile'

export const useRoutes = (isAuthenticated) => {
  if(isAuthenticated) {
    return (
      <Routes>
        <Route path='/profile' element={<Profile/>} />
        <Route path='/create' element={<CreatePage/>} />
        <Route path='*' element={<Navigate to='/profile' replace />} />
      </Routes>
    )
  }

  return (
    <Routes>
      <Route path='/' element={<AuthPage/>} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  )

}
