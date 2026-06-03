// src/hooks/usePlantillas.js
import { useContext } from "react";
import { ContextoPlantillas } from "../context/ProveedorPlantillas.jsx";

const usePlantillas = () => {
  return useContext(ContextoPlantillas);
};

export default usePlantillas;