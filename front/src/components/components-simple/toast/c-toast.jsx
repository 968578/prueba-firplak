import { createContext, useContext } from "react";

export const ToastContext = createContext();

export const ToastComponent = () => { 

  const {
    alertOperation,
    setAlertOperation
  } = useContext(ToastContext);


  const closeAlterOk = () => {
    setAlertOperation({
      ...alertOperation,
      show: false
    });
  }

  return (
    <div className={" bg-slate-800 fixed  right-1/3 flex p-1 gap-x-3 rounded duration-200 -top-8 z-20 " + (alertOperation?.show ? "translate-y-12" : "")}>
      <p className="font-Oswald text-white">
        {alertOperation?.msj}
      </p>
      <p onClick={closeAlterOk} className="font-bold text-white cursor-pointer">
        X
      </p>
    </div>
  )
}

