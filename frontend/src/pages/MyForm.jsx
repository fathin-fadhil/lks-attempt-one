import { useEffect, useState } from "react";
import NavbarComp from "../components/NavbarComp"
import { Card, CardBody, Typography, Dialog, DialogBody, Button, Spinner } from "@material-tailwind/react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";

import { ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

function MyForm() {
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()

  const [formsArray, setFormsArray] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(null)
  const [isWarn, setIsWarn] = useState(null)
  const [isDeleteWarning, setIsDeleteWarning] = useState(false)
  const [formIdToBeDeleted, setFormIdToBeDeleted] = useState(0)

  const getForms = async () => {
    try {
      const res = await  axiosPrivate.get("/api/userforms");
      setFormsArray(res.data.formsArray);
    } catch (error) {
      console.log("🚀 ~ file: MyForm.jsx:27 ~ getForms ~ error:", error)
      alert('Gagal terhubung ke server')
    }
  }

  useEffect(() => {
    getForms()
  }, [])

  const handleDeleteForm = async (formId) => {
    setDialogMessage('Deleting form...')
    setIsDeleteWarning(false)
    setDialogOpen(true)
    setIsSuccess(null)
    setIsWarn(null)
    try {
      setIsLoading(true)
      await axiosPrivate.delete(`/api/forms/${formId}`)
      setIsSuccess(true)
      setDialogMessage('Form berhasil dihapus')
    } catch (error) {
      setIsWarn(true)
      setDialogMessage(`Form gagal dihapus: HTTP Error ${error.response.status} ${error.response.statusText}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <NavbarComp />

      <div className=" bg-blue-gray-50 min-h-full h-fit w-full flex flex-col items-center p-2">
        <Typography variant="h2" className=" my-4">Kuesionerku</Typography>
        <Card shadow={false} className=" shadow-md w-full max-w-5xl ">
          <CardBody className='w-full flex flex-col'>
            <div  className=" relative overflow-x-auto sm:rounded-lg max-w-5xl w-full border-2 border-gray-200">              
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
                <thead className="text-xs  bg-blue-gray-50 dark:bg-gray-700 ">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                          <Typography className='font-semibold text-black'>ID</Typography> 
                        </th>
                        <th scope="col" className="px-6 py-3">
                          <Typography className='text-black font-semibold'>Judul Kuis</Typography> 
                        </th>
                        <th scope="col" className="px-6 py-3">
                          <Typography className='text-black font-semibold'>Dibuat</Typography> 
                        </th>
                        <th scope="col" className="px-6 py-3">
                          <Typography className='text-black font-semibold'>Anonim</Typography> 
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          <Typography className='text-black font-semibold'>Hasil</Typography> 
                        </th>
                        <th scope="col" className="px-6 py-3 ">
                          <Typography className='text-black font-semibold'>Action</Typography> 
                        </th>
                    </tr>
                </thead>
                <tbody > 
                    {formsArray.map((form, index) => (
                        <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600" key={index}>
                          <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                            <Typography className='text-black'>{form?.id}</Typography>                              
                          </th>
                          <td scope="row" className="px-6 py-4 ">
                            <Typography className='text-gray-800'>{form.formTitle}</Typography>  
                          </td>
                          <td className="px-6 py-4">
                            <Typography className='text-gray-800'>{(new Date(form?.createdAt)).toLocaleString('id-ID')}</Typography>
                          </td>
                          <td className="px-6 py-4">
                            <Typography className='text-gray-800'>{form?.isAnonymous ? 'Ya' : 'Tidak'}</Typography>
                          </td>
                          <td className="px-6 py-4 ">
                              <a href="" className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2" onClick={() => {navigate(`/form/${form.id}/result`)}}>Lihat Hasil</a>
                          </td>
                          <td className="px-6 py-4 ">
                              <a href="" className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2" onClick={() => {navigate(`/form/${form.id}/edit`)}}>Edit</a>
                              <a  className="font-medium text-red-600 dark:text-red-500 hover:underline hover:cursor-pointer" tabIndex={0} onClick={() => {setIsWarn(true);setIsDeleteWarning(true); setDialogOpen(true); setFormIdToBeDeleted(form.id);setDialogMessage('Apakah anda yakin ingin menghapus form ini?')}} >Delete</a>
                          </td>
                        </tr>                                 
                      )) 
                    }                           
                </tbody>
              </table>
            </div>

            <Button size="sm" className="mx-auto my-4" onClick={() => {navigate('/form/new')}}>+ Buat Kuesioner baru</Button>

          </CardBody>
        </Card>
      </div>

      <Dialog open={dialogOpen} className="w-full max-w-lg md:max-w-2xl -m-4">
          <DialogBody className=" flex flex-col items-center gap-3">
            {isLoading && <Spinner className=" w-14 h-14" />}

            {isSuccess &&<CheckCircleIcon className=" text-green-500 w-14 h-14" />}
            {isWarn && <ExclamationTriangleIcon className=" text-red-500 w-14 h-14" />}
            <Typography className=" text-blue-gray-900">{dialogMessage}</Typography>

            {!isLoading && !isDeleteWarning &&
              <Button onClick={()=> {setDialogOpen(false); getForms()}}>OK</Button>          
            }
            {
              isDeleteWarning && 
              <div className=" flex flex-row gap-4">
                <Button onClick={()=> {setDialogOpen(false); setDialogMessage(''); setIsDeleteWarning(false)}}  variant="outlined" size="sm">Cancel</Button>
                <Button onClick={() => {setIsWarn(null); handleDeleteForm(formIdToBeDeleted)}} color='red'>Hapus</Button>
              </div>
            }
          </DialogBody>      
        </Dialog>
    </>
  )
}

export default MyForm