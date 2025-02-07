// Librerias
const { Router } = require("express");

//Servicios
const { loginMicrosoft, getConfigBooking, getCitasBookings, createAppointmentMicrosoft, cancelAppointment } = require("../services/micorsoft");
const { getConnection } = require("../services/mysql-connection");

// Respuestas
const { responseOk, responseErrorServer } = require("../services/responses");

// Middlewares
const { verifyToken } = require("../middlewares/verify-user");

// Dummy data
const { dataOp } = require("../services/data-integracion");


const router = Router();


/**
 * @Controlador
 * @autor Omar Echavarria
 * @fecha 2025-02-05
 * @params {Object} req.query.filter - Filtro opcional en formato JSON que contiene los parámetros `from` y `to` para la búsqueda de fechas.
 * @descripcion Este controlador se encarga de retornar un listado de todas las citas registradas en el sistema, 
 * aplicando filtros de fecha si son proporcionados a través del parámetro `filter` en la consulta. 
 * La fecha de inicio (`fecha_inicio`) se compara con los valores `from` y `to`, si están presentes.
 * Si no se proporciona ningún filtro, se devuelve todas las citas sin restricción de fechas.
 * @returns {Object} Respuesta con el listado de citas encontradas en formato JSON.
 * @throws {Error} En caso de error en la consulta o conexión a la base de datos, se responde con un error del servidor.
 */
router.get("/", verifyToken, async (req, res) => {

  const filter = req?.query?.filter;
  let filterParse = null;
  if (filter) {
    filterParse = JSON.parse(filter);
  }
  try {
    const conn = await getConnection();
    const [result] = await conn.execute(`
      SELECT 
        *
      FROM
        citas  
      WHERE
        ${filterParse.from ? `fecha_inicio > '${filterParse.from} 00:00:00' AND ` : " fecha_inicio > 0 AND "}
        ${filterParse.to ? `fecha_inicio < '${filterParse.to} 23:59:59'` : " 1 = 1"}
      `);

    responseOk(res, result);
  } catch (error) {
    console.log(error)
    responseErrorServer(res);
  }
});


/**
 * @Controlador
 * @autor Omar Echavarria
 * @fecha 2025-02-05
 * @params {Object} req.body.id - ID de la cita a cancelar.
 * @descripcion Este controlador se encarga de cancelar una cita. Primero, obtiene la cita desde la base de datos 
 * utilizando el ID proporcionado en el cuerpo de la solicitud. Luego, llama a una API externa (Microsoft) 
 * para cancelar la cita. Finalmente, actualiza el estado de la cita en la base de datos a `0`, lo que indica que ha sido cancelada.
 * Si alguna operación falla, se realiza un rollback para deshacer todos los cambios realizados durante la transacción.
 * @returns {Object} Respuesta exitosa si la cita es cancelada correctamente.
 * @throws {Error} En caso de error en la consulta, la cancelación o la actualización de la cita, se realiza un rollback y se responde con un error del servidor.
 */
router.post("/cancel", verifyToken, async (req, res) => {
  const {id} = req.body;

  const conn = await getConnection();

  try {
    await conn.beginTransaction();

    const [result] = await conn.execute(`
      SELECT 
        cita_id
      FROM 
        citas
      WHERE
        id = ${id}
      `)
    const { access_token } = await loginMicrosoft();

    await cancelAppointment(access_token, result[0].cita_id,);

    await conn.execute(`
      UPDATE 
        citas
      SET estado = 0
      WHERE
        id = ${id}
      `)

    await conn.commit();
    responseOk(res);
  } catch (error) {
    console.log(error)
    await conn.rollback();
    responseErrorServer(res);
  }
});


/**
 * @Controlador
 * @autor Omar Echavarria
 * @fecha 2025-02-05
 * @params No recibe parámetros.
 * @descripcion Este controlador retorna un arreglo con los datos de las operaciones (`dataOp`). 
 * Si ocurre algún error durante la operación, se responde con un error del servidor.
 * @returns {Array} Devuelve un arreglo de las ordenes de produccion.
 * @throws {Error} En caso de error al recuperar los datos, se responde con un error del servidor.
 */
router.get("/ops", verifyToken, async (req, res) => {
  try {
    responseOk(res, dataOp);
  } catch (error) {
    console.log(error)
    responseErrorServer(res);
  }
});


/**
 * @Controlador
 * @autor Omar Echavarria
 * @fecha 2025-02-05
 * @params No recibe parámetros.
 * @descripcion Este controlador obtiene la configuración de reservas (`configBooking`) desde una fuente externa, 
 * utilizando un token de acceso obtenido previamente mediante la función `loginMicrosoft`. 
 * Si todo va bien, se retorna la configuración obtenida. Si ocurre un error, se responde con un error del servidor.
 * @returns {Object} Respuesta con la configuración de reservas (`configBooking`) en formato JSON.
 * @throws {Error} En caso de error al obtener el token de acceso o al recuperar la configuración, 
 * se responde con un error del servidor.
 */
router.get("/configbookings", verifyToken, async (req, res) => {
  try {
    const { access_token } = await loginMicrosoft();

    const configBooking = await getConfigBooking(access_token);

    responseOk(res, configBooking);
  } catch (error) {
    console.log(error)
    responseErrorServer(res);
  }
});


