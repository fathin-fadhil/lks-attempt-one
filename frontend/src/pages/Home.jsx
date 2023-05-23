import { Card, Typography, Input, Button, CardBody } from "@material-tailwind/react"
import NavbarComp from "../components/NavbarComp"
import { VscNewFile } from "react-icons/vsc";
import ReactPaginate from 'react-paginate'
import { useState, useEffect } from "react";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import axios from "axios";

function Home() {
  const [parent] = useAutoAnimate({duration: 300})
  const { auth } = useAuth()
  const navigate = useNavigate()

  const [forms, setForms] = useState([])
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0)
  const [totalPage, setTotalPage] = useState(1)
  const [isEmpty, setIsEmpty] = useState(false)

  const goToForm = (formIndex) => {
    const formId = forms[formIndex].id
    console.log("🚀 ~ file: Home.jsx:24 ~ goToForm ~ formId:", formId)    
    navigate(`/form/${formId}`)
  }
  
  useEffect(() => {
    handleSearch()
  }, [page])

  const handleSearch = async () => {
    try {
      const res = await axios.get('/api/forms', {
        params: {
          searchQuery: search,
          page,
          size: 10
        }
      })
      console.log("🚀 ~ file: Home.jsx:40 ~ handleSearch ~ res:", res)

      setForms(res.data.formsArray)
      res.data.formsArray.length === 0 
        ? setIsEmpty(true)
        : setIsEmpty(false)
        
      setTotalPage(res.data.totalPages)
    } catch (error) {
      console.log("🚀 ~ file: Home.jsx:42 ~ handleSearch ~ error:", error)      
    }
  }

  const changePage = ({selected}) => {
    setPage(selected)
  }

  const createNewForm = () => {
    navigate('/form/new')
  }
  

  return (
    <>
      <NavbarComp />

      <div className=" flex flex-col h-full items-center bg-blue-gray-50">
        <Typography variant="h2" className=" my-4">Buat Kuesioner</Typography>
        <div className="  w-full pt-5 flex items-center justify-center">
          <div onClick={createNewForm} className="hover:cursor-pointer rounded-xl border-4 w-fit border-gray-500 p-3 border-dashed hover:shadow-lg transit">
            <VscNewFile className="text-gray-700 text-center text-5xl hover:text-blue-700 transition-colors duration-200" size={100} />
          </div>
        </div>

        <Typography variant="h2" className=" mt-4 mb-1">Telusuri Kuesioner</Typography>

        <Card shadow={false} className=" drop-shadow-xl w-full max-w-5xl ">
            <div className=' pt-6 px-6'>
              <div className="relative flex w-full max-w-[40rem] mx-auto" >
                <Input
                    type="text"
                    label="Search"
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
                    onClick={handleSearch}
                    id='searchBtn'
                >
                    Cari
                </Button>
              </div>
            </div>

              <div className= {`${isEmpty ? '' : 'hidden'} -mb-5 my-5 text-center`}>
                  <p className=' text-xl'>
                    No forms found
                  </p>
              </div>

            <CardBody ref={parent} className= {`  grid grid-cols-1 md:grid-cols-2 gap-4`}>

              {
                forms?.map((form, index) => (
                (
                  <div key={index} onClick={() => goToForm(index)} className=" flex flex-col justify-end min-h-[9rem] bg-white h-full cursor-pointer w-full hover:border-blue-400 transition-all hover:shadow-lg duration-300 border-2 rounded-lg border-gray-500 p-2 ">
                    <div className="">
                      <Typography className="text-sm md:text-lg py-1 font-bold text-black">{form.formTitle}</Typography>
                      <p className="text-sm md:text-md text-gray-900 line-clamp-3 h-fit break-words" >
                        {form.formDescription}
                      </p>
                    </div>
                    <p className=" mt-auto text-sm">
                    • {form.createdByUserName}
                    </p>
                  </div>
                )
                ))
              }

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
          </Card>
      </div>
    </>
  )
}

export default Home