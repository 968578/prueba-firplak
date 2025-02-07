
const urlApiCita = `${import.meta.env.VITE_APP_BASE_URL_API}/${import.meta.env.VITE_APP_API_CITA}`
const urlApiUser = `${import.meta.env.VITE_APP_BASE_URL_API}/${import.meta.env.VITE_APP_API_USER}`

/**
 * @fecha 2025-02-03
 * @autor Omar Echavarria
 * @descripcion Esta función crea y devuelve los encabezados (headers) necesarios para realizar una solicitud 
 * HTTP autenticada. Verifica si el token de autenticación está presente en el `localStorage` y, si no lo está, 
 * redirige al usuario a la página principal ("/"). Si el token está disponible, lo agrega al encabezado como 
 * un campo `authorization`. Además, si el parámetro `isJosn` es `true`, se agrega el encabezado `Content-Type` 
 * con el valor `application/json`, lo que indica que el cuerpo de la solicitud estará en formato JSON.
 * 
 * @param {boolean} isJosn - Indica si se debe incluir el encabezado `Content-Type` con el valor 
 *                            `application/json`. Si es `true`, se incluirá.
 * 
 * @returns {Headers} - Retorna un objeto `Headers` con los encabezados necesarios para la solicitud.
 */
const createHeaders = (isJosn) => {

  const headers = new Headers();

  const token = window.localStorage.getItem("token-firplak");
  const parseToken = JSON.parse(token)
  if (!token || !parseToken?.token) {
    return window.location.href = "/"
  }
  headers.append("authorization", parseToken.token)
  if (isJosn) {
    headers.append("Content-Type", "application/json")
  }

  return headers
}


/**
 * @fecha 2025-02-03
 * @autor Omar Echavarria
 * @descripcion Esta función realiza una solicitud HTTP `POST` a la API de autenticación para iniciar sesión 
 * con las credenciales proporcionadas en el parámetro `data`. El parámetro `data` debe contener el nombre 
 * de usuario y la contraseña del usuario que está intentando iniciar sesión. La solicitud se envía con el 
 * encabezado `Content-Type` configurado como `application/json` y los datos se incluyen en el cuerpo de 
 * la solicitud como un objeto JSON.
 * 
 * @param {Object} data - Un objeto que contiene las credenciales de inicio de sesión, típicamente con las 
 *                         propiedades `name` (usuario) y `password` (contraseña).
 * 
 * @returns {Promise} - Retorna una promesa que se resuelve con la respuesta de la API de autenticación, 
 *                      la cual puede incluir un token de sesión o un mensaje de error dependiendo de las 
 *                      credenciales enviadas.
 */
export const authLogin = (data) => {
  return fetch(urlApiUser + "/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });
}

export const getOps = () => {
  return fetch(`${urlApiCita}/ops`, {
    method: "GET",
    headers: createHeaders(true),
  })
}


export const getConfigBookings = () => {
  return fetch(`${urlApiCita}/configbookings`, {
    method: "GET",
    headers: createHeaders(true),
  })
}

export const getCitasBookings = (fechaInicio, fechaFin) => {
  return fetch(`${urlApiCita}/bookings-citas?inicio=${fechaInicio}&fin=${fechaFin}`, {
    method: "GET",
    mode: "cors",
    headers: createHeaders(true)
  })
}

export const crearCita = (data) => {
  return fetch(urlApiCita, {
    method: "POST",
    mode: "cors",
    headers: createHeaders(true),
    body: JSON.stringify(data)
  })
}

export const getCitas = (filter) => {
  return fetch(`${urlApiCita}` + (filter ? `?filter=${JSON.stringify(filter)}` : ""), {
    method: "GET",
    headers: createHeaders(true),
  })
}


export const getCitaById = (id) => {
  return fetch(`${urlApiCita}/${id}`, {
    method: "GET",
    headers: createHeaders(true),
  })
}

export const cancelarCita = (id)=>{
  return fetch(`${urlApiCita}/cancel`, {
    method: "POST",
    headers: createHeaders(true),
    body: JSON.stringify({id})
  })
}
