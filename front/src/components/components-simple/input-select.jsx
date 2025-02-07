import { useState } from "react";

/**
 * @fecha 2025-02-03
 * @autor Omar Echavarria
 * @descripcion Este componente representa un campo de entrada con un selector de opciones. A medida que el usuario escribe 
 * en el campo de texto, las opciones disponibles se filtran según el valor ingresado. Las opciones filtradas se muestran en 
 * una lista desplegable. El usuario puede seleccionar una opción, lo que actualiza el valor seleccionado y cierra la lista de 
 * opciones. Además, el campo de texto puede expandirse al hacer clic, mostrando las primeras 8 opciones disponibles. 
 * 
 * @param {Object} props - Propiedades del componente.
 * @param {Array} props.dataSelect - Array de objetos que contiene las opciones disponibles para el selector.
 * @param {Function} props.clickOption - Función que se llama cuando se selecciona una opción, pasando el objeto de la opción.
 * @param {string} props.value - Valor actual seleccionado en el selector.
 * 
 * @returns {JSX.Element} - El componente renderizado, un campo de entrada con una lista de opciones filtradas.
 */
const InputSelect = ({ dataSelect, clickOption, value }) => {

  const [options, setOptions] = useState([]);
  const [activeOptions, setActiveOption] = useState(false);

  const changeInput = async (e) => {

    const value = e.target.value;
    if (value) {
      setActiveOption(true);

      const optionsFilter = dataSelect.filter(ele => ele.op.toLowerCase().includes(value.toLowerCase()));
      const lengthOptions = Math.min(optionsFilter.length, 8);
      setOptions(optionsFilter.slice(0, lengthOptions));
    } else if (value == "") {
      setOptions(dataSelect);
    }
  }

  const selectOption = (op) => {
    clickOption(op)
    setActiveOption(false);
  }

  const blurInput = () => {
    setActiveOption(false);
  }

  const openOptions = async () => {
    setActiveOption(true);
    setOptions(dataSelect.slice(0, 8));
  }

  return (

    <div className="w-full" >
      <div className="border-b border-gray-700 ">
        <div onClick={openOptions} className="flex justify-between w-full items-endcursor-pointer">
          <p className="truncate" >{dataSelect?.find(e => e.id == value)?.op}</p>
          {
            !activeOptions ?
              <span  >&#x1f783;</span>
              :
              <span  >&#x1f781;</span>
          }
        </div>
      </div>
      <div >
        {
          activeOptions &&
          <div className="absolute p-1 bg-gray-100 max-w-[250px] ">
            <input autoComplete="off" type="text" autoFocus onChange={changeInput} onBlur={blurInput} className="border rounded border-black focus:outline-none w-full" />
            <div className=" mt-[2px]">
              <ul className=" border bg-white shadow max-h-[200px] overflow-auto w-full rounded z-20">
                {
                  options?.length > 0 ? options.map(op =>
                    <li title={op.op} onMouseDown={() => selectOption(op)} className=" truncate w-full cursor-pointer hover:bg-gray-200" key={op.id}>{op.op}</li>
                  )
                    :
                    <li>---</li>
                }
              </ul>
            </div>
          </div>
        }

      </div>
    </div>

  )
}
export default InputSelect;
