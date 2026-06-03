import React, { useContext } from "react";
import { ContextoLanguage } from "../context/ProveedorLanguage.jsx";

const useLanguage = () => {
    /**
     
Hook personalizado para consumir el contexto de la sesión de forma segura.
Lanza un error si se intenta usar fuera de su proveedor.*/
const contexto = useContext(ContextoLanguage);

    if (!contexto) {
        throw new Error(
            "El hook useLanguage debe ser utilizado dentro de <LanguageContext.jsx>.",
        );
    }

    return contexto;
};

export default useLanguage;