// React
import { useState } from "react";

import { useNavigate } from "react-router-dom";
// Iconos
import IKey from "../assets/icons/i-key/i-key";
import IUser from "../assets/icons/i-user/i-user";

// Componentes
import BtnPrimary from "../components/components-simple/btn-primary";
import ErrorForm from "../components/components-simple/error-form";

// Servicios
import { authLogin } from "../services/services-api";

/**
 * @fecha 2025-01-12
 * @autor Omar Echavarria
 * @descripcion Este componente representa la página de inicio de sesión. Permite a los usuarios ingresar su nombre 
 * y contraseña para autenticar su cuenta. Si los datos son correctos, se guarda un token en el `localStorage` 
 * y se redirige al usuario a la página de lista de imágenes. Si hay errores en el inicio de sesión, se muestran 
 * mensajes de error correspondientes. 
 * 
 * @returns {JSX.Element} - Retorna el formulario de inicio de sesión que incluye campos para el nombre y la 
 * contraseña, así como los botones necesarios para realizar el proceso de autenticación.
 */
const PageLogin = () => {

  // Estados
  const [input, setInput] = useState({
    name: "",
    password: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    password: ""
  });

  // Navegar
  const navigate = useNavigate();


  /**
 * @fecha 2025-01-12
 * @autor Omar Echavarria
 * @descripcion Esta función valida los campos de entrada del formulario de inicio de sesión. Recorre los valores 
 * de `input` (nombre y contraseña) y verifica si están vacíos. Si algún campo está vacío, se marca como inválido 
 * y se agrega un mensaje de error al estado `errors`. Si todos los campos son válidos (no están vacíos), la función 
 * devuelve `true`, indicando que los datos del formulario son correctos.
 * 
 * @returns {boolean} - Retorna `true` si todos los campos son válidos (no están vacíos), de lo contrario, 
 * retorna `false` y muestra los errores correspondientes en cada campo.
 */
  const validateInput = () => {
    let isValid = true;
    const copyErrors = { ...errors };
    for (let key in input) {
      if (input[key] == "") {
        isValid = false
        copyErrors[key] = "Es obligatorio"
      } else {
        copyErrors[key] = ""
      }
    }
    setErrors(copyErrors)
    return isValid;
  }


  /**
 * @fecha 2025-01-12
 * @autor Omar Echavarria
 * @descripcion Esta función se ejecuta cada vez que el usuario cambia el valor de un campo del formulario. 
 * Actualiza el estado `input` con el nuevo valor del campo correspondiente. Utiliza la propiedad `name` del 
 * campo del formulario para identificar qué campo fue modificado y asigna el valor del input a la propiedad 
 * correspondiente en el estado `input`.
 * 
 * @param {object} e - El evento de cambio (onChange) del campo de formulario. Contiene el `name` del campo 
 * y el nuevo valor ingresado por el usuario.
 * @returns {void} - No retorna ningún valor, solo actualiza el estado del formulario.
 */
  const changeInput = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value
    })
  }


  /**
 * @fecha 2025-01-12
 * @autor Omar Echavarria
 * @descripcion Esta función se ejecuta cuando el usuario intenta enviar el formulario de inicio de sesión. 
 * Primero valida que los datos del formulario sean correctos utilizando la función `validateInput`. Si los 
 * datos son válidos, hace una solicitud a la API de autenticación (`authLogin`) con las credenciales del 
 * usuario. Según la respuesta de la API, se realizan diferentes acciones:
 * - Si la respuesta es "ok", el token de usuario se guarda en el `localStorage` y se redirige al usuario a 
 *   la página de listado de imágenes.
 * - Si la respuesta indica que la contraseña es incorrecta, se actualizan los errores para mostrar un mensaje 
 *   correspondiente.
 * - Si la respuesta indica que el usuario no está registrado, se actualizan los errores para mostrar otro mensaje 
 *   de error.
 * 
 * @returns {void} - No retorna un valor, solo maneja el proceso de validación y envío del formulario.
 */
  const submitInput = () => {
    if (!validateInput()) {
      return
    }

    authLogin(input)
      .then(r => r.json())
      .then(d => {
        if (d.message == "ok") {
          window.localStorage.setItem("token-firplak", JSON.stringify(d.data));
          navigate("list")
        } else if (d.message == "incorrect password") {
          setErrors({
            name: "",
            password: "Contraseña incorrecta"
          });
        } else if (d.message == "cannot pass") {
          setErrors({
            password: "",
            name: "No estas registrado"
          });
        }
      })
  }


  return (
    <div className=" h-screen w-screen flex justify-center items-center">
      <div className="shadow-lg border w-80 h-[300px] flex flex-col">
        <section className=" rounded-t-sm  h-24 bg-gray-200 pt-3 pl-2">
          <p>Prueba Técnica</p>
          <p className="font-bold text-lg">Omar Echavarria</p>
        </section>
        <section className="px-4 flex flex-col  flex-1 gap-y-3  items-center mt-6">
          <div className="w-full">
            <div className="border-b border-slate-400 flex gap-x-">
              <IUser />
              <input
                maxLength={99}
                onChange={changeInput}
                name="name"
                className="border-none focus:outline-none w-full text-sm"
                type="text"
              />
            </div>
            <ErrorForm value={errors?.name} />
          </div>
          <div className="w-full">
            <div className="border-b border-slate-400 flex gap-x-1">
              <IKey />
              <input
                maxLength={99}
                onChange={changeInput}
                name="password"
                className="border-none focus:outline-none w-full text-sm"
                type="password"
              />
            </div>
            <ErrorForm value={errors?.password} />

          </div>
          <div className="w-full grid mt-6">
            <BtnPrimary value="Ingresar" type="buttom" typeBol="blue" click={submitInput} active={true} />
          </div>
        </section>
      </div>
    </div>
  )
}
export default PageLogin;