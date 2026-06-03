import { useContext } from "react";
import { ContextoSesion } from "../context/ProveedorSesion.jsx";

const useSesion = () => {
    const contexto = useContext(ContextoSesion);

    if (!contexto) {
        throw new Error("No se ha usado useSesion dentro de ProveedorSesion.");
    }

    return contexto;
};

export default useSesion;