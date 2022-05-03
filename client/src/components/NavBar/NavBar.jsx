import React, { useContext } from 'react'
import style from './NavBar.module.css'
import { Link, useNavigate } from 'react-router-dom'
import { AuthContext } from '../../context/AuthContext'

function NavBar() {
  const auth = useContext(AuthContext)
  const navigate = useNavigate()


  const logoutHandler = (event) => {
    event.preventDefault()
    auth.logout()
    navigate('/')
  }

  return (
    <nav>
    <div class="nav-wrapper blue darken-1" style={{ padding: '0 2rem' }}>
      <span class="brand-logo">Название проекта или лого</span>
      <ul id="nav-mobile" class="right hide-on-med-and-down">
        <li><Link to="/create">Создать</Link></li>
        <li><Link to="/links">Ссылки</Link></li>
        <li><a href="/" onClick={logoutHandler}>Выйти</a></li>
      </ul>
    </div>
  </nav>
  )
}

export default NavBar;
