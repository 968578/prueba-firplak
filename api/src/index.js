// Librerias
const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const cors = require("cors");

// services
const { getConnection } = require("./services/mysql-connection");


const app = express();

// Middlewares
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));

// Rutas
app.use("/apiv1/cita", require("./controllers/controller-citas"))
app.use("/apiv1/user", require("./controllers/controller-user"))

const port = process.env.API_PORT || 3001;
app.listen(port, async () => {
  try {
    console.log("Api escuchando en:", port);
    await getConnection();
    console.log("db conectada")
  } catch (error) {
    console.log(error);
    console.log("db falla"); 
  }

})