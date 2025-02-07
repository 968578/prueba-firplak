/**
 * @Funciones de respuesta HTTP
 * @autor Omar Echavarria
 * @fecha 2025-01-12
 * @descripcion Este conjunto de funciones se encarga de enviar respuestas estándar con los 
 * códigos de estado HTTP apropiados y mensajes personalizados, para facilitar la gestión 
 * de las respuestas en la API y asegurar la consistencia en las respuestas del servidor.
 */
const responseOk=(res, data=null)=>{
  res.status(200).json({
    message:"ok",
    data
  });
}

const responseErrorServer=(res)=>{
  res.status(500).json({
    message:"server error"
  });
}

const responseFailLogin=(res, incorrectPass)=>{
  res.status(401).json({
    message:incorrectPass ? "incorrect password" : "cannot pass"
  });
}

const responseUnauthorizedOperation=(res)=>{
  res.status(401).json({
    message: "Unauthorized"
  });
} 

module.exports={
  responseOk,
  responseErrorServer,
  responseFailLogin,
  responseUnauthorizedOperation
}