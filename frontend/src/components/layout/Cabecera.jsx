import React from 'react'
import Logo from '../ui/Logo.jsx'
import Menu from '../navigation/Menu.jsx'
import MenuUsuario from '../navigation/MenuUsuario.jsx'
import ContenedorPrincipal from './ContenedorPrincipal.jsx'

const Cabecera = () => {
  return (
    <header className="fixed top-0 w-full h-16 bg-sky-500 z-50">
      {/* El ContenedorPrincipal ahora es el que maneja la distribución.
          Añadimos 'h-full' para que ocupe los 64px (h-16) del header 
          y 'flex items-center justify-between' para separar el logo del menú.
      */}
      <ContenedorPrincipal className="flex items-center justify-between h-full">
        
        <Logo />

        <div className="flex items-center gap-6">
          <Menu />
          <MenuUsuario />
        </div>

      </ContenedorPrincipal>
    </header>
  )
}

export default Cabecera