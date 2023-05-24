import { Card, CardBody, Typography, Dialog, DialogBody, DialogFooter, Button, Input, DialogHeader, Radio, Spinner } from "@material-tailwind/react"
import { useEffect, useState } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

function UsersTable() {
    const axiosPrivate = useAxiosPrivate()

    const [usersArray, setUsersArray] = useState([]);
    const [userEditDialog, setUserEditDialog] = useState(false)
    const [editedUserData, setEditedUserData] = useState({})
    const [statusDialog, setStatusDialog] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isWarn, setIsWarn] = useState(null)
    const [isSuccess, setisSuccess] = useState(null)
    const [isDeleteWarning, setIsDeleteWarning] = useState(false)
    const [dialogMessage, setDialogMessage] = useState('')
    const [userIdToBeDeleted, setUserIdToBeDeleted] = useState(0)

    const [newUserDialog, setNewUserDialog] = useState(false)
    const [newUserData, setNewUserData] = useState({name: '', email: '', is_admin: false, password: ''})
    const [newUserMessage, setNewUserMessage] = useState('')

    const getUsers = async () => {
        try {
            const res = await axiosPrivate.get('/users')
            console.log("🚀 ~ file: UsersTable.jsx:14 ~ getUsers ~ res:", res)
            setUsersArray(res.data.usersArray)
        } catch (error) {
            console.log("🚀 ~ file: UsersTable.jsx:15 ~ getUsers ~ error:", error)
            alert('error while retriving data')
        }
    }

    useEffect(() => {
        getUsers()
    }, [])

    const onEditedUserChange = (e) => {
        setEditedUserData({ ...editedUserData, [e.target.name]: e.target.value })
    }

    const onNewUserChange = (e) => {
        setNewUserData({ ...newUserData, [e.target.name]: e.target.value })    
    }

    const handleEditDialog = (index) => {
        setEditedUserData({...usersArray[index] })
        setUserEditDialog(true)
    }

    const handleDeleteConf = (userId) => {
        setisSuccess(false)
        setUserIdToBeDeleted(userId)
        setIsWarn(true)
        setStatusDialog(true)
        setIsDeleteWarning(true)
        setDialogMessage('Apakah anda yakin ingin menghapus user ini? Ini akan menghapus semua Kuesioner dari user ini beserta semua jawabannya')
    }

    const handleDeleteUser = async () => {
        console.log(userIdToBeDeleted)
        setIsWarn(false)
        setIsLoading(true)
        setIsDeleteWarning(false)
        setDialogMessage('Deleting...')
        try {
            await axiosPrivate.delete(`/users/${userIdToBeDeleted}`)
            setIsWarn(false)
            setisSuccess(true)
            setDialogMessage('Deleted successfully')
            getUsers()
        } catch (error) {
            setIsWarn(true)
            setDialogMessage(`Error while deleting: HTTP Error ${error.response.status} ${error.response.statusText}`)        
        } finally {
            setIsLoading(false)
        }
    }

    const handleEditUser = async () => {
        setisSuccess(false)
        setIsWarn(false)
        console.log(editedUserData)
        setUserEditDialog(false)        
        setIsLoading(true)
        setStatusDialog(true)
        setDialogMessage('Editing...')
        try {
            const res = await axiosPrivate.put('/users', editedUserData)
            console.log("res:", res)
            setisSuccess(true)
            setDialogMessage('Edited successfully')
            getUsers()
        } catch (error) {
            setIsWarn(true)
            setDialogMessage(`Error while editing: HTTP Error ${error.response.status} ${error.response.statusText}`)
        } finally {
            setIsLoading(false)
            setisSuccess(false)
            setIsWarn(false)
        }
    }

    const handleAddUser = async () => {
        console.log(newUserData)
        if (!newUserData.name || !newUserData.email || !newUserData.password) {
            setNewUserMessage('Semua Input wajib diisi')
            return
        } else {
            setNewUserMessage('')
        }
        
        try {
            const res = await axiosPrivate.post('/users', newUserData)
            setDialogMessage(res.data.message)
            setStatusDialog(true)
            setisSuccess(true)
            getUsers()
        } catch (error) {
            setDialogMessage(error.response.data.message)
            setStatusDialog(true)
            setIsWarn(true)
        } 
        
    }

  return (
    <>
        <Card className=" w-full max-w-5xl">
            <CardBody className=" flex justify-center flex-col gap-5">
                <div className="relative overflow-x-auto sm:rounded-lg max-w-5xl w-full border-2 border-gray-200">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
                        <thead className=" text-gray-700 bg-blue-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                <Typography className='font-semibold text-black text-md'>ID</Typography> 
                                </th>
                                <th scope="col" className="px-6 py-3">
                                <Typography className='font-semibold text-black text-md'>Nama</Typography> 
                                </th>
                                <th scope="col" className="px-6 py-3">
                                <Typography className='font-semibold text-black text-md'>Email</Typography> 
                                </th>
                                <th scope="col" className="px-6 py-3">
                                <Typography className='font-semibold text-black text-md'>Admin</Typography> 
                                </th>
                                <th scope="col" className="px-6 py-3 ">
                                <Typography className='font-semibold text-black text-md'>Action</Typography> 
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersArray.map((user, index) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                      {user.id}
                                  </th>
                                  <td scope="row" className="px-6 py-4 ">
                                      {user.name}
                                  </td>
                                  <td className="px-6 py-4">
                                      {user.email}
                                  </td>
                                  <td className="px-6 py-4">
                                      {user.is_admin ? 'Ya' : 'Tidak'}
                                  </td>
                                  <td className="px-6 py-4 ">
                                      <a  tabIndex={0} className=" cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2" onClick={() => {handleEditDialog(index)}}>Edit</a>
                                      <a  tabIndex={0} className=" cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline" onClick={() => {handleDeleteConf(user.id)}} >Delete</a>
                                  </td>
                                </tr>                                 
                              )) 
                            }                           
                        </tbody>
                    </table>
                </div>  
                <Button size="sm" className=" mx-auto" onClick={ () => {setNewUserDialog(true); setNewUserData({name: '', email: '', is_admin: false, password: ''})}}>+ Tambah User</Button>
            </CardBody>
        </Card>

        <Dialog open={userEditDialog} size="xxl" handler={() => {setUserEditDialog(!userEditDialog)}} className="flex flex-col justify-center p-4">
          <DialogHeader className="text-center inline">Edit User</DialogHeader>

          <DialogBody className=" grid grid-cols-1 md:grid-cols-2  self-center w-full xl:w-2/3">
            <div className="p-2">
              <Typography>User ID</Typography>
              <Input value={editedUserData.id} disabled name="id" ></Input>
            </div>
            <div className="p-2">
              <Typography>User Email</Typography>
              <Input value={editedUserData.email} disabled name="email" ></Input>
            </div>
            <div className="p-4">              
              <Input label='User Name' variant="static" placeholder="Name" value={editedUserData.name} name="name" onChange={onEditedUserChange}></Input>
            </div>
            <div className="p-4">  
                <Typography className>Role</Typography>
                <div className="flex gap-10">
                    <Radio id="html" name="role" label="Admin" value={true} checked={editedUserData.is_admin} onChange={() => {setEditedUserData(prev => ({...prev, is_admin: true}))}} />
                    <Radio id="react" name="role" label="User" value={false} checked={!editedUserData.is_admin} onChange={() => {setEditedUserData(prev => ({...prev, is_admin: false}))}} />
                </div>     
            </div>

          </DialogBody>

          <DialogFooter className=" justify-center">
            <Button variant="text" color="red" onClick={() => setUserEditDialog(!userEditDialog)} className="mr-1">
              <span>Cancel</span>
            </Button>
            <Button variant="gradient" color="blue" onClick={() => handleEditUser()}>
              <span>Confirm</span>
            </Button>
          </DialogFooter>
        </Dialog>

        <Dialog open={newUserDialog} size="xxl" handler={() => {setNewUserDialog(!newUserDialog)}} className="flex flex-col justify-center p-4">
          <DialogHeader className="text-center inline">New User</DialogHeader>

          <DialogBody className=" grid grid-cols-1 md:grid-cols-2  self-center w-full xl:w-2/3">
            <div className="p-4">
              <Input required label='Email' type="email" variant="static" value={newUserData.email} placeholder="Email" name="email" onChange={onNewUserChange}></Input>
            </div>
            <div className="p-4">              
              <Input required label='Nama Lengkap' variant="static" placeholder="Nama" value={newUserDialog.name} name="name" onChange={onNewUserChange}></Input>
            </div>
            <div className="p-4">  
                <Typography className>Role</Typography>
                <div className="flex gap-10">
                    <Radio id="html" name="role" label="Admin" value={true} checked={newUserData.is_admin} onChange={() => {setNewUserData(prev => ({...prev, is_admin: true}))}} />
                    <Radio id="react" name="role" label="User" value={false} checked={!newUserData.is_admin} onChange={() => {setNewUserData(prev => ({...prev, is_admin: false}))}} />
                </div>     
            </div>
            <div className="p-4">              
              <Input required label='Password' variant="static" type="password" placeholder="password" value={newUserDialog.password} name="password" onChange={onNewUserChange}></Input>
            </div>

          </DialogBody>

          <DialogFooter className=" flex flex-col justify-center">
            <div className=" mb-4">
                <Button variant="text" color="red" onClick={() => {setNewUserData({name: '', email: '', is_admin: false, password: ''});setNewUserDialog(!newUserDialog)}} className="mr-1">
                <span>Cancel</span>
                </Button>
                <Button variant="gradient" color="blue" onClick={() => handleAddUser()}>
                <span>create</span>
                </Button>
            </div>
            <Typography className=" text-center">{newUserMessage}</Typography>
          </DialogFooter>
        </Dialog>

        <Dialog open={statusDialog} className="w-full max-w-lg md:max-w-2xl -m-4">
            <DialogBody className=" flex flex-col items-center gap-3">
              {isLoading && <Spinner className=" w-14 h-14" />}

              {isSuccess &&<CheckCircleIcon className=" text-green-500 w-14 h-14" />}
              {isWarn && <ExclamationTriangleIcon className=" text-red-500 w-14 h-14" />}
              <Typography className=" text-blue-gray-900 text-center">{dialogMessage}</Typography>

              {!isLoading && !isDeleteWarning &&
                <Button onClick={()=> setStatusDialog(false)}>OK</Button>          
              }
              {
                isDeleteWarning && !isLoading && 
                <div className=" flex flex-row gap-4">
                  <Button onClick={()=> {setStatusDialog(false); setDialogMessage(''); setIsDeleteWarning(false)}} variant="outlined" size="sm">Cancel</Button>
                  <Button onClick={() => {setIsWarn(null); handleDeleteUser()}} color='red'>Hapus</Button>
                </div>
              }
            </DialogBody>      
          </Dialog>
    </>
  )
}

export default UsersTable