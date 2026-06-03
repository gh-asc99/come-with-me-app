import React from 'react'
import logoCwm from '../../assets/logo_CWM_largo.png'
import { Link } from 'react-router-dom'

const Logo = () => {
  return (
    <Link to='/' className="flex items-center">
      <img src={logoCwm} alt='Come With Me' className="h-10 object-contain"/>
    </Link>
  )
}

export default Logo
