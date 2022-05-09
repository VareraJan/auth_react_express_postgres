import { useCallback, useState } from "react"


export const useHttp = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const request = useCallback( async (url, method = 'GET', body = null, headers = {}) => {

    setLoading(true)
    try {
      if(body) {
        body = JSON.stringify(body)
        headers['Content-Type'] = 'application/json'
      }
      headers.Authorization = `Bearer ${JSON.parse(localStorage.getItem(process.env.REACT_APP_STORAGE_NAME))?.token}`
      const response = await fetch(url, { method, body, headers, credentials: 'include' })
     
      if (response.status === 401) {
         const response = await fetch(`${process.env.REACT_APP_HOST}/api/auth/refresh`, {credentials: 'include'})
        if (response.status === 401) {
          console.log('НЕТ АВТОРИЗАЦИИ')
          return 
        }
        const data = await response.json()

        const storageName = process.env.REACT_APP_STORAGE_NAME
        localStorage.setItem(storageName, JSON.stringify({
          userId: data.user.id, token: data.accessToken, user: data.user
        }))



        setLoading(false)
        return data
      }
     
      const data = await response.json()

      if(!response.ok) {
        throw new Error(data.message || 'Что-то пошло не так')
      }

      setLoading(false)

      return data

    } catch (error) {
      setError(error.message)
      setLoading(false)
      throw error
    }
  }, [])

  const clearError = useCallback(() => setError(null), [])

  return { loading, request, error, clearError }
}
