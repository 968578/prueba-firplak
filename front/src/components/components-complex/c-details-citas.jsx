// React
import { useContext, useEffect,  useState } from "react";
import {  useParams } from "react-router-dom";

// Componentes
import BtnPrimary from "../components-simple/btn-primary";
import LblPrimary from "../components-simple/Lbl-primary";

// Servicios
import {  cancelarCita,  getCitaById } from "../../services/services-api";
import { handleCommon } from "../../services/handler-response";

//utils
import {  formatedDate } from "../../utils/u-citas";
import 'ldrs/dotSpinner'

// context
import { ToastContext } from "../components-simple/toast/c-toast";



const CDetailsCita = () => {

  // Estados locales
  const [cita, setCita] = useState(null);
  const [recargarData, setRecargarData] = useState(false);
  const [loading, setLoading] = useState(false);
  const params = useParams();

  // contexto (estado global)
  const {
    setAlertOperation
  } = useContext(ToastContext)

  /**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Este efecto se ejecuta cuando el componente se monta o cuando cambia el estado `recargarData`. Su función 
 * principal es verificar si existe un parámetro `id` en la URL, que corresponde a la cita que se desea obtener. Si el `id` 
 * está presente, se realiza una solicitud a la API para obtener los detalles de la cita utilizando la función `getCitaById`. 
 * Cuando la respuesta es recibida, se actualiza el estado `cita` con los datos obtenidos de la API.
 * @param {void} - No recibe parámetros.
 * @returns {void} - No retorna ningún valor.
 */
  useEffect(() => {
    if (params?.id) {
      getCitaById(params.id)
        .then(r => r.json())
        .then(d => {
          handleCommon(d,
            () => setCita(d.data)
          )
        });
    }
  }, [recargarData]);

  /**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función se ejecuta cuando una cita se cancela correctamente. Su principal función es mostrar una alerta 
 * con el mensaje "Cancelada" en la interfaz de usuario. La alerta se oculta automáticamente después de 8 segundos. 
 * También se actualiza el estado `recargarData` para recargar la información en el componente, y se establece el estado 
 * `loading` a `false` para indicar que la operación ha terminado.
 * 
 * @param {void} - No recibe parámetros.
 * @returns {void} - No retorna ningún valor.
 */
  const canceladaOk = () => {
    setAlertOperation({
      msj: "Cancelada",
      show: true,
    });

    setTimeout(() => {
      setAlertOperation({
        msj: "Cancelada",
        show: false,
      })
    }, 8000);

    setRecargarData(!recargarData);
    setLoading(false);
  }

  /**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función se ejecuta cuando el usuario intenta cancelar una cita. Inicialmente, establece el estado `loading`
 * a `true` para indicar que la operación está en progreso. Luego, se llama a la función `cancelarCita` con el ID de la cita
 * y, al recibir la respuesta, maneja la respuesta usando la función `handleCommon`. Si la cancelación es exitosa, se ejecuta
 * `canceladaOk`, mostrando una alerta con el mensaje de éxito. Si ocurre un error, se muestra una alerta de fallo y se establece
 * el estado `loading` a `false` para indicar que la operación ha finalizado.
 * 
 * @param {void} - No recibe parámetros.
 * @returns {void} - No retorna ningún valor.
 */
  const clickCancelarCita = () => {
    setLoading(true)
    cancelarCita(params.id)
      .then(r => r.json())
      .then(d => {
        handleCommon(
          d,
          canceladaOk,
          undefined,
          () => {
            setAlertOperation({
              msj: "Falló al cancelar la cita",
              show: true,
            }); 
            setLoading(false);
          }
        )
      });
  }


  if (loading || !cita) {
    return (
      <section className=" flex items-center justify-center mt-5">
        <div className="w-[750px] h-[380px] shadow-lg border-2 border-slate-500 rounded-md  flex flex-col items-center justify-center py-2">
          <l-dot-spinner
            size="40"
            speed="0.9"
            color="black"
          ></l-dot-spinner>
        </div>
      </section>
    )
  } else {
    return (
      <section className="w-screen flex items-center justify-center mt-5">
        <div className={"w-[750px] shadow-lg border-2 border-slate-500 rounded-md flex flex-col items-center justify-start py-2 " + (cita.estado == 0 ? "bg-red-100" : "")}>
          <div className="">
            <div className="flex items-end justify-end">
              {
                cita.estado == "1" &&
                <div>
                  <BtnPrimary type="buttom" value="Cancelar" typeBol="red" active={true} click={clickCancelarCita} />
                </div>
              }
            </div>
            <div className="grid grid-cols-2 gap-x-5">

              <span>
                <LblPrimary value="Proveedor" />
                <p className="w-full text-sm border-b border-slate-500 border-dashed">{cita.proveedor}</p>
              </span>
              <span>
                <LblPrimary value="Orden de produccion" />
                <p className="w-full text-sm border-b border-slate-500 border-dashed">{cita.op}</p>
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-5">
              <span>
                <LblPrimary value="Guia transportadora" />
                <p className="w-full text-sm border-b border-slate-500 border-dashed">{cita.guia}</p>
              </span>
              <span>
                <LblPrimary value="Tipo entrega" />
                <p className="w-full text-sm border-b border-slate-500 border-dashed">{cita.tipo}</p>
              </span>
            </div>
            <div>
              <LblPrimary value="Observacion" />
              <p className="w-full text-sm border-b border-slate-500 border-dashed">{cita.observacion}</p>
            </div>
            <div className="grid grid-cols-2 mt-5">
              <section className="h-[190px] w-[330px] ">
                <div className="flex justify-start ">
                  <div className="">
                    <p className="font-semibold">Inicio: </p> <p>{formatedDate(cita.fecha_inicio)}</p>
                    <p className="font-semibold">Fin: </p> <p>{formatedDate(cita.fecha_fin)}</p>
                  </div>
                </div>
              </section>
              <section >
                <b>Descripción</b>
                <div >
                  <p>{cita.op_descripcion}</p>
                  <div>
                    <div className="flex gap-x-2">
                      <p className="font-semibold">Total unidades: </p> <p>{cita.op_cantidad}</p>
                    </div>
                    <div className="flex gap-x-2">
                      <p className="font-semibold">Servicio: </p> <p>{cita.servicio_descripcion}</p>
                    </div>
                    <div className="flex gap-x-2">
                      <p className="font-semibold">Tiempo: </p><p>{cita.minutos} minutos</p>
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </section>
    )
  }
}

export default CDetailsCita;
