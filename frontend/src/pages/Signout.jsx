import { useEffect } from "react";
import useAuth from "../hooks/useAuth"
import { useNavigate } from "react-router-dom";
import axios from "axios";

function Signout() {
    const navigate = useNavigate()
    const { auth, setAuth } = useAuth()

    useEffect(() => {
        const signout = async () => {
            axios.post('/logout', {email: auth?.userEmail}, { withCredentials: true })
            setAuth({})
            navigate('/')
        }

        signout()
    }, [])

  return (
    <div>Signing out...</div>
  )
}

export default Signout