/**
 * @Controlador
 * @autor Omar Echavarria
 * @fecha 2025-02-05
 * @params {string} req.query.inicio - Fecha de inicio para filtrar las citas.
 * @params {string} req.query.fin - Fecha de fin para filtrar las citas.
 * @descripcion Este controlador obtiene las citas de reserva (`citasBookings`) para un rango de fechas especificado 
 * en los parámetros `inicio` y `fin` de la consulta. Utiliza un token de acceso obtenido mediante la función 
 * `loginMicrosoft` para autenticar la solicitud. Si todo va bien, se retornan las citas encontradas. Si ocurre un error, 
 * se responde con un error del servidor.
 * @returns {Object} Respuesta con las citas encontradas en formato JSON.
 * @throws {Error} En caso de error al obtener el token de acceso o al recuperar las citas, se responde con un error del servidor.
 */
router.get("/bookings-citas", verifyToken, async (req, res) => {
  const { inicio, fin } = req.query;
  try {
    const { access_token } = await loginMicrosoft();
    const citasBookings = await getCitasBookings(access_token, inicio, fin);

    responseOk(res, citasBookings);
  } catch (error) {
    console.log(error)
    responseErrorServer(res);
  }
});


/**
 * @Controlador
 * @autor Omar Echavarria
 * @fecha 2025-02-05
 * @params {string} req.params.id - ID de la cita a obtener.
 * @descripcion Este controlador obtiene una cita específica de la base de datos según el `id` proporcionado en los parámetros de la URL. 
 * Si la cita existe, se devuelve la información de la cita en formato JSON. Si ocurre un error, se responde con un error del servidor.
 * @returns {Object} Respuesta con los detalles de la cita encontrada en formato JSON.
 * @throws {Error} En caso de error en la consulta a la base de datos, se responde con un error del servidor.
 */
router.get("/:id", verifyToken, async (req, res) => {

  const { id } = req.params;
  try {
    const conn = await getConnection();
    const [result] = await conn.execute(`
      SELECT 
        *
      FROM
        citas  
      WHERE
        id = ${id}
      `);

    responseOk(res, result[0]);
  } catch (error) {
    console.log(error)
    responseErrorServer(res);
  }
});


/**
 * @Controlador
 * @autor Omar Echavarria
 * @fecha 2025-02-05
 * @params {Object} req.body - Datos de la cita a crear.
 * @params {string} req.body.proveedor - Nombre del proveedor de la cita.
 * @params {string} req.body.opReferencia - Referencia de la operación.
 * @params {string} req.body.opDescripcion - Descripción de la operación.
 * @params {number} req.body.opCantidad - Cantidad asociada a la operación.
 * @params {string} req.body.guia - Número de guía.
 * @params {string} req.body.tipo - Tipo de cita.
 * @params {string} req.body.fechaInicio - Fecha de inicio de la cita.
 * @params {string} req.body.fechaFin - Fecha de fin de la cita.
 * @params {string} req.body.serviceId - ID del servicio.
 * @params {string} req.body.servicioDescripcion - Descripción del servicio.
 * @params {string} req.body.observacion - Observaciones adicionales sobre la cita.
 * @params {number} req.body.minutos - Duración en minutos de la cita.
 * @descripcion Este controlador se encarga de crear una nueva cita. Primero, obtiene un token de acceso de Microsoft 
 * y crea la cita en Microsoft. Luego, inserta la cita en la base de datos con la información proporcionada en el cuerpo 
 * de la solicitud. Si alguna parte del proceso falla, se realiza un rollback en la transacción de la base de datos.
 * @returns {Object} Respuesta exitosa si la cita se ha creado correctamente.
 * @throws {Error} En caso de error en la creación de la cita en Microsoft o en la base de datos, se realiza un rollback 
 * y se responde con un error del servidor.
 */
router.post("/", verifyToken, async (req, res) => {
  const {
    proveedor,
    opReferencia,
    opDescripcion,
    opCantidad,
    guia,
    tipo,
    fechaInicio,
    fechaFin,
    serviceId,
    servicioDescripcion,
    observacion,
    minutos
  } = req.body;

  const conn = await getConnection();

  try {

    await conn.beginTransaction();

    const { access_token } = await loginMicrosoft();

    const idCitaMicrosoft = await createAppointmentMicrosoft({
      fechaInicio,
      fechaFin,
      nota: `Op: ${opReferencia}, Descripcion: ${opDescripcion}, Guia: ${guia}, Observación: ${observacion}`,
      serviceId,
      proveedor,
      token: access_token
    });

    if (idCitaMicrosoft) {
      let [result] = await conn.execute(`
        INSERT INTO citas
          (
          proveedor,
          op,
          guia,
          tipo,
          cita_id,
          op_descripcion,
          op_cantidad,
          servicio_descripcion,
          minutos,
          fecha_inicio,
          fecha_fin,
          estado,
          observacion
          )
        VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)
        `, [
        proveedor,
        opReferencia,
        guia,
        tipo,
        idCitaMicrosoft,
        opDescripcion,
        opCantidad,
        servicioDescripcion,
        minutos,
        new Date(fechaInicio),
        new Date(fechaFin),
        1,
        observacion ? observacion : null
      ]);
    } else {
      throw new Error("fallo ms")
    }

    await conn.commit();
    responseOk(res);
  } catch (error) {
    console.log(error)
    await conn.rollback();
    responseErrorServer(res);
  }
});




module.exports = router;