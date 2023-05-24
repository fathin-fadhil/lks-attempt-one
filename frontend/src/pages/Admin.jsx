import { useState } from "react"
import NavbarComp from "../components/NavbarComp"
import { Tabs, TabsHeader, Typography, Tab, TabsBody, TabPanel } from "@material-tailwind/react"
import { UserGroupIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import UsersTable from "../components/UsersTable";


function Admin() {
  const [isInUsersTab, setIsInUsersTab] = useState(true)

  return (
    <>
      <NavbarComp />

      <div className="flex flex-col items-center w-full h-screen bg-blue-gray-50">
        <div>
          <Typography className=" text-black font-bold text-3xl pt-6" variant='h1'>Admin Dashboard</Typography>
          <hr className=" w-28 mx-auto bg-blue-500 h-2" />
        </div>

        <div className="w-full h-screen mt-4">
          <Tabs value='Users' className="">
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
              <TabPanel value={'Users'} className=" w-full flex justify-center">
                <UsersTable />
              </TabPanel>
              <TabPanel value={'Kuesioner'}>
                kuesioner
              </TabPanel>
            </TabsBody>
          </Tabs>
        </div>
      </div>
    </>
  )
}

export default Admin