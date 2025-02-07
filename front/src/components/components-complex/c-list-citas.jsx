// React
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

// Servicios
import { getCitas } from "../../services/services-api";
import { handleCommon } from "../../services/handler-response";

// Componentes
import LblPrimary from "../components-simple/Lbl-primary";

//Utils 
import { formatedDate } from "../../utils/u-citas";


const CListCitas = () => {

  // Estados
  const [citas, setCitas] = useState([]);

  //Filtro
  const [input, setInput] = useState({
    from: "",
    to: ""
  });

  // Referencias
  const inpFromRef = useRef();
  const inpToRef = useRef();



  /**
   * @fecha 2025-02-05
   * @autor Omar Echavarria
   * @descripcion Este efecto se ejecuta cuando el componente se monta. Su función principal es verificar si existe un valor 
   * en la variable `input`. Si `input` tiene un valor, realiza una llamada a la función `getCitas` con el valor de `input` como 
   * parámetro. Luego, maneja la respuesta de la API. Si la llamada es exitosa, se establece el estado `citas` con los datos 
   * obtenidos de la respuesta utilizando la función `setCitas`. Si hay algún error, se maneja con la función `handleCommon`.
   * 
   * @param {void} - No recibe parámetros.
   * @returns {void} - No retorna ningún valor.
   */
  useEffect(() => {
    if (input) {
      getCitas(input)
        .then(r => r.json())
        .then(d => {
          handleCommon(d, () => setCitas(d.data))
        })
    }
  }, []);



  /**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función se encarga de manejar los cambios en los campos de fecha dentro del formulario. Al cambiar un valor 
 * en el campo de fecha (ya sea "from" o "to"), la función actualiza el estado de `input` con el nuevo valor. Si el campo modificado 
 * es "from" y la fecha es mayor que la fecha en "to", se limpia el valor de "to". Si el campo modificado es "to" y la fecha es menor 
 * que la fecha en "from", se limpia el valor de "from". Los cambios se gestionan dentro del objeto `copyInput`, que luego es 
 * actualizado usando `setInput`.
 * 
 * @param {Object} e - El objeto del evento generado al cambiar el valor de un campo de fecha en el formulario.
 * @returns {void} - No retorna ningún valor.
 */
  const changeDate = (e) => {
    const copyInput = { ...input };
    const date = new Date(e.target.value);

    copyInput[e.target.name] = e.target.value;
    if (e.target.name == "from" && copyInput.to) {
      if (date > new Date(copyInput.to)) {
        inpToRef.current.value = "";
        copyInput.to = "";
      }
    } else if (e.target.name == "to" && copyInput.from) {
      if (date < new Date(copyInput.from)) {
        inpFromRef.current.value = "";
        copyInput.from = "";
      }

    }
    setInput(copyInput);
  }


  /**
   * @fecha 2025-02-05
   * @autor Omar Echavarria
   * @descripcion Esta función se encarga de enviar los datos de los filtros (almacenados en el estado `input`) a la API 
   * para obtener las citas filtradas. Una vez recibida la respuesta, se actualiza el estado `citas` con los datos de las citas 
   * filtradas utilizando la función `setCitas`. Si la respuesta es exitosa, se maneja con la función `handleCommon`.
   * 
   * @returns {void} - No retorna ningún valor.
   */
  const submitFilter = () => {
    getCitas(input)
      .then(r => r.json())
      .then(d => {
        handleCommon(d,
          () => {
            setCitas(d.data)
          }
        )
      });
  }

  return (
    <div>
      <section className="border mx-5 flex flex-col min-h-[500px] max-h-[400px] overflow-y-scroll shadow-md rounded-md">
        <div className="rounded-t-sm flex justify-center bg-gray-300 ">
          <div className="flex gap-y-2 pb-2 items-end gap-x-5">
            <div className="flex gap-x-5" >
              <div className="flex flex-col">
                <LblPrimary value="Desde" />
                <input onChange={changeDate} name="from" ref={inpFromRef} className="rounded" type="date" />
              </div>
              <div className="flex flex-col">
                <LblPrimary value="Hasta" />
                <input onChange={changeDate} name="to" ref={inpToRef} className="rounded" type="date" />
              </div>
            </div>
            <button onClick={submitFilter} type="button" className="border px-1 rounded bg-slate-200 hover:bg-slate-100 duration-150">
              Buscar
            </button>
          </div>
        </div>
        <section className="m-4 flex-1">
          <div className=" ">
            <div className="flex flex-row justify-center w-full  ">
              <table className="w-full" >
                <thead>
                  <tr className="border-b bg-slate-100">
                    <th >
                      <div className="px-4 text-left" >Op</div> 
                    </th>
                    <th >
                      <div className="px-4 text-left">Descripcion</div>
                    </th>
                    <th >
                      <div className="px-4 text-left">Proveedor</div>
                    </th>
                    <th >
                      <div className="px-4 text-left">Guia</div>
                    </th>
                    <th >
                      <div className="px-4 text-left">Fecha</div>
                    </th>
                    <th >
                      <div className="px-4 text-left">Minutos</div>
                    </th>
                    <th >
                      <div className="px-4 text-left">Estado</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="border border-slate-300" >
                  {
                    citas.length > 0 && citas.map((e) =>
                      <tr key={e.id} className="hover:bg-slate-100 border-b ">
                        <td className="w-36" >
                          <Link to={`/${e.id}`} >
                            <div
                              className="sm:px-4 px-2 text-xs sm:text-base truncate left-0 top-0 max-w-[100%] cursor-pointer hover:text-red-600"
                            >
                              {e.op}
                            </div>
                          </Link>
                        </td>
                        <td className="w-52">
                          <div className="sm:px-4 px-2 text-xs sm:text-base truncate left-0 top-0 max-w-[100%] ">{e.op_descripcion}</div>
                        </td>
                        <td className="relative">
                          <div className="sm:px-4 px-2 text-xs sm:text-base truncate absolute left-0 top-0 max-w-[100%] ">{e.proveedor}</div>
                        </td>
                        <td className="relative ">
                          <div className="sm:px-4 px-2 text-xs sm:text-base truncate absolute left-0 top-0 max-w-[100%] ">{e.guia}</div>
                        </td>
                        <td className="relative w-56">
                          <div className="sm:px-4 px-2 text-xs sm:text-base truncate absolute left-0 top-0 max-w-[100%] ">{formatedDate(e.fecha_inicio)}</div>
                        </td>
                        <td className="relative w-32">
                          <div className="sm:px-4 px-2 text-xs sm:text-base truncate absolute left-0 top-0 max-w-[100%] ">{e.minutos}</div>
                        </td>
                        <td className="relative w-32">
                          <div className="sm:px-4 px-2 text-xs sm:text-base truncate absolute left-0 top-0 max-w-[100%] ">{e.estado == 1 ? "Agendada" : "Cancelada"}</div>
                        </td>
                      </tr>
                    )
                  }
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </section>
    </div>
  )
}

export default CListCitas;