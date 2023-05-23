import useRefreshToken from "../hooks/useRefreshToken";
import useAuth from "../hooks/useAuth";
import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

function PersistLogin() {
  const [isLoading, setisLoading] = useState(true)
  const { auth } = useAuth()
  const refresh = useRefreshToken()

  useEffect(() => {
    const verifyRefreshToken = async () => {
      try {
        await refresh()      
      } catch (error) {        
      console.log("🚀 ~ file: PersistLogin.jsx:16 ~ verifyRefreshToken ~ error:", error)
      } finally {
        setisLoading(false)
      }
    }
    
    !auth?.accessToken ? verifyRefreshToken() : setisLoading(false)      
  }, [])

  return (
    <>
      {
        isLoading
        ? <p>Loading...</p>
        : <Outlet />
      }
    </>
  )
}

export default PersistLogin