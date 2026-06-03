
import { useContext } from "react";
import { ContextoCreacion } from "../context/ProveedorCreacion.jsx";

const useCreacion = () => {
  return useContext(ContextoCreacion);
};

export default useCreacion;