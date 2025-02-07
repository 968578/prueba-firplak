// Librerias
const mysql = require("mysql2/promise");
require("dotenv").config();

/**
 * @Función
 * @autor Omar Echavarria
 * @fecha 2025-02-05
 * @params No recibe parámetros.
 * @descripcion Esta función establece una conexión a la base de datos MySQL utilizando los parámetros de conexión proporcionados en las variables de entorno (host, usuario, contraseña, puerto y base de datos). Si la conexión es exitosa, devuelve el objeto de conexión. En caso de error, captura el error y muestra un mensaje de fallo en la conexión.
 * @returns {Promise} Devuelve una promesa con el objeto de conexión a la base de datos MySQL si la conexión es exitosa.
 * @throws {Error} Si ocurre un error durante la conexión a la base de datos, se lanza un error y se imprime un mensaje de fallo.
 */
const getConnection = async ()=>{
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password1: process.env.MYSQL_ROOT_PASSWORD,
      database:  process.env.MYSQL_DATABASE,
      // port: process.env.DB_PORT
    });
    return conn;
  } catch (error) {
    console.log(error);
    console.log("falla db")
  }
}

module.exports ={
  getConnection
}