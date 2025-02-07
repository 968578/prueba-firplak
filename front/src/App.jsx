// React
import { Routes, Route } from "react-router-dom"

// Paginas
import PageFormCita from './pages/p-form-cita'
import PageListCitas from './pages/p-list-citas'
import PageLogin from "./pages/p-login"
import PageDetailsCitas from "./pages/p-details"

function App() {

  return (
    <>
      <Routes>
        <Route path='/' element={< PageLogin />} />
        <Route path='/list' element={< PageListCitas />} />
        <Route path='/add' element={<PageFormCita />} />
        <Route path='/:id' element={<PageDetailsCitas />} />
      </Routes>
    </>
  )
}

export default App
