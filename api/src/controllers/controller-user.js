// Librerias
const { Router } = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//Servicios
const { getConnection } = require("../services/mysql-connection");

// Respuestas
const { responseOk, responseErrorServer, responseFailLogin } = require("../services/responses");


const router = Router();

/**
 * @Controlador
 * @autor Omar Echavarria
 * @fecha 2025-02-03
 * @params Este controlador recibe en el cuerpo de la petición las propiedades "name" y "password" desde el frontend.
 * @descripcion Este controlador autentica al usuario utilizando una librería que encripta la contraseña. 
 * Luego, genera y envía un token JWT que tiene un tiempo de expiración de 10 minutos, y se utilizará para autenticar 
 * las peticiones subsiguientes durante ese período.
 */
router.post("/login",  async (req, res) => {
  const { name, password } = req.body;

  try {
    const conn = await getConnection();
    let [result] = await conn.execute(`
      SELECT 
        nombre_usuario, contrasenia
      FROM usuarios
      WHERE
        usuarios.nombre_usuario = ?
      LIMIT 1
      `,  [name]);
    user = result[0]
    
    if(!user){
      return responseFailLogin(res, false);
    }

    let passIsValid = bcrypt.compareSync(password, user.contrasenia);
    if(!passIsValid){
      return responseFailLogin(res, true)
    }
    const token = jwt.sign({ user : user.nombre_usuario }, process.env.SECRET_KEY_JWT, { expiresIn: "10m" });
    responseOk(res, {token, user : user.nombre_usuario});
  } catch (error) {
    console.log(error)
    responseErrorServer(res);
  }
});

module.exports = router;