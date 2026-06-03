import { useContext } from 'react';
import { ContextoFormulario } from '../context/ProveedorFormulario.jsx';

const useFormulario = () => {
  return useContext(ContextoFormulario);
};

export default useFormulario;