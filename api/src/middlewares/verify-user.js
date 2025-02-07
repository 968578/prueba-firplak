//Librerias
require("dotenv").config();
const jwt = require("jsonwebtoken");

/**
 * @Middleware
 * @autor Omar Echavarria
 * @fecha 2025-01-14
 * @params Recibe los objetos Request, Response y Next de la petición.
 * @descripcion Este middleware verifica el token de autorización enviado en los headers de la solicitud, 
 * asegurando que el usuario esté autenticado y autorizado para acceder a la API.
 */
const verifyToken = (req, res, next) => {

  const token = req.headers["authorization"];
  if (token) {

    jwt.verify(token, process.env.SECRET_KEY_JWT, async (err, data) => {
      if (err) {
        return res.status(401).json({
          message: "fail token",
        });
      } else {
        req.user = data.user
        return next();
      }
    });
  } else {
    return res.status(401).json({
      message: "fail token",
    });
  }

}

module.exports ={
  verifyToken
}