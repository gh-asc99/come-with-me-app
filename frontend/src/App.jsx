import './App.css'
import Cabecera from './components/layout/Cabecera.jsx'
import Cuerpo from './components/layout/Cuerpo.jsx'
import PiePagina from './components/layout/PiePagina.jsx'
import Rutas from './routes/Rutas.jsx'

function App() {
  return (
    <>
      <Cabecera/>
      <Cuerpo>
        <Rutas/>
      </Cuerpo>
      <PiePagina/>
    </>
  )
}

export default App
