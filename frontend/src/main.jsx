import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ProveedorSesion from "./context/ProveedorSesion.jsx";
import ProveedorCreacion from "./context/ProveedorCreacion.jsx";
import ProveedorFormulario from "./context/ProveedorFormulario.jsx";
import ProveedorPlantillas from "./context/ProveedorPlantillas.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <ProveedorSesion>
        <ProveedorPlantillas>
          <ProveedorCreacion>
          <ProveedorFormulario>
            <App />
          </ProveedorFormulario>
        </ProveedorCreacion>
        </ProveedorPlantillas>
      </ProveedorSesion>
    </BrowserRouter>
  </StrictMode>,
);
