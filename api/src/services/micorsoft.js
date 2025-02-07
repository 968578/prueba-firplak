// librerias
require("dotenv").config();
const axios = require("axios");

/**
 * @Función
 * @autor Omar Echavarria
 * @fecha 2025-02-05
 * @params No recibe parámetros.
 * @descripcion Esta función se encarga de obtener un token de acceso desde la API de Microsoft 
 * utilizando las credenciales almacenadas en las variables de entorno (`CLIENT_ID`, `CLIENT_SECRET`, `SCOPE`, `GRANT_TYPE`, `API_URL_MICROSOFT_LOGIN`, `TENANT_ID`).
 * La solicitud se realiza mediante un POST con los parámetros necesarios para la autenticación. Si la solicitud es exitosa, 
 * se retorna el objeto de respuesta con el token de acceso. Si ocurre un error en el proceso, se captura y lanza un error con el mensaje "microsoft".
 * @returns {Object} Objeto con los datos de respuesta, que incluye el token de acceso recibido de Microsoft.
 * @throws {Error} Si ocurre un error en la solicitud o en la obtención del token, se lanza un error con el mensaje "microsoft".
 */
const loginMicrosoft = async () => {
  try {

    const body = new URLSearchParams();
    body.append('client_id', process.env.CLIENT_ID);
    body.append('grant_type', process.env.GRANT_TYPE);
    body.append('scope', process.env.SCOPE);
    body.append('client_secret', process.env.CLIENT_SECRET);

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    const response = await axios.post(`${process.env.API_URL_MICROSOFT_LOGIN}/${process.env.TENANT_ID}/oauth2/v2.0/token`, body, config)
    return response.data;

  } catch (error) {
    console.log(error)
    throw new Error("microsoft")
  }
}

/**
 * @Función
 * @autor Omar Echavarria
 * @fecha 2025-02-05
 * @params {string} token - Token de acceso obtenido previamente para autenticar la solicitud.
 * @descripcion Esta función obtiene la configuración de reservas desde la API de Microsoft utilizando el token de acceso 
 * proporcionado. Realiza una solicitud GET a la URL de la API de Microsoft para obtener los datos de configuración, 
 * tales como las horas laborales, el nombre para mostrar y el intervalo de tiempo para los horarios de reserva. 
 * Si la solicitud es exitosa, devuelve un objeto con estos datos. Si ocurre un error en el proceso, se captura el error, 
 * pero no se lanza una excepción, lo que podría generar una pérdida de información de error.
 * @returns {Object} Objeto que contiene las horas de negocio (`businessHours`), el nombre para mostrar (`displayName`) 
 * y el intervalo de tiempo para los horarios de reserva (`timeSlotInterval`).
 * @throws {Error} Si ocurre un error en la solicitud o en la obtención de los datos, se captura el error pero no se lanza un mensaje específico.
 */
