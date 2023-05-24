import { useState } from "react"
import NavbarComp from "../components/NavbarComp"
import { Tabs, TabsHeader, Typography, Tab, TabsBody, TabPanel } from "@material-tailwind/react"
import { UserGroupIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import UsersTable from "../components/UsersTable";
import FormTable from "../components/FormTable";
import FormGraph from "../components/FormGraph";


function Admin() {
  const [isInUsersTab, setIsInUsersTab] = useState(true)

  return (
    <>
      <NavbarComp />

      <div className="flex flex-col items-center w-full h-fit min-h-full bg-blue-gray-50">
        <div>
          <Typography className=" text-black font-bold text-3xl pt-6" variant='h1'>Admin Dashboard</Typography>
          <hr className=" w-28 mx-auto bg-blue-500 h-2" />
        </div>

        <div className="w-full h-screen mt-4">
          <Tabs value='Users' className=" bg-blue-gray-50">
            <TabsHeader className=" max-w-sm mx-auto bg-blue-gray-100">
              <Tab value="Users" onClick={() => setIsInUsersTab(true)}>
                <div className="flex items-center gap-2">
                  <UserGroupIcon className=" w-5 h-5"></UserGroupIcon>
                  Users
                </div>
              </Tab>
              <Tab value="Kuesioner" onClick={() => setIsInUsersTab(false)}>
                <div className="flex items-center gap-2">
                  <DocumentTextIcon className=" w-5 h-5"></DocumentTextIcon>
                  Kuesioner
                </div>
              </Tab>
            </TabsHeader>
            <TabsBody
              animate={{
                initial: {
                  x: isInUsersTab ? 700 : -700,
                },
                mount: {
                  x: 0,
                },
                unmount: {
                  x: isInUsersTab ? 700 : -700,
                },
              }}
            >
              <TabPanel value={'Users'} className=" bg-blue-gray-50 w-full flex justify-center p-0 my-5">
                <UsersTable />
              </TabPanel>
              <TabPanel value={'Kuesioner'} className=" bg-blue-gray-50 w-full h-full flex flex-col items-center gap-5 justify-center p-2 my-5">
                <FormGraph />
                <FormTable />
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default Admin