// React
import { useContext, useEffect, useRef, useState } from "react";

// Componentes
import ErrorForm from "../components-simple/error-form";
import BtnPrimary from "../components-simple/btn-primary";
import LblPrimary from "../components-simple/Lbl-primary";
import InputSelect from "../components-simple/input-select";
import Asterisco from "../components-simple/asterisco";
import 'ldrs/dotSpinner'

// Servicios
import { crearCita, getCitasBookings, getConfigBookings, getOps } from "../../services/services-api";
import { dataServicios } from "../../services/data-servicios";
import { handleCommon } from "../../services/handler-response";

// Librerias
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

//Utils
import { addConfigBookings, compareDates, getAllDateTimes, getAppointmentsToday, getExcludeTimes, getExcludeTimesByAppoinments, getFiltroPorFechaCitas, sumMinutes } from "../../utils/u-citas";
import { ToastContext } from "../components-simple/toast/c-toast";


const CFormCita = () => {

  // Estados
  const intervalTime = 10
  const [configBooking, setConfigBooking] = useState(null);
  const [citasBookings, setCitasBookings] = useState(null);
  const [excludeTimes, setExcludeTimes] = useState(null);
  const [ops, setOps] = useState([]);
  const [diaSeleccionado, setDiaSeleccionado] = useState(null);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [opSeleccionada, setOpSeleccionada] = useState(null);
  const [opLista, setOpLista] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recargarData, setRecargarData] = useState(false);
  const [form, setForm] = useState({
    proveedor: "",
    op: "",
    guia: "",
    tipo: "",
    observacion: "",
    fechaInicio: "",
  });
  const [errorForm, setErrorForm] = useState({
    proveedor: "",
    op: "",
    guia: "",
    tipo: "",
    observacion: "",
    fechaInicio: "",
  });

  const [touchForm, setTouchForm] = useState({
    proveedor: false,
    op: false,
    guia: false,
    tipo: false,
    observacion: false,
    fechaInicio: false,
    fecha_fin: false,
  });

  // Referencias
  const refProveedor = useRef(null);
  const refGuia = useRef(null);
  const refObservacion = useRef(null);

  // contexto
  const {
    setAlertOperation
  } = useContext(ToastContext)


  /**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Este efecto se ejecuta una vez cuando el componente se monta. Su objetivo es obtener los datos de las operaciones
 * disponibles llamando a la función `getOps`. Una vez recibida la respuesta, se maneja con `handleCommon`. Si la respuesta es 
 * exitosa, se actualiza el estado `ops` con los datos obtenidos. Si ocurre algún error en la obtención de los datos, 
 * se maneja de acuerdo a la lógica definida en `handleCommon`.
 * @param {void} - No recibe parámetros.
 * @returns {void} - No retorna ningún valor.
 */
  useEffect(() => {
    getOps()
      .then(r => r.json())
      .then(d => {
        handleCommon(d,
          () => { setOps(d.data) }
        )
      });
  }, []);


  /**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Este efecto se ejecuta cuando el componente se monta o cuando el estado `recargarData` cambia. Su función es obtener
 * la configuración de las citas a través de la función `getConfigBookings`. Una vez que se recibe la respuesta, se maneja con 
 * `handleCommon`. Si la respuesta es exitosa, se actualiza el estado `configBooking` con los datos de la configuración utilizando 
 * la función `addConfigBookings`.
 * 
 * @param {void} - No recibe parámetros.
 * @returns {void} - No retorna ningún valor.
 */
  useEffect(() => {
    getConfigBookings()
      .then(r => r.json())
      .then(d => {
        handleCommon(d, () => addConfigBookings(setConfigBooking, d.data))
      });
  }, [recargarData]);


  /**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Este efecto se ejecuta cada vez que el estado `recargarData` cambia. Su función es obtener las citas
 * de los bookings utilizando la función `getCitasBookings` con las fechas de inicio y fin obtenidas de `getFiltroPorFechaCitas`.
 * Después de recibir la respuesta, se maneja con `handleCommon`. Si la respuesta es exitosa, se actualiza el estado 
 * `citasBookings` con los datos obtenidos.
 * 
 * @param {void} - No recibe parámetros.
 * @returns {void} - No retorna ningún valor.
 */
  useEffect(() => {
    const [fechaInicio, fechaFin] = getFiltroPorFechaCitas();
    getCitasBookings(fechaInicio, fechaFin)
      .then(r => r.json())
      .then(d => {
        handleCommon(
          d,
          () => setCitasBookings(d.data),
        )
      });
    setLoading(false);
  }, [recargarData]);


  useEffect(() => {
    if (!loading) {
      if (refProveedor.current && refGuia.current && refObservacion.current) {
        refProveedor.current.value = form.proveedor
        refGuia.current.value = form.guia
        refObservacion.current.value = form.observacion
      }
    }
  }, [loading, refProveedor.current, refGuia.current, refObservacion.current])

  /**
   * @fecha 2025-02-05
   * @autor Omar Echavarria
   * @descripcion Esta función actualiza el estado `touchForm`, marcando todos los campos del formulario como "tocados" 
   * (con valor `true`). Es útil para activar validaciones visuales o para asegurarse de que todos los campos han 
   * sido revisados por el usuario antes de realizar una acción posterior.
   * 
   * @param {void} - No recibe parámetros.
   * @returns {void} - No retorna ningún valor.
   */
  const touchCampos = () => {
    setTouchForm({
      proveedor: true,
      op: true,
      guia: true,
      tipo: true,
      observacion: true,
      fechaInicio: true,
      fecha_fin: true,
    })
  }

  /**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función valida los campos de un formulario, verificando si los campos requeridos están completos 
 * y si los valores cumplen con los criterios especificados, como la longitud mínima. Si el formulario no es válido, 
 * la función marca los campos con errores y actualiza el estado `errorForm`. Además, puede activar la validación de 
 * los campos al hacer clic en el botón de enviar o al tocarlos.
 * 
 * @param {Object} form - El objeto que contiene los valores del formulario a validar.
 * @param {boolean} [submit=false] - Indica si la validación debe ser activada por un intento de envío del formulario.
 * 
 * @returns {boolean} - Retorna `true` si todos los campos son válidos, de lo contrario retorna `false`.
 */
  const validateForm = (form, submit = false) => {
    const isValid = {
      proveedor: false,
      op: false,
      guia: false,
      fechaInicio: false,
    }
    //let isValid = true;
    const copyError = { ...errorForm };
    for (let clave in form) {
      // valida si el campo esta vacio
      if (form[clave] == "" && (submit || touchForm[clave])) {
        if (!["observacion", "tipo"].includes(clave)) {
          console.log(clave)
          copyError[clave] = "Es requerido"
          isValid[clave] = false;
        }
      } else {
        isValid[clave] = true;
        copyError[clave] = ""
      }

      // valida el tamaño del string
      if (["proveedor", "guia"].includes(clave) && (submit || touchForm[clave])) {
        if (form[clave].length < 4 && form[clave] != "") {
          copyError[clave] = "Mínimo 4 caracteres",
            isValid[clave] = false;
        }
      } else {
        if (isValid[clave]) {
          isValid[clave] = true;
          copyError[clave] = ""
        }
      }
    }
    setErrorForm(copyError);
    for (let clave in isValid) {
      if (!isValid[clave]) {
        return false;
      }
    }
    return true;
  }

  /**
   * @fecha 2025-02-05
   * @autor Omar Echavarria
   * @descripcion Esta función maneja el cambio de valor en el campo "proveedor" del formulario. Convierte el valor ingresado 
   * a mayúsculas, lo actualiza en el estado `form` y también marca el campo como tocado en el estado `touchForm`. 
   * Además, se realiza una validación del formulario con el valor actualizado del proveedor.
   * 
   * @param {Object} e - El evento de cambio que contiene el nuevo valor del campo "proveedor".
   * 
   * @returns {void} - No retorna ningún valor.
   */
  const changeProvedor = (e) => {
    const value = e.target.value.toUpperCase();
    refProveedor.current.value = value;
    const copyForm = {
      ...form,
      proveedor: value
    }
    setForm(copyForm);
    setTouchForm({
      ...touchForm,
      proveedor: true
    });
    validateForm(copyForm);
  }

  /**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función maneja el cambio de la operación seleccionada. Primero, verifica si todas las operaciones 
 * asociadas a la operación tienen el estado "Pendiente" y ajusta el valor de `opLista`. Luego, actualiza el estado 
 * de `servicioSeleccionado` con los datos del servicio correspondiente al tipo y cantidad de la operación. También 
 * actualiza el formulario y los estados `touchForm` y `diaSeleccionado`. Finalmente, realiza la validación del formulario 
 * con los nuevos datos.
 * 
 * @param {Object} op - La operación seleccionada que contiene información como id, tipo, cantidad y descripción.
 * 
 * @returns {void} - No retorna ningún valor.
 */
  const changeOp = (op) => {

    let bandera = true;
    for (let i = 0; i < op.operaciones.length; i++) {
      const e = op.operaciones[i]
      if (e.estado == "Pendiente") {
        bandera = false;
        break
      }
    }
    setOpLista(bandera);

    setServicioSeleccionado(
      {
        ...dataServicios.find(ele => ele.type == op.tipo && (ele.min < op.cantidad && ele.max >= op.cantidad)),
        op_descripcion: op.descripcion,
        op_cantidad: op.cantidad,
      }
    )
    setOpSeleccionada(op);
    const copyForm = {
      ...form,
      op: op.id,
      tipo: op.tipo,
      fechaInicio: "",
    }
    setForm(copyForm);
    setTouchForm({
      ...touchForm,
      op: true,
      tipo: true
    });
    setDiaSeleccionado(null);
    validateForm(copyForm);
  }

  /**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función maneja el procesamiento de la fecha seleccionada para agendar una cita. Primero, verifica 
 * que exista configuración de negocios (`configBooking`), citas previas (`citasBookings`), y otros datos necesarios como 
 * la operación seleccionada (`form.op`) y el servicio (`servicioSeleccionado`). Luego, obtiene la configuración de los 
 * horarios de negocio del día seleccionado, genera un listado de intervalos de tiempo disponibles y determina los intervalos 
 * ocupados por citas previas. A continuación, filtra los intervalos válidos según la disponibilidad y la duración del servicio 
 * seleccionado. Finalmente, valida si la fecha seleccionada es válida y actualiza el formulario y los estados relacionados 
 * (`form`, `diaSeleccionado`, `excludeTimes`).
 * 
 * @param {Date} date - La fecha seleccionada para la cita.
 * 
 * @returns {void} - No retorna ningún valor.
 */
  const handleDate = (date) => {

    if (configBooking && citasBookings && date && form.op && servicioSeleccionado) {
      const copyForm = { ...form }
      // buscar el slots de hoy 
      const dateFormated = new Date(date);
      dateFormated.setHours(0, 0, 0, 0);
      const today = new Date();
      const { businessHours } = configBooking;
      const getConfigToday = businessHours[dateFormated.getDay()];

      // obtengo las horas cada 15 min del dia
      const allDateTimes = getAllDateTimes(dateFormated, intervalTime);

      const timeSlots = getConfigToday.timeSlots;
      const startTime = getConfigToday.timeSlots[0].startTime.slice(0, 5);
      const endTime = getConfigToday.timeSlots[0].endTime.slice(0, 5);

      const dateStart = new Date(dateFormated);
      const dateEnd = new Date(dateFormated);

      dateStart.setHours(Number(startTime.split(":")[0]), Number(startTime.split(":")[1]), 0, 0);
      dateEnd.setHours(Number(endTime.split(":")[0]), Number(endTime.split(":")[1]), 0, 0);

      // verificar si hay cita en el dia seleccionado  
      const appointmentsToday = getAppointmentsToday(citasBookings, dateFormated);

      // bloquear lo que sea menor a a startTime, mayor a endTime y menor a la hora actual 
      const [excludeTimes, includeTimes] = getExcludeTimes(allDateTimes, appointmentsToday, today, timeSlots, dateFormated);

      const { minutes } = servicioSeleccionado;

      const excludesByAppoinments = getExcludeTimesByAppoinments(includeTimes, intervalTime, minutes);

      const totalDatesExclude = [...excludeTimes, ...excludesByAppoinments]
      setExcludeTimes(totalDatesExclude);
      let dateIsOk = true;

      totalDatesExclude.forEach(d => {
        if (compareDates(new Date(d), new Date(date))) {
          dateIsOk = false;
        }
      });
      if (dateIsOk) {
        copyForm.fechaInicio = date
        setDiaSeleccionado(date);
      } else {
        for (const dI of includeTimes) {
          if (!totalDatesExclude.includes(dI)) {
            copyForm.fechaInicio = date;
            setDiaSeleccionado(date);
            break;
          }
        }
      }
      setForm(copyForm)
      validateForm(copyForm)
    }
  }

  /**
   * @fecha 2025-02-05
   * @autor Omar Echavarria
   * @descripcion Esta función maneja los cambios en los campos del formulario. Cada vez que un usuario modifica el valor 
   * de un campo, la función actualiza el estado del formulario (`form`) con el nuevo valor del campo, manteniendo los 
   * valores anteriores. Además, marca el campo modificado como tocado en el estado `touchForm` y ejecuta la función 
   * de validación (`validateForm`) para asegurarse de que el formulario sigue siendo válido después del cambio.
   * 
   * @param {Event} e - El evento que contiene la información del campo que fue modificado.
   * 
   * @returns {void} - No retorna ningún valor.
   */
  const changeForm = (e) => {
    const copyForm = {
      ...form,
      [e.target.name]: e.target.value
    }
    setForm(copyForm);
    setTouchForm({
      ...touchForm,
      [e.target.name]: true,
    });
    validateForm(copyForm);
  }

  /**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función se ejecuta cuando una cita ha sido correctamente agendada. Muestra una notificación de alerta
 * con el mensaje "Agendada" durante 8 segundos y luego la oculta. Además, restablece los valores del formulario y 
 * los campos de estado relacionados, como `form`, `touchForm`, `diaSeleccionado`, `opSeleccionada`, y `servicioSeleccionado`, 
 * asegurando que todo el estado se restablezca a su valor inicial. Finalmente, actualiza el estado `recargarData` para 
 * forzar la recarga de los datos.
 * 
 * @param {void} - No recibe parámetros.
 * @returns {void} - No retorna ningún valor.
 */

  const agendadaOk = () => {

    setAlertOperation({
      msj: "Agendada",
      show: true,
    });

    setTimeout(() => {
      setAlertOperation({
        msj: "Agendada",
        show: false,
      })
    }, 8000);

    setForm({
      proveedor: "",
      op: "",
      guia: "",
      tipo: "",
      observacion: "",
      fechaInicio: "",
    });

    setTouchForm({
      proveedor: false,
      op: false,
      guia: false,
      tipo: false,
      observacion: false,
      fechaInicio: false,
      fecha_fin: false,
    });

    setDiaSeleccionado(null);
    setOpSeleccionada(null);
    setServicioSeleccionado(null);
    setRecargarData(!recargarData)
  }

  /**
 * @fecha 2025-02-05
 * @autor Omar Echavarria
 * @descripcion Esta función se encarga de manejar el envío del formulario para crear una nueva cita. Primero, marca los campos 
 * como tocados para mostrar errores de validación si es necesario. Luego, valida el formulario, y si hay algún error de 
 * validación o si la operación seleccionada no está disponible (`opLista`), se detiene el proceso. Si el formulario es válido, 
 * calcula la fecha de finalización (`fechaFin`) sumando los minutos de duración del servicio a la fecha de inicio seleccionada. 
 * Luego, actualiza el estado del formulario con los datos completos, incluyendo la referencia y descripción de la operación, 
 * la descripción del servicio y los minutos de duración. Finalmente, se realiza la creación de la cita mediante la función 
 * `crearCita`, y según la respuesta, se maneja la notificación de éxito o error.
 * 
 * @param {void} - No recibe parámetros.
 * @returns {void} - No retorna ningún valor.
 */
  const submitForm = () => {
    touchCampos()
    if (!validateForm(form, true) || !opLista) {
      console.log(opLista)
      return
    }
    setLoading(true);
    const fechaFin = sumMinutes(form.fechaInicio, servicioSeleccionado.minutes);

    const copyForm = {
      ...form,
      fechaFin,
      serviceId: servicioSeleccionado.id,
      opReferencia: opSeleccionada.op,
      opDescripcion: opSeleccionada.descripcion,
      opCantidad: opSeleccionada.cantidad,
      servicioDescripcion: servicioSeleccionado.displayName,
      minutos: servicioSeleccionado.minutes,
    }
    setForm(copyForm)
    crearCita(copyForm)
      .then(r => r.json())
      .then(d => {
        setLoading(false)
        handleCommon(
          d,
          agendadaOk,
          null,
          () => setAlertOperation({
            msj: "Falló al crear la cita",
            show: true,
          })
        )
      })
  }


  if (loading || !configBooking) {
    return (
      <section className=" flex items-center justify-center mt-5">
        <div className="w-[750px] h-[500px] shadow-lg border-2 border-slate-500 rounded-md  flex flex-col items-center justify-center py-2">
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
      <section className="flex items-center justify-center mt-5">
        <div className="w-[750px] shadow-lg border-2 border-slate-500 rounded-md  flex flex-col items-center justify-start py-2">
          <div className="">
            <div className="grid grid-cols-2 gap-x-5">
              <span>
                <div >
                  <LblPrimary value="Proveedor" />
                  <Asterisco />
                </div>
                <input
                  maxLength={99}
                  ref={refProveedor}
                  onChange={changeProvedor}
                  className="focus:outline-none w-full text-sm border-b border-slate-500"
                  type="text"
                  autoComplete="off"
                />
                <ErrorForm value={errorForm.proveedor} />
              </span>
              <span>
                <div >
                  <LblPrimary value="Orden de produccion" />
                  <Asterisco />
                </div>
                <InputSelect
                  dataSelect={ops}
                  clickOption={changeOp}
                  value={form.op}
                />
                <ErrorForm value={errorForm.op} />
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-5">
              <span>
                <div>
                  <LblPrimary value="Guia transportadora" />
                  <Asterisco />
                </div>
                <input
                  maxLength={44}
                  autoComplete="off"
                  ref={refGuia}
                  onChange={changeForm}
                  name="guia"
                  className="focus:outline-none w-full text-sm border-b border-slate-500"
                  type="text"
                />
                <ErrorForm value={errorForm.guia} />
              </span>
              <span>
                <LblPrimary value="Tipo entrega" />
                <p className="w-full text-sm border-b border-slate-500 border-dashed">{form.tipo || "---"}</p>
              </span>
            </div>
            <div>
              <LblPrimary value="Observacion" />
              <input
                maxLength={99}
                autoComplete="off"
                ref={refObservacion}
                onChange={changeForm}
                name="observacion"
                className="focus:outline-none w-full text-sm border-b border-slate-500"
                type="text"
              />
            </div>
            <div className="grid grid-cols-2">
              <div>
                <div className="flex justify-start">
                  <div className="h-[290px] w-[170px]  border-red-500 ml-[160px]">
                    {
                      opSeleccionada &&
                      <DatePicker
                        className="w-0 h-1"
                        onChange={handleDate}
                        selected={diaSeleccionado}
                        minDate={configBooking.startDate}
                        maxDate={configBooking.endDate}
                        showTimeSelect
                        excludeDates={configBooking.excludeDates}
                        excludeTimes={excludeTimes}
                        open
                        timeIntervals={intervalTime}
                      />
                    }
                  </div>
                </div>
                <div className="w-[80px] h-[30px]">
                  <ErrorForm value={errorForm.fechaInicio} />
                </div>
              </div>
              <div className="grid grid-flow-row ml-8 mt-5">
                {
                  servicioSeleccionado &&
                  <section>
                    <b>Descripción</b>
                    <div >
                      <p>{servicioSeleccionado.op_descripcion}</p>
                      <div>
                        <div className="flex gap-x-2">
                          <p className="font-semibold">Total unidades: </p> <p>{servicioSeleccionado.op_cantidad}</p>
                        </div>
                        <div className="flex gap-x-2">
                          <p className="font-semibold">Servicio: </p> <p>{servicioSeleccionado.displayName}</p>
                        </div>
                        <div className="flex gap-x-2">
                          <p className="font-semibold">Tiempo: </p><p>{servicioSeleccionado.minutes} minutos</p>
                        </div>
                      </div>
                    </div>
                  </section>
                }
                {
                  opSeleccionada &&
                  <section>
                    <b>Operaciones</b>
                    {
                      opSeleccionada.operaciones.length > 0 && opSeleccionada.operaciones.map(ope =>
                        <span className="flex gap-x-2" key={ope.id}>
                          <p className="font-semibold">{ope.operacion}: </p> <p className={`${ope.estado == "Pendiente" ? "text-red-600 " : ""}`}>{ope.estado}</p>
                        </span>
                      )
                    }
                  </section>
                }
              </div>
            </div>
          </div>
          <div className="flex gap-3 mt-5">
            <BtnPrimary type="buttom" value="Guardar" typeBol="blue" click={submitForm} active={true} />
          </div>
          <div className="mt-2">
          </div>
        </div>
        <div className="loader">
        </div>
      </section>
    )
  }
}

export default CFormCita;
