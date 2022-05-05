import React, { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../context/AuthContext'
import {useHttp} from '../hooks/http.hook'

function Profile() {
  const auth = useContext(AuthContext)
  const {request} = useHttp()
  const [user, setUser] = useState({})

  useEffect(() => {
    // const getUser = async () => {
    //   try {
    //     const data = await request(`${process.env.REACT_APP_HOST}/api/user`, 'GET', null, { Authorization: `Bearer ${auth.token}` })
    //     setUser(data)
    //   } catch (error) {}
    // }
    // getUser()
    try {
      const data = request(`${process.env.REACT_APP_HOST}/api/user`, 'GET', null, { Authorization: `Bearer ${auth.token}` })
        setUser(data)
    } catch (error) { }

  }, [])

  return (
    <div className="row" style={{marginTop: '2em'}}>
    <div className="col s12 m5">
      <div className="card-panel blue darken-1">
        <h4 className='white-text '>Личный кабинет</h4>
        <div className="white-text">
          Email: {user.email}
        </div>
        <div className="white-text">
          Создан: {user.createdAt}
        </div>
      </div>
    </div>
  </div>
  )
}

export default Profile
