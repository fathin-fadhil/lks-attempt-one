import { BrowserRouter, Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import Auth from "./pages/Auth"
import PersistLogin from "./components/PersistLogin"
import Signout from "./pages/Signout"

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/signout" element={<Signout />} />

        <Route element={<PersistLogin />}>
          <Route path="/" element={<Home />} />

        </Route>        
      </Routes>
    </BrowserRouter>
  )
}

export default App
