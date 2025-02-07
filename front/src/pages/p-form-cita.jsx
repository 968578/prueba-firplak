// Componentes
import CFormCita from "../components/components-complex/c-form-cita";
import PageBase from "./p-base";

/**
 * @fecha 2025-05-02
 * @autor Omar Echavarria
 * @descripcion Este componente representa una página que contiene un formulario para cargar imágenes. 
 * Utiliza el componente `PageBase` para envolver el contenido de la página, lo que incluye la barra de navegación 
 * y el formulario de carga de imágenes proporcionado por el componente `CFormCita`.
 * 
 * @returns {JSX.Element} - Retorna una página estructurada con la barra de navegación y el formulario de imagen.
 */
const PageFormCita = () => {
  return (
      <PageBase>
        <CFormCita />
      </PageBase>
  )
}

export default PageFormCita;