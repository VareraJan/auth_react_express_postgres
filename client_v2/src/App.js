import React, { useEffect } from 'react'
import { BrowserRouter } from 'react-router-dom';
import { useRoutes } from './routes';
import { useAuth } from './hooks/auth.hook';
import { AuthContext } from './context/AuthContext';
import NavBar from './components/NavBar';
import Loader from './components/Loader';
import 'materialize-css'

function App() {
  const {login, logout, checkAuth, token, userId, ready} = useAuth()
  const isAuthenticated = !!token
  const routes = useRoutes(isAuthenticated)

  useEffect(() => {
    if (localStorage.getItem(process.env.REACT_APP_STORAGE_NAME)) {
      checkAuth()
    }
  }, [])

  if(!ready) {
    return <Loader />
  }


  return (
    <AuthContext.Provider value={{
      login, logout, token, userId, isAuthenticated
    }}>
      <BrowserRouter>
        {isAuthenticated && <NavBar />}
        <div className='container'>
          {routes}
        </div>
      </BrowserRouter>
    </AuthContext.Provider>
  );
}

export default App;
