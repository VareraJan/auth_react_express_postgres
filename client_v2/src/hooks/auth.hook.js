import { useCallback, useEffect, useState } from "react"
import { useHttp } from "./http.hook"


const storageName = process.env.REACT_APP_STORAGE_NAME

export const useAuth = () => {
  const [token, setToken] = useState(null)
  const [ready, setReady] = useState(false)
  const [userId, setUserId] = useState(null)
  const {request} = useHttp()

  const login = useCallback((jwtToken, user) => {

    setToken(jwtToken)
    setUserId(user.id)

    localStorage.setItem(storageName, JSON.stringify({
      userId: user.id, token: jwtToken, user
    }))
  }, [])

  const logout = useCallback(async () => {
    setToken(null)
    setUserId(null)

    await request(`${process.env.REACT_APP_HOST}/api/auth/logout`, 'POST')
    localStorage.removeItem(storageName)
  }, [])

  const checkAuth = async () => {
    const response = await request(`${process.env.REACT_APP_HOST}/api/auth/refresh`)
    login(response.accessToken, response.user)
    
  }

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem(storageName))
    
    if(data && data.token) {
      login(data.token, data.user)
    }
    setReady(true)
  }, [login])
  

  return { login, logout, checkAuth, token, userId, ready }
}
