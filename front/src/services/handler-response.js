/**
 * @fecha 2025-01-12
 * @autor Omar Echavarria
 * @descripcion Esta función maneja la respuesta de una solicitud de API común. Dependiendo del mensaje en la 
 * respuesta (`res.message`), la función realiza diferentes acciones:
 * - Si el mensaje es "fail token", elimina el token de autenticación del `localStorage` y redirige al usuario 
 *   a la página principal.
 * - Si el mensaje es "server error", muestra una alerta notificando un error en el servidor.
 * - Si el mensaje es "Unauthorized", ejecuta la función `cbUnauthorized` (si se proporciona) para manejar 
 *   el caso de falta de autorización.
 * - Si el mensaje es "ok", ejecuta la función `callback` pasada como parámetro para realizar la acción correspondiente.
 * 
 * @param {object} res - La respuesta de la API, que debe contener un mensaje (`message`) que indique el resultado 
 *                       de la solicitud.
 * @param {function} callback - Una función que se ejecuta si la respuesta es "ok".
 * @param {function} cbUnauthorized - Una función que se ejecuta si la respuesta es "Unauthorized".
 * 
 * @returns {void} - No retorna ningún valor, solo maneja la respuesta de la API y ejecuta las funciones 
 *                    correspondientes.
 */
export const handleCommon = (res, callback, cbUnauthorized, cbFail ) => {
  if (res.message == "fail token") {
    window.localStorage.removeItem("token-prueba-loggro");
    window.location.href = "/";
  } else if (res.message == "server error") {
    if(cbFail){
      cbFail()
    }
  } else if(res.message == "Unauthorized"){
    if(cbUnauthorized){
      cbUnauthorized()
    }

  } else if (res.message == "ok") {
    callback()
  }
}