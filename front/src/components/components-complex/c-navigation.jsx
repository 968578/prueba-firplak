// React
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";


/**
 * @fecha 2025-02-03
 * @autor Omar Echavarria
 * @descripcion Este componente muestra una barra de navegación que contiene enlaces a dos páginas principales: 
 * "Listar" y "Agregar". Además, muestra el nombre del usuario actualmente autenticado (extraído del token en el 
 * `localStorage`) y un botón para cerrar sesión. Al hacer clic en el botón de cerrar sesión, el token se elimina 
 * del `localStorage` y el usuario es redirigido a la página principal. Si no se encuentra un token válido, 
 * el usuario es automáticamente desconectado y redirigido a la página de inicio.
 * 
 * @returns {JSX.Element} - Retorna la barra de navegación con enlaces y el botón de cerrar sesión.
 */
const CNavigation = () => {

  // Estados
  const [userLogged, setUserLogged] = useState(null);
  
  // Navegar
  const navigate = useNavigate();


  /**
 * @fecha 2025-02-03
 * @autor Omar Echavarria
 * @descripcion Esta función cierra la sesión del usuario eliminando el token almacenado en el `localStorage` 
 * y redirige al usuario a la página principal ("/"). 
 * Esto asegura que la sesión del usuario se termine correctamente y se le redirija fuera del sistema.
 * 
 * @param {void} - No recibe parámetros.
 * @returns {void} - No retorna ningún valor.
 */
  const closeSession = () => {
    window.localStorage.removeItem("token-firplak");
    navigate("/");
  }


  /**
 * @fecha 2025-02-03
 * @autor Omar Echavarria
 * @descripcion Este efecto se ejecuta cuando el componente se monta. Su función principal es verificar si el usuario 
 * está autenticado revisando el token almacenado en el `localStorage`. Si el token no está presente o si el token no 
 * contiene la propiedad `user`, se cierra la sesión del usuario y se redirige al inicio. Si el token es válido, se 
 * extrae el usuario del token y se guarda en el estado `userLogged`.
 * 
 * @param {void} - No recibe parámetros.
 * @returns {void} - No retorna ningún valor.
 */
  useEffect(() => {
    const user = window.localStorage.getItem("token-firplak");
    if (!user) {
      return closeSession();
    }
    const userParse = JSON.parse(user);
    
    if (!userParse?.user) {
      return closeSession();
    }
    setUserLogged(userParse.user);
  }, []);


  return (
    <div className="bg-slate-200 border h-14 flex items-center gap-x-2 pr-10">
      <div className="flex-1 flex gap-x-2 justify-center items-center">
        <Link to="/list">
          <div className="bg-blue-100 border border-black p-2 rounded-md hover:bg-blue-200 duration-150">
            Listar
          </div>
        </Link>
        <Link to="/add">
          <div className="bg-blue-100 border border-black p-2 rounded-md hover:bg-blue-200 duration-150">
            Agregar
          </div>
        </Link>
      </div>
      <div className="flex items-center justify-center gap-x-3">
        <p className="border-b border-slate-400 ">{userLogged}</p>
        <div onClick={closeSession} className="border border-red-500 p-2 rounded-md text-red-500 cursor-pointer hover:bg-red-50 duration-150">
          Cerrar sesión
        </div>
      </div>
    </div>
  )
}

export default CNavigation;