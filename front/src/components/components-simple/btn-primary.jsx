/**
 * @fecha 2025-02-03
 * @autor Omar Echavarria
 * @descripcion Este componente representa un botón de acción primaria con estilo personalizable, 
 * que puede tener dos tipos de diseño: "azul" o "rojo". Dependiendo del valor de `typeBol`, 
 * el botón tendrá un estilo y comportamiento diferente. El botón ejecuta una función proporcionada 
 * a través de la propiedad `click` solo si la propiedad `active` es `true`. Si no está activo, el botón 
 * aparece deshabilitado visualmente. 
 * 
 * @param {string} value - El texto que se mostrará en el botón.
 * @param {string} type - El tipo de botón (por ejemplo, "submit", "button").
 * @param {string} typeBol - Define el tipo de estilo ("blue" para azul, "red" para rojo).
 * @param {function} click - La función que se ejecuta al hacer clic en el botón.
 * @param {boolean} active - Si es `true`, el botón es interactivo; si es `false`, está deshabilitado.
 * 
 * @returns {JSX.Element} - Retorna un botón estilizado según las propiedades proporcionadas.
 */
const BtnPrimary = ({ value, type, typeBol, click, active }) => {

  const clickBtn = () => {
    if (active) {
      click();
    }
  }
  if (typeBol == "blue") {
    return (
      <button onClick={clickBtn} className={"w-full h-full p-1 rounded-sm duration-150" + (active ? " bg-blue-400 text-white" : " border-2 text-slate-600 border-slate-200")} type={type}>
        {value}
      </button>
    )
  } else if (typeBol == "red") {
    return (
      <button onClick={click} className=" w-full h-full border-2 border-slate-400 p-1 rounded-sm text-red-500" type={type}>
        {value}
      </button>
    )
  }
}

export default BtnPrimary;