import { useEffect, useState } from "react"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useNavigate, useParams } from "react-router-dom"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import useAuth from '../hooks/useAuth'
import useMoveIndex from '../utils/useMoveIndex'
import NavbarComp from "../components/NavbarComp"
import { Card, CardBody, CardFooter, Checkbox, Typography, Input, Button, Dialog, DialogBody, Spinner } from "@material-tailwind/react"
import TextArea from 'react-textarea-autosize'
import MultipleChoiceEdit from "../components/MultipleChoiceEdit"
import genId from "../utils/genId"
import CheckboxEdit from "../components/CheckboxEdit"
import TextInputEdit from "../components/TextInputEdit"

import { HiOutlineChevronUp, HiOutlineChevronDown } from "react-icons/hi";
import { FaTrash } from "react-icons/fa";
import { BiRadioCircleMarked } from "react-icons/bi";
import { MdOutlineCheckBox } from "react-icons/md";
import { BsTextParagraph } from "react-icons/bs";
import { ExclamationTriangleIcon, CheckCircleIcon } from "@heroicons/react/24/outline";


function EditForm({newForm}) {
  const { formId } = useParams()
  
  const axiosPrivate = useAxiosPrivate()
  const [parent] = useAutoAnimate()
  const navigate = useNavigate()
  const { auth } = useAuth()
  const moveIndex = useMoveIndex()

  const [questionArray, setQuestionArray] = useState([])
  const [formDetails, setFormDetails] = useState({isAnonymous: true, formTitle: 'Tanpa Judul', formDescription: 'Deskripsi Kuesioner', formColor: 'blue'})
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(null)
  const [isError, setIsError] = useState(null)


  useEffect(() => {
    const getForm = async () => {
      try {
        const res = await axiosPrivate.get(`/forms/${formId}`)
        setFormDetails({
          isAnonymous: res.data.isAnonymous,
          formTitle: res.data.formTitle,
          formDescription: res.data.formDescription,
          formColor: res.data.formColor || 'blue',
          createdByUserId: res.data.createdByUserId,
          createdByUserName: res.data.createdByUserName
        })
  
        if (!(res.data.createdByUserId !== auth?.userId || auth?.isAdmin)) {
          navigate('/')
        }
        
        setQuestionArray(res.data.formQuestions)        
      } catch (error) {
        console.log("🚀 ~ file: EditForm.jsx:47 ~ getForm ~ error:", error)
        // handle error 
      }
    }

    if(!newForm) {
      getForm()
    }

  }, [])

  const addMultipleChoiceQuestion = () => {
    setQuestionArray([...questionArray, {
      type: 'multipleChoice',
      questionText: 'Pertanyaan Multiple Choice',
      required: false,
      questionId: genId(10),
      choices: [
        'Opsi pilihan ganda 1'
      ]
    }])
  }

  const addCheckboxQuestion = () => {
    setQuestionArray([...questionArray, {
      type: 'checkbox',
      questionText: 'Pertanyaan Checkbox',
      required: false,
      questionId: genId(10),
      choices: [
        'Opsi Checkbox 1'
      ]
    }])
  }

  const addTextInputQuestion = () => {
    setQuestionArray([...questionArray, {
      type: 'textInput',
      questionText: 'Text pertanyaan',
      required: false,
      questionId: genId(10),
    }])
  }

  const moveUp = (questionIndex) => {
    if (questionIndex === 0) {
      return
    }
    setQuestionArray(prev => moveIndex([...prev], questionIndex, questionIndex - 1))
  }

  const moveDown = (questionIndex) => {
    if (questionIndex === questionArray.length -1) {
      return
    }
    setQuestionArray(prev => moveIndex([...prev], questionIndex, questionIndex + 1))
  }

  const deleteQuestion = (questionIndex) => {    
    setQuestionArray(prev => {
      const newArr = [...prev]; 
      newArr.splice(questionIndex, 1); 
      return newArr
    })
  }

  const changeIsRequired = (questionIndex, isRequired) => {
    setQuestionArray(prev => {
      const newArr = [...prev]; 
      newArr[questionIndex].required = isRequired; 
      return newArr
    })
  }

  const handleCancel = () => {
    if (newForm) {
      navigate('/')
    }
  }

  const handleDialogOk = () => {
    if (isError) {
      setDialogOpen(false)
    } 
    if(isSuccess) {
      navigate('/')
    }
  }

  const handleSave = async () => {
    if(questionArray.length === 0){
      setDialogMessage('Pertanyaan tidak boleh kosong')
      setDialogOpen(true)            
      setIsError(true)
      return
    }

    console.log(auth)
    if (newForm) {      
      setIsSuccess(null)
      setIsError(null)
      setIsLoading(true)
      setDialogOpen(true)
      setDialogMessage('Uploading...')
      try {
        await axiosPrivate.post('/api/forms', {...formDetails, formQuestions: [...questionArray]})
        setDialogMessage('Form berhasil di upload')
        setIsSuccess(true)      
      } catch (error) {
        console.log("🚀 ~ file: EditForm.jsx:132 ~ handleSave ~ error:", error)    
        setIsError(true)
        setDialogMessage('Form gagal di upload')    
      } finally{
        setIsLoading(false)
      }
    }

    if (!newForm) {
      setIsSuccess(null)
      setIsError(null)
      setIsLoading(true)
      setDialogOpen(true)
      setDialogMessage('Menyimpan perubahan...')
      try {
        await axiosPrivate.put(`/api/forms/${formId}`, {...formDetails, formQuestions: [...questionArray]})
        setDialogMessage('Form berhasil di update')
        setIsSuccess(true)      
      } catch (error) {
        console.log("🚀 ~ file: EditForm.jsx:132 ~ handleSave ~ error:", error)    
        setIsError(true)
        setDialogMessage('Gagal mengupdate perubahan')    
      } finally{
        setIsLoading(false)
      }
    }
  }

  return (
    <>
      <NavbarComp />

      <div ref={parent} className={` bg-${formDetails.formColor}-50 h-fit min-h-full flex flex-col items-center gap-16 p-3`}>
        <Card shadow={false} className={` shadow-md w-full max-w-5xl border-b-4 border-${formDetails.formColor}-500`}>
          <CardBody className=" flex flex-col gap-5">
            <Input color={formDetails.formColor} style={{fontSize: '1.5rem', fontWeight: 'bold', }} size="lg" value={formDetails.formTitle} onChange={(e) => setFormDetails({...formDetails, formTitle: e.target.value})} label="Judul Form" variant="standard" className=""/>
            <div className="relative w-full min-w-[200px] mt-3">
              <TextArea
                className={`peer h-full w-full resize-none border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-${formDetails.formColor}-500 focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50`}
                placeholder=" "
                onChange={(e) => setFormDetails({...formDetails, formDescription: e.target.value})}
                value={formDetails.formDescription}
                />
              <label className={`after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[13px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-0 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-${formDetails.formColor}-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[13px] peer-focus:leading-tight peer-focus:text-${formDetails.formColor}-500 peer-focus:after:scale-x-100 peer-focus:after:border-${formDetails.formColor}-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500`}>
                Deskripsi
              </label>
          </div> 
          </CardBody>
          
          <CardFooter className=' border-t-2 inline-flex gap-2 p-4'>
            <Checkbox disabled={newForm? false : true} color={formDetails.formColor} value={`Rekam Email User`} checked={!formDetails.isAnonymous} onChange={() => {if(!newForm) return; setFormDetails(prev => {return {...prev, isAnonymous: !prev.isAnonymous}})}} label="Rekam Email User"></Checkbox>
          </CardFooter>
        </Card>

        {
          questionArray.map((question, index) => {
            if (question.type === 'multipleChoice') {
              return (
                <Card key={index} className=" w-full max-w-5xl">
                  {
                    index !== 0 && (
                      <button onClick={() => moveUp(index)} className={` absolute flex justify-center align-middle hover:bg-gray-200 transition-all duration-300 bg-gray-50 border-${formDetails.formColor}-500 border-2 shadow-md rounded-full h-10 w-10 top-0 right-10 -ml-2 -mt-5`}>
                        <HiOutlineChevronUp size={20} className=" h-full" />
                      </button>)
                  }

                <CardBody>
                  <MultipleChoiceEdit questionArray={questionArray} index={index} setQuestionArray={setQuestionArray} themeColor={formDetails.formColor} />
                </CardBody>

                {
                  index !== questionArray.length - 1 && (
                    <button onClick={() => moveDown(index)} className={` absolute flex justify-center align-middle hover:bg-gray-200 transition-all duration-300 bg-gray-50 border-${formDetails.formColor}-500 border-2 shadow-md rounded-full h-10 w-10 bottom-0 right-10 -ml-2 -mb-5`}>
                      <HiOutlineChevronDown size={20} className=" h-full" />
                    </button>
                  )
                }

                <CardFooter className=' border-t-2 inline-flex gap-2 p-4'>
                  <Checkbox id={`requiredCheckbox-${index}`} color={formDetails.formColor} checked={questionArray[index].required} onChange={(e) => {changeIsRequired(index, e.target.checked)}} label={
                    <label htmlFor={`requiredCheckbox-${index}`} className=" cursor-pointer">Wajib Diisi</label>
                  }/>
                  <button onClick={() => {deleteQuestion(index)}} className=" m-0 transition-all duration-200 flex items-center  rounded-lg hover:bg-blue-gray-100 p-2 gap-1">
                    <FaTrash className=" " size={15} />
                    <Typography className=' '>Hapus</Typography>
                  </button>    
                </CardFooter>
                </Card>
              )
            }

            if (question.type === 'checkbox') {
              return (
                <Card key={index} className=" w-full max-w-5xl">
                  {
                    index !== 0 && (
                      <button onClick={() => moveUp(index)} className={` absolute flex justify-center align-middle hover:bg-gray-200 transition-all duration-300 bg-gray-50 border-${formDetails.formColor}-500 border-2 shadow-md rounded-full h-10 w-10 top-0 right-10 -ml-2 -mt-5`}>
                        <HiOutlineChevronUp size={20} className=" h-full" />
                      </button>)
                  }

                <CardBody>
                  <CheckboxEdit questionArray={questionArray} index={index} setQuestionArray={setQuestionArray} themeColor={formDetails.formColor} />
                </CardBody>

                {
                  index !== questionArray.length - 1 && (
                    <button onClick={() => moveDown(index)} className={` absolute flex justify-center align-middle hover:bg-gray-200 transition-all duration-300 bg-gray-50 border-${formDetails.formColor}-500 border-2 shadow-md rounded-full h-10 w-10 bottom-0 right-10 -ml-2 -mb-5`}>
                      <HiOutlineChevronDown size={20} className=" h-full" />
                    </button>
                  )
                }

                <CardFooter className=' border-t-2 inline-flex gap-2 p-4'>
                  <Checkbox id={`requiredCheckbox-${index}`} color={formDetails.formColor} checked={questionArray[index].required} onChange={(e) => {changeIsRequired(index, e.target.checked)}} label={
                    <label htmlFor={`requiredCheckbox-${index}`} className=" cursor-pointer">Wajib Diisi</label>
                  }/>
                  <button onClick={() => {deleteQuestion(index)}} className=" m-0 transition-all duration-200 flex items-center  rounded-lg hover:bg-blue-gray-100 p-2 gap-1">
                    <FaTrash className=" " size={15} />
                    <Typography className=' '>Hapus</Typography>
                  </button>    
                </CardFooter>
                </Card>
              )
            }

            if (question.type === 'textInput') {
              return (
                <Card key={index} className=" w-full max-w-5xl">
                  {
                    index !== 0 && (
                      <button onClick={() => moveUp(index)} className={` absolute flex justify-center align-middle hover:bg-gray-200 transition-all duration-300 bg-gray-50 border-${formDetails.formColor}-500 border-2 shadow-md rounded-full h-10 w-10 top-0 right-10 -ml-2 -mt-5`}>
                        <HiOutlineChevronUp size={20} className=" h-full" />
                      </button>)
                  }

                <CardBody>
                  <TextInputEdit questionArray={questionArray} index={index} setQuestionArray={setQuestionArray} themeColor={formDetails.formColor} />
                </CardBody>

                {
                  index !== questionArray.length - 1 && (
                    <button onClick={() => moveDown(index)} className={` absolute flex justify-center align-middle hover:bg-gray-200 transition-all duration-300 bg-gray-50 border-${formDetails.formColor}-500 border-2 shadow-md rounded-full h-10 w-10 bottom-0 right-10 -ml-2 -mb-5`}>
                      <HiOutlineChevronDown size={20} className=" h-full" />
                    </button>
                  )
                }

                <CardFooter className=' border-t-2 inline-flex gap-2 p-4'>
                  <Checkbox id={`requiredCheckbox-${index}`} color={formDetails.formColor} checked={questionArray[index].required} onChange={(e) => {changeIsRequired(index, e.target.checked)}} label={
                    <label htmlFor={`requiredCheckbox-${index}`} className=" cursor-pointer">Wajib Diisi</label>
                  }/>
                  <button onClick={() => {deleteQuestion(index)}} className=" m-0 transition-all duration-200 flex items-center  rounded-lg hover:bg-blue-gray-100 p-2 gap-1">
                    <FaTrash className=" " size={15} />
                    <Typography className=' '>Hapus</Typography>
                  </button>    
                </CardFooter>
                </Card>
              )
            }
          })
        }

        <Card shadow={false} className={` shadow-md w-fit max-w-5xl mb-14`}>
          <CardBody className=" flex flex-col gap-2">
            <Typography className=" text-center">Tambah Pertanyaan</Typography>
            <div className="flex flex-col md:flex-row gap-3 justify-center">
              <button onClick={addMultipleChoiceQuestion} className="  min-w-[12rem] inline-flex justify-center transition-all duration-300 items-center gap-3 bg-blue-gray-50 hover:bg-blue-gray-100 p-3 rounded-md">
                <BiRadioCircleMarked size={30}></BiRadioCircleMarked>
                <Typography>Pilihan Ganda</Typography>
              </button>
              <button onClick={addCheckboxQuestion} className="  min-w-[12rem] inline-flex justify-center transition-all duration-300 items-center gap-3 bg-blue-gray-50 hover:bg-blue-gray-100 p-3 rounded-md">
                <MdOutlineCheckBox size={30}></MdOutlineCheckBox>
                <Typography>Checkbox</Typography>
              </button>
              <button onClick={addTextInputQuestion} className="  min-w-[12rem] inline-flex justify-center transition-all duration-300 items-center gap-3 bg-blue-gray-50 hover:bg-blue-gray-100 p-3 rounded-md">
                <BsTextParagraph size={30}></BsTextParagraph>
                <Typography>Text Input</Typography>
              </button>
            </div>

            <Typography className=" text-center">Ganti Warna Kuesioner</Typography>
            <Typography className=" text-center">Ganti Warna</Typography>
              <div className="flex flex-col md:flex-row gap-3 justify-center min-w-[20rem] mb-3">
                <div className=" inline-flex gap-3 justify-center">
                  <div onClick={() => {setFormDetails({...formDetails, formColor: 'blue'})}} className=" cursor-pointer relative flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full bg-blue-500"></div>
                  <div onClick={() => {setFormDetails({...formDetails, formColor: 'red'})}} className=" cursor-pointer relative flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full bg-red-500"></div>
                  <div onClick={() => {setFormDetails({...formDetails, formColor: 'purple'})}} className=" cursor-pointer relative flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full bg-purple-500"></div>
                  <div onClick={() => {setFormDetails({...formDetails, formColor: 'teal'})}} className=" cursor-pointer relative flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full bg-teal-500"></div>
                </div>
                <div className=" inline-flex gap-3 justify-center">
                  <div onClick={() => {setFormDetails({...formDetails, formColor: 'pink'})}} className=" cursor-pointer relative flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full bg-pink-500"></div>
                  <div onClick={() => {setFormDetails({...formDetails, formColor: 'indigo'})}} className=" cursor-pointer relative flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full bg-indigo-500"></div>
                  <div  onClick={() => {setFormDetails({...formDetails, formColor: 'green'})}} className=" cursor-pointer relative flex items-center justify-center w-[2.5rem] h-[2.5rem] rounded-full bg-green-500"></div>
                </div>            
              </div>

              <div className="flex flex-row -mb-16 gap-4 justify-end">
                <Button color={formDetails.formColor} size="sm" onClick={handleCancel} variant="outlined">Cancel</Button>
                <Button color={formDetails.formColor} size="sm" onClick={handleSave}>Simpan</Button>
              </div>
          </CardBody>
        </Card>

        <Dialog open={dialogOpen} className="w-full max-w-lg md:max-w-xl -m-4">
        <DialogBody className=" flex flex-col items-center gap-3">
          {isLoading && <Spinner className=" w-14 h-14" />}

          {isSuccess &&<CheckCircleIcon className=" text-green-500 w-14 h-14" />}
          {isError && <ExclamationTriangleIcon className=" text-red-500 w-14 h-14" />}
          <Typography className=" text-blue-gray-900">{dialogMessage}</Typography>

          {!isLoading && 
            <Button onClick={()=> {handleDialogOk()}}>OK</Button>                  
          }
        </DialogBody>      
      </Dialog>

        <Button onClick={() => {console.log(questionArray); console.log(formDetails); }}>Print form and question</Button>
      </div>

    </>
  )
}

export default EditForm