const getConfigBooking = async (token) => {
  try {

    const response = await axios.get(`${process.env.API_URL_API_MICROSOFT}/solutions/bookingBusinesses/citasfir@kbk.co`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    const { businessHours, displayName, schedulingPolicy: { timeSlotInterval } } = response.data;

    const configBooking = {
      businessHours,
      displayName,
      timeSlotInterval,
    }
    return configBooking;

  } catch (error) {
    console.log(error)
    throw new Error("microsoft")
  }
}

/**
 * @Función
 * @autor Omar Echavarria
 * @fecha 2025-02-05
 * @params {string} token - Token de acceso obtenido previamente para autenticar la solicitud.
 * @params {string} start - Fecha de inicio para obtener las citas en el rango de calendario.
 * @params {string} end - Fecha de fin para obtener las citas en el rango de calendario.
 * @descripcion Esta función obtiene las citas de reservas desde la API de Microsoft para un rango de fechas 
 * especificado por los parámetros `start` (inicio) y `end` (fin). Realiza una solicitud GET a la URL de la API de Microsoft 
 * y, si la solicitud es exitosa, retorna un arreglo con los detalles de las citas, tales como `id`, `serviceName`, 
 * `customerName`, `startDateTime` y `endDateTime`. Si ocurre un error en el proceso, se captura y lanza un error con el 
 * mensaje "microsoft".
 * @returns {Array} Un arreglo de objetos que contiene los detalles de las citas dentro del rango de fechas especificado.
 * @throws {Error} En caso de error en la solicitud a la API o en la obtención de los datos, se lanza un error con el mensaje "microsoft".
 */
const getCitasBookings = async (token, start, end) => {

  try {

    const response = await axios.get(`${process.env.API_URL_API_MICROSOFT}/solutions/bookingBusinesses/citasfir@kbk.co/calendarView?start=${start}&end=${end}`, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    return response.data.value.map(a => {
      return {
        id: a.id,
        serviceName: a.serviceName,
        customerName: a.customerName,
        startDateTime: a.startDateTime,
        endDateTime: a.endDateTime,
      }
    })

  } catch (error) {
    console.log(error);
    throw new Error("microsoft") 
  }
}


/**
 * @Función
 * @autor Omar Echavarria
 * @fecha 2025-02-05
 * @params {Object} params - Objeto con los parámetros necesarios para crear una cita en Microsoft.
 * @params {string} params.token - Token de acceso para autenticar la solicitud.
 * @params {string} params.fechaInicio - Fecha y hora de inicio de la cita en formato UTC.
 * @params {string} params.fechaFin - Fecha y hora de fin de la cita en formato UTC.
 * @params {string} params.nota - Nota o descripción asociada a la cita.
 * @params {string} params.serviceId - ID del servicio asociado a la cita.
 * @params {string} params.proveedor - Nombre del proveedor asociado a la cita.
 * @descripcion Esta función crea una cita en Microsoft Bookings mediante una solicitud POST a la API de Microsoft. 
 * Utiliza el token de acceso proporcionado, junto con otros parámetros como las fechas de inicio y fin, el servicio, 
 * el proveedor y la nota. Si la solicitud es exitosa, se retorna el ID de la cita creada. En caso de error, se captura 
 * el error y se lanza un error con el mensaje "microsoft".
 * @returns {string} El ID de la cita creada en Microsoft Bookings.
 * @throws {Error} Si ocurre un error durante el proceso de creación de la cita, se lanza un error con el mensaje "microsoft".
 */
const createAppointmentMicrosoft = async ({
  token,
  fechaInicio,
  fechaFin,
  nota,
  serviceId,
  proveedor,
}) => {
  try {
    
    const body = {
      '@odata.type': '#microsoft.graph.bookingAppointment',
      customerTimeZone: 'America/Bogota',
      smsNotificationsEnabled: false,
      endDateTime: {
        '@odata.type': '#microsoft.graph.dateTimeTimeZone',
        dateTime: fechaFin,
        timeZone: 'UTC'
      },
      isLocationOnline: false,
      optOutOfCustomerEmail: false,
      anonymousJoinWebUrl: null,
      postBuffer: 'PT0S',
      preBuffer: 'PT0S',
      price: 0,
      'priceType@odata.type': '#microsoft.graph.bookingPriceType',
      priceType: 'undefined',
      'reminders@odata.type': '#Collection(microsoft.graph.bookingReminder)',
      reminders: [],
      serviceId,
      serviceLocation: {
        '@odata.type': '#microsoft.graph.location',
        address: {
          '@odata.type': '#microsoft.graph.physicalAddress',
          city: '',
          countryOrRegion: '',
          postalCode: '',
          postOfficeBox: null,
          state: '',
          street: '',
          'type@odata.type': '#microsoft.graph.physicalAddressType',
          type: null
        },
        coordinates: null,
        displayName: '',
        locationEmailAddress: null,
        'locationType@odata.type': '#microsoft.graph.locationType',
        locationType: null,
        locationUri: null,
        uniqueId: null,
        'uniqueIdType@odata.type': '#microsoft.graph.locationUniqueIdType',
        uniqueIdType: null
      },
      serviceNotes: nota,
      staffMemberIds: [],
      startDateTime: {
        '@odata.type': '#microsoft.graph.dateTimeTimeZone',
        dateTime: fechaInicio,
        timeZone: 'UTC'
      },
      maximumAttendeesCount: 1,
      filledAttendeesCount: 1,
      'customers@odata.type': '#Collection(microsoft.graph.bookingCustomerInformation)',
      customers: [
        {
          '@odata.type': '#microsoft.graph.bookingCustomerInformation',
          customerId: null,
          name: proveedor,
          emailAddress: '',
          phone: '',
          notes: null,
          location: {
            '@odata.type': '#microsoft.graph.location',
            displayName: '',
            locationEmailAddress: null,
            locationUri: '',
            locationType: null,
            uniqueId: null,
            uniqueIdType: null,
            address: {
              '@odata.type': '#microsoft.graph.physicalAddress',
              street: '',
              city: '',
              state: '',
              countryOrRegion: '',
              postalCode: ''
            },
            coordinates: {
              altitude: null,
              latitude: null,
              longitude: null,
              accuracy: null,
              altitudeAccuracy: null
            }
          },
          timeZone: 'America/Bogota',
          customQuestionAnswers: []
        }
      ]
    };
    
    const response = await axios.post(`${process.env.API_URL_API_MICROSOFT}/solutions/bookingBusinesses/citasfir@kbk.co/appointments`, body, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
    return response.data.id

  } catch (error) {
    console.log(error)
    throw new Error("microsoft");
  }
}

/**
 * @Función
 * @autor Omar Echavarria
 * @fecha 2025-02-05
 * @params {string} token - Token de acceso para autenticar la solicitud.
 * @params {string} cita_id - ID de la cita que se desea cancelar.
 * @descripcion Esta función cancela una cita previamente creada en Microsoft Bookings mediante una solicitud POST a la API de Microsoft. 
 * Utiliza el token de acceso y el ID de la cita para hacer la cancelación, enviando un mensaje de cancelación. Si la solicitud es exitosa, 
 * la función retorna el estado de la respuesta HTTP. En caso de error, captura el error y lanza un error con el mensaje "soft".
 * @returns {number} El código de estado de la respuesta HTTP (generalmente 200 para éxito).
 * @throws {Error} Si ocurre un error durante el proceso de cancelación de la cita, se lanza un error con el mensaje "soft".
 */
const cancelAppointment = async (token, cita_id) => {
  try {

    const body = {
      cancellationMessage: "ok"
    }
    const response = await axios.post(`${process.env.API_URL_API_MICROSOFT}/solutions/bookingBusinesses/citasfir@kbk.co/appointments/${cita_id}/cancel`, body, {
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });

    return response.status

  } catch (error) {
    console.log(error)
    throw new Error("soft")
  }
}

module.exports = {
  loginMicrosoft,
  getConfigBooking,
  getCitasBookings,
  createAppointmentMicrosoft,
  cancelAppointment,
}