import { Typography, Card, CardBody,Button, Input,  Dialog, DialogBody, Spinner} from "@material-tailwind/react";
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

function FormTable() {
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()

  const [formsArray, setFormsArray] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [isEmpty, setIsEmpty] = useState(false)
  const [totalPage, setTotalPage] = useState(1)

  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(null)
  const [isWarn, setIsWarn] = useState(null)
  const [isDeleteWarning, setIsDeleteWarning] = useState(false)
  const [formIdToBeDeleted, setFormIdToBeDeleted] = useState(0)

  const getForms = async () => {
    try {
      const res = await axiosPrivate.get('/api/forms', {
        params: {
          searchQuery: search,
          page,
          size: 10
        }
      })

      setFormsArray(res.data.formsArray) 
      res.data.formsArray.length === 0 
        ? setIsEmpty(true)
        : setIsEmpty(false)

      setTotalPage(res.data.totalPages)
      
    } catch (error) {
      alert('Error retriving data: ' + error)
    }
    
  }

  const changePage = ({selected}) => {
    setPage(selected)
  }

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

  useEffect(() => {
    getForms()
  }, [page])


  return (
    <>
      <Card className=" w-full max-w-5xl">
        <div className=' pt-6 px-6 flex justify-center align-middle gap-3'>
          <div className="relative flex w-full max-w-[32rem] " >
            <Input
                type="text"
                label="Cari"
                value={search}                
                onChange={(event) => {setSearch(event.target.value)}}
                className="pr-20"
                id='input'
                containerProps={{
                className: "min-w-0"                       
                }}
            />
            <Button
                size="sm"
                color="blue"
                className="!absolute right-1 top-1 rounded capitalize"
                onClick={getForms}
                id='searchBtn'
            >
                Cari
            </Button>
          </div>
          <Button size="sm" className=" h-9 my-auto hidden md:block" onClick={ () => {navigate('/form/new')}}>+ Buat Kuis</Button>
          <Button size="sm" className=" h-9 my-auto block md:hidden" onClick={ () => {navigate('/form/new')}}>+</Button>
        </div>

            <CardBody className=" flex justify-center flex-col gap-5">
                <div className="relative overflow-x-auto sm:rounded-lg max-w-5xl w-full border-2 border-gray-200">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 ">
                        <thead className=" text-gray-700 bg-blue-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                <Typography className='font-semibold text-black text-md'>ID</Typography> 
                                </th>
                                <th scope="col" className="px-6 py-3">
                                <Typography className='font-semibold text-black text-md'>Title</Typography> 
                                </th>
                                <th scope="col" className="px-6 py-3">
                                <Typography className='font-semibold text-black text-md'>Dibuat Oleh</Typography> 
                                </th>
                                <th scope="col" className="px-6 py-3">
                                <Typography className='font-semibold text-black text-md'>Dibuat Pada</Typography> 
                                </th>
                                <th scope="col" className="px-6 py-3">
                                <Typography className='font-semibold text-black text-md'>Anonim</Typography> 
                                </th>
                                <th scope="col" className="px-6 py-3 ">
                                <Typography className='font-semibold text-black text-md'>Lihat Hasil</Typography> 
                                </th>
                                <th scope="col" className="px-6 py-3 ">
                                <Typography className='font-semibold text-black text-md'>Action</Typography> 
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {formsArray.map((form, index) => (
                                <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600" key={index}>
                                  <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                      {form.id}
                                  </th>
                                  <td scope="row" className="px-6 py-4 ">
                                      {form.formTitle}
                                  </td>
                                  <td className="px-6 py-4">
                                      {form.createdByUserName}
                                  </td>
                                  <td className="px-6 py-4">
                                      {(new Date(form.createdAt)).toLocaleString()}
                                  </td>
                                  <td className="px-6 py-4">
                                      {form.isAnonymous ? 'Ya' : 'Tidak'}
                                  </td>
                                  <td className="px-6 py-4 ">
                                      <a href="" tabIndex={0} className=" cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2" onClick={() => {navigate(`/form/${form.id}/result`)}}>Hasil</a>                                      
                                  </td>
                                  <td className="px-6 py-4 ">
                                      <a  tabIndex={0} className=" cursor-pointer font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2" onClick={() => {navigate(`/form/${form.id}/edit`)}}>Edit</a>
                                      <a  tabIndex={0} className=" cursor-pointer font-medium text-red-600 dark:text-red-500 hover:underline" onClick={() => {setIsWarn(true);setIsDeleteWarning(true); setDialogOpen(true); setFormIdToBeDeleted(form.id);setDialogMessage('Apakah anda yakin ingin menghapus form ini?')}} >Delete</a>
                                  </td>
                                </tr>                                 
                              )) 
                            }                           
                        </tbody>
                    </table>
                </div>                  
            </CardBody>

            <div className='flex justify-center mb-5 h-fit'>
                <ReactPaginate previousLabel='<' nextLabel=">" pageCount={totalPage} onPageChange={changePage} initialPage={0}
                    containerClassName='inline-flex -space-x-px h-fit'
                    activeLinkClassName='px-3 py-2 text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white'
                    previousLinkClassName='px-3 py-2 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    pageLinkClassName='px-3 py-2 leading-tight text-gray-500  border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'
                    nextLinkClassName='px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white'                    
                    pageClassName='h-fit'
                ></ReactPaginate>
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
        </Card>
    </>
  )
}

export default FormTable