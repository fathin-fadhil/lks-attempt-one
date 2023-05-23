import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import PersistLogin from "./components/PersistLogin"
import Signout from "./pages/Signout"
import RequireAuth from "./components/RequireAuth"
import Result from "./pages/Result"
import EditForm from "./pages/EditForm"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/signout" element={<Signout />} />

        <Route element={<PersistLogin />}>
          <Route path="/" element={<Home />} />

          <Route element={<RequireAuth requireAdmin={false} />}>
            <Route path="/form/new" element={<EditForm newForm={true} />} />
            <Route path="/form/:formId/edit" element={<EditForm newForm={false} />} />
            <Route path="/form/:formId/result" element={<Result />} />
          </Route>            

        </Route>        
      </Routes>
    </BrowserRouter>
  )
}

export default App
