/**
 * @fecha 2025-01-12
 * @autor Omar Echavarria
 * @descripcion Este componente es utilizado para mostrar etiquetas (`label`) en formularios u otras interfaces de usuario. 
 * Recibe como propiedad un valor de texto (`value`) que será mostrado como el contenido de la etiqueta.
 * El componente simplemente renderiza el texto proporcionado como una etiqueta HTML.
 * 
 * @param {string} value - El texto que se mostrará dentro de la etiqueta.
 * 
 * @returns {JSX.Element} - Retorna un elemento `<label>` con el texto proporcionado en la propiedad `value`.
 */
const LblPrimary=({value})=>{
  return(
    <label >{value}</label>
  )
}

export default LblPrimary;