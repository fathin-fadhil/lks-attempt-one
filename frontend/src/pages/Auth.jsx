import { Card, CardBody, CardHeader, Tab, TabPanel, Tabs, TabsBody, TabsHeader, Typography } from "@material-tailwind/react";
import { useState } from "react";
import LoginComp from "../components/LoginComp";
import RegisterComp from "../components/RegisterComp";

function Auth() {
  const [isLoginSelected, setIsLoginSelected] = useState(true)

  const toggleLogin = () => {
    if (isLoginSelected) {
      document.getElementById('registerTab').click()
    } else {
      document.getElementById('loginTab').click()
    }
  }

  return (
    <div className=" flex flex-col items-center h-full justify-center  sm:bg-blue-gray-50">
      <Card shadow={false} className=" sm:shadow-md w-full sm:w-fit">
        <CardHeader shadow={false} floated={false} className="bg-white sm:bg-gradient-to-br sm:from-blue-300 sm:to-blue-500 m-0 grid place-items-center rounded-b-none sm:p-8 px-4 text-center">
          <Typography variant='h2' className=" text-black sm:text-white">
            Login Or Register
          </Typography>
        </CardHeader>
        <CardBody>
          <Tabs value='login'>
            <TabsHeader className=" max-w-[15rem] sm:max-w-sm mx-auto">
              <Tab id="loginTab" value={'login'} onClick={() => {setIsLoginSelected(true)}}>Login</Tab>
              <Tab id="registerTab" value={'register'} onClick={() => {setIsLoginSelected(false)}}>Register</Tab>
            </TabsHeader>
            <TabsBody className=" mx-auto">
              <TabPanel key={'login'} value={'login'}>
                <LoginComp toggleLogin={toggleLogin}/>
              </TabPanel>
              <TabPanel key={'register'} value={'register'}>
                <RegisterComp toggleLogin={toggleLogin} />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </CardBody>
      </Card>
    </div>
  )
}

export default Auth