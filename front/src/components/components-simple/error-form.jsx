/**
 * @fecha 2025-02-03
 * @autor Omar Echavarria
 * @descripcion Este componente es utilizado para mostrar mensajes de error en un formulario. 
 * Recibe como propiedad un valor de texto (`value`) que representa el mensaje de error que se desea mostrar al usuario. 
 * El mensaje de error se presenta con un estilo de texto rojo y tamaño pequeño, para destacarlo de manera visual 
 * y notificar al usuario sobre el problema.
 * 
 * @param {string} value - El mensaje de error que se desea mostrar.
 * 
 * @returns {JSX.Element} - Retorna un párrafo con el mensaje de error estilizado en color rojo.
 */
const ErrorForm=({value})=>{
  return(
    <p className="text-red-600 text-xs">{value}</p>
  )
}

export default ErrorForm;
