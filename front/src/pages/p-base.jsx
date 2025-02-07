// Componentes
import { useState } from "react";
import CNavigation from "../components/components-complex/c-navigation";
import { ToastComponent, ToastContext } from "../components/components-simple/toast/c-toast";


/**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Este componente es la estructura base de la página. Proporciona el contexto para manejar alertas 
 * (usando `ToastContext`) y encapsula el contenido principal de la página. También renderiza un componente de navegación 
 * (`CNavigation`) y el contenido dinámico pasado como `children`. Las alertas se gestionan a través de un estado 
 * (`alertOperation`) y se muestran mediante el componente `ToastComponent`. 
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {ReactNode} props.children - Contenido dinámico que se pasa como hijo del componente. Este contenido se 
 * renderiza dentro de una sección secundaria en la estructura de la página.
 * 
 * @returns {JSX.Element} - El componente renderizado, que incluye un `ToastContext.Provider`, el componente de navegación 
 * y el contenido proporcionado a través de `children`.
 */
const PageBase = ({ children }) => {

  const [alertOperation, setAlertOperation] = useState({
    msj: "",
    show: false
  });  

  return (
    <ToastContext.Provider value={{ alertOperation, setAlertOperation }}>
      <ToastComponent />
      <main >
        <section >
          <CNavigation />
        </section>
        <section>
          {children}
        </section>
      </main>
    </ToastContext.Provider>
  )
}

export default PageBase;