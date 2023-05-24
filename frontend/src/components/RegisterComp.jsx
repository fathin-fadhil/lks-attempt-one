import { Input, Typography, Button, Checkbox } from "@material-tailwind/react"
import { useState } from "react"
import { EyeSlashIcon, EyeIcon } from "@heroicons/react/24/outline";
import axios from "axios";


function RegisterComp() {
  const [userData, setUserData] = useState({name: '', email: '', password: '', confPassword: ''})
  const [message, setMessage] = useState('')
  const [msgColor, setMsgColor] = useState('black')
  const [checkbox, setCheckbox] = useState(false)
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfPasswordVisible, setIsConfPasswordVisible] = useState(false)

  const handleRegister = async (e) => {
    e.preventDefault()
    if (!checkbox) {
      return setMessage('You need to agree to our Terms and Conditions')
    }

    try {
      const res = await axios.post('/register', userData)
      setMsgColor('green')
      setMessage(res.data.message)
    } catch (error) {
      setMessage(error.response.data.message)
      setMsgColor('red')
    }
  }

  return (
    <div className=" flex flex-col items-center justify-center">
      <Typography>Enter Your Information To Register</Typography>
      <form onSubmit={handleRegister} className=" mt-4 w-80 mb-2 max-w-screen-lg sm:w-96">
        <div className="flex flex-col mb-4 gap-6">
          <Input required label="Nama Lengkap" name="name" onChange={(e) => setUserData({...userData, name: e.target.value})} value={userData.name}></Input>
          <Input required label="Email" name="email" onChange={(e) => setUserData({...userData, email: e.target.value})} value={userData.email}></Input>

          <div className="relative flex w-full max-w-[24rem] ">
            <Input
                type={isPasswordVisible ? "text" : "password"}
                label="Password"
                name="password"
                value={userData.password}
                onChange={(e) => setUserData({...userData, password: e.target.value})}
                className="pr-20"
                required
                containerProps={{
                className: "min-w-0",
                }}
            />
            <Button
                size="sm"
                color="blue"
                onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                className=" !absolute right-2 rounded-md top-1/2 -my-[14px] px-2 py-1"
            >                        
                {isPasswordVisible ? <EyeSlashIcon className="h-5"/> : <EyeIcon className="h-5"/>}
            </Button>
          </div>
        

          <div className="relative flex w-full max-w-[24rem] ">
            <Input
                type={isConfPasswordVisible ? "text" : "password"}
                label="Confirm Password"
                name="confPassword"
                value={userData.confPassword}
                onChange={(e) => setUserData({...userData, confPassword: e.target.value})}
                className="pr-20"
                required
                containerProps={{
                className: "min-w-0",
                }}
            />
            <Button
                size="sm"
                color="blue"
                onClick={() => {setIsConfPasswordVisible(!isConfPasswordVisible)}}
                className="!absolute right-2 rounded-md top-1/2 -my-[14px] px-2 py-1"
              >
                {isConfPasswordVisible ? <EyeSlashIcon className="h-5"/> : <EyeIcon className="h-5"/>}
            </Button>
          </div>
        </div>

        <Checkbox
          checked={checkbox}
          onChange={() => setCheckbox(!checkbox)}
          containerProps={{className: '-ml-2.5'}}
          label={
            (
              (
                <Typography
                    variant="small"
                    color="gray"
                    className="flex items-center font-normal"
                >
                    I agree the
                    <a
                    href="#"
                    className="font-medium transition-colors hover:text-blue-500"
                    >
                    &nbsp;Terms and Conditions
                    </a>
                </Typography>
                )
            )
          }
        ></Checkbox>

        <Button type="submit" className=" mt-6" fullWidth>Register</Button>
        <Typography color={msgColor} className="mt-2 text-center">{message}</Typography>
      </form>
    </div>
  )
}

export default RegisterComp