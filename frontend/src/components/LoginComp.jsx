import { useState } from "react"
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import axios from "axios";
import { Typography, Button, Input } from "@material-tailwind/react";

function LoginComp({toggleLogin}) {
  const [userData, setUserData] = useState({email: "", password: ""});
  const [serverResponse, setServerResponse] = useState('');
  const {setAuth} = useAuth();
  const navigate = useNavigate();
  const [msgColor, setMsgColor] = useState('black');

  const onChangeHandler = (e) => {
    setUserData({...userData, [e.target.name]: e.target.value});
    setServerResponse('');
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {  
        const res = await axios.post('/login', userData)
        await setAuth({ ...res.data })       
        navigate('/')
        setUserData({email:'', password: ''})
    } catch (error) {
        setMsgColor('red')
        
        if (Object.hasOwnProperty.call(error.response, 'data')) {
            setServerResponse(error.response.data.message)
        } else if (Object.hasOwnProperty.call(error, 'response')) {
            setServerResponse(`Server responded with error code ${error.response?.status}` )
        } else {
            console.log(error)
        }        
    }
}

  return (
    <div className="flex flex-col items-center justify-center">
      <Typography color="gray" className=" font-normal text-center">
            Enter your account details to login
        </Typography>
        <form className="mt-2 mb-2 w-80 max-w-screen-lg sm:w-96" onSubmit={handleLogin}>
            <div className="mb-4 flex flex-col gap-6">
            <Input required  label="Email" name="email" onChange={onChangeHandler} value={userData.email} />
            <Input required type="password"  label="Password" name="password" onChange={onChangeHandler} value={userData.password}/>
            </div>            

            <Typography className="font-extralight text-center" variant="small" color={msgColor}>{serverResponse}</Typography>
            <Button className="mt-6" fullWidth type="submit">
            Sign In
            </Button>
            <Typography color="gray" className="mt-4 text-center font-normal">
            Don&apos;t have an account?{" "}
            <a
                href="#"
                className="font-medium text-blue-500 transition-colors hover:text-blue-700"
                onClick={() => toggleLogin()}
            >
                Register
            </a>
            </Typography>
        </form>
    </div>
  )
}

export default LoginComp