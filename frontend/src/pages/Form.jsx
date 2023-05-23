import { useNavigate, useParams } from "react-router-dom"
import useAxiosPrivate from "../hooks/useAxiosPrivate"
import { useAutoAnimate } from "@formkit/auto-animate/react"
import useAuth from "../hooks/useAuth"
import { useEffect, useState } from "react"
import { Button, Card, CardBody, CardFooter, Tooltip, Typography, Dialog, DialogBody, Spinner } from "@material-tailwind/react"
import { TrashIcon, ExclamationTriangleIcon, CheckCircleIcon, DocumentDuplicateIcon } from "@heroicons/react/24/outline";
import { TbAsteriskSimple } from "react-icons/tb";
import MultipleChoiceQuestion from "../components/MultipleChoiceQuestion"
import CheckboxQuestion from "../components/CheckboxQuestion"
import TextInputQuestion from "../components/TextInputQuestion"
import axios from "axios"
import NavbarComp from "../components/NavbarComp"

function Form() {
  const { formId } = useParams()

  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const [parent] = useAutoAnimate()
  const { auth } = useAuth()

  const [formData, setFormData] = useState({isAnonymous: false, formTitle: 'Loading...', formDescription: '', formColor: 'blue', createdbyUserId: -1, createdByUserEmail: '', createdByUserName: ''})
  const [formQuestions, setFormQuestions] = useState([])
  const [answer, setAnswer] = useState(new Map())
  const [dialogOpen, setDialogOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [dialogMessage, setDialogMessage] = useState('')
  const [isSuccess, setIsSuccess] = useState(null)
  const [isWarn, setIsWarn] = useState(null)
  const [isDeleteWarning, setIsDeleteWarning] = useState(false)
  const [shareLinkDialog, setShareLinkDialog] = useState(false)
  const [linkCopied, setLinkCopied] = useState(false)

  useEffect(() => {
    const getForm = async () => {
      try {
        const res = await axiosPrivate.get(`/api/forms/${formId}`)
        setFormData({
          formTitle: res.data.formTitle,
          formDescription: res.data.formDescription,
          formColor: res.data.formColor || 'blue',
          isAnonymous: res.data.isAnonymous,
          createdbyUserId: res.data.createdByUserId,
          createdByUserEmail: res.data.createdByUserEmail,
          createdByUserName: res.data.createdByUserName
        })        

        setFormQuestions(res.data.formQuestions)
        res.data.formQuestions.forEach((question, index) => {
          setAnswer(prev => prev.set(index, null ))
        })
      } catch (error) {
        console.log("🚀 ~ file: Form.jsx:43 ~ getForm ~ error:", error)
        //navigate('/')
      }
    }

    getForm()
    console.log(auth)
  }, [])

  const handleAnswer = (questionIndex, questionAnswer) => {
    setAnswer(prev => prev.set(questionIndex, questionAnswer))  
  }

  const handleDeleteForm = async () => {
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

  const handleSubmit = async () => {
    setDialogOpen(true)    
    setIsSuccess(null)
    setIsWarn(null)

    const answersArray = [...answer.values()]
    let indexOfQuestionThatAreRequired = null
    formQuestions.every((question, index) => {
      if (question.required && !answersArray[index]) {
        indexOfQuestionThatAreRequired = index
        return false
      }
      return true
    })

    if (indexOfQuestionThatAreRequired !== null) {
      setIsWarn(true)
      return setDialogMessage(`Pertanyaan nomor ${indexOfQuestionThatAreRequired + 1} wajib diisi`)      
    }

    setDialogMessage('Submitting...')
    try {
      setIsLoading(true)
      if (formData.isAnonymous) {
        await axios.post('/api/forms/answers/anonymous', {
          formId: formId,
          answersArray
        })
      } else {
        console.log({
          formId: formId,
          answersArray
        })
        await axiosPrivate.post('/api/forms/answers', {
          formId: formId,
          answersArray
        })
      }
      setIsSuccess(true)
      setDialogMessage('Jawaban berhasil dikirim')
    } catch (err) {
      console.log("🚀 ~ file: Form.jsx:99 ~ handleSubmit= ~ err:", err)
      setIsWarn(true)
      setDialogMessage(`Jawaban gagal dikirim: HTTP Error ${err.response.status} ${err.response.statusText}`)      
    } finally{
      setIsLoading(false)
    }
  }

  return (
    <>
      <NavbarComp />

      <div className={`bg-${formData.formColor}-50 w-full flex flex-col  h-fit min-h-full`}>
        <div className={`bg-${formData.formColor}-50  flex flex-col items-center gap-3 p-4`} ref={parent}>
          <Card shadow={false} className={` shadow-md w-full max-w-5xl border-t-4 border-${formData.formColor}-500`}>
            <CardBody>
              <Typography variant="h1" >{formData.formTitle}</Typography>
              <Typography variant="p" className=" mb-3 text-black">{formData.formDescription}</Typography>
              <Typography variant="p">Dibuat oleh : {formData.createdByUserName}</Typography>
              {              
                auth?.isAdmin || formData.createdbyUserId === auth?.userId ?
                <div className=" mt-4 flex gap-3">
                  <Button onClick={() => {navigate(`/form/${formId}/edit`)}} variant="outlined" size="sm" color={formData.formColor}>Edit Form</Button>
                  <Button onClick={() => {navigate(`/form/${formId}/result`)}} variant="outlined" size="sm" color={formData.formColor}>Lihat Hasil</Button>
                  <Button onClick={() => {setShareLinkDialog(true)}} variant="gradient" size="sm" color={formData.formColor}>Bagikan Form</Button>
                  <Button onClick={() => {setIsWarn(true);setIsDeleteWarning(true); setDialogOpen(true); setDialogMessage('Apakah anda yakin ingin menghapus form ini?')}} variant="text" color="red" size="sm" className=" inline-flex gap-1 align-middle text-center text-red-900 ml-auto" >
                    <TrashIcon className=" h-4 w-4" />  Delete
                  </Button>
                </div>
                : null
              }
            </CardBody>
            <CardFooter className=" border-t-2 p-4">
              {
                !formData.isAnonymous
                ? <Typography className={`${!auth.accessToken ? 'text-red-500' :  'text-black'} `}>{`${!auth.accessToken ? 'Anda perlu login untuk mengisi kuis ini': 'Email anda akan direkam saat mengisi kuis ini'}`}</Typography>
                : <Typography>Email tidak akan direkam saat mengisi kuis ini</Typography>
              }
            </CardFooter>
          </Card>

          {formQuestions.map((formQuestion, index) => (
                <Card key={index} shadow={false} className=" shadow-md w-full max-w-5xl ">
                  {
                    formQuestion.required && (
                      <Tooltip content="Pertanyaan ini harus diisi" placement="bottom">
                        <div>
                          <TbAsteriskSimple className=" absolute top-4 right-4 text-red-700"></TbAsteriskSimple>
                        </div>
                      </Tooltip>)
                  }
                  <CardBody>
                    { formQuestion.type === 'multipleChoice'
                      ? <MultipleChoiceQuestion color={formData.formColor} handleAnswer={handleAnswer} index={index} question={formQuestion} ></MultipleChoiceQuestion>
                      : formQuestion.type === 'checkbox'
                        ? <CheckboxQuestion color={formData.formColor} handleAnswer={handleAnswer} index={index} question={formQuestion} ></CheckboxQuestion>
                        :  formQuestion.type === 'textInput'
                          ? <TextInputQuestion color={formData.formColor} handleAnswer={handleAnswer} index={index} question={formQuestion} ></TextInputQuestion>
                          : null
                    }
                  </CardBody>
                </Card>
          ))
          }

          <Dialog open={dialogOpen} className="w-full max-w-lg md:max-w-2xl -m-4">
            <DialogBody className=" flex flex-col items-center gap-3">
              {isLoading && <Spinner className=" w-14 h-14" />}

              {isSuccess &&<CheckCircleIcon className=" text-green-500 w-14 h-14" />}
              {isWarn && <ExclamationTriangleIcon className=" text-red-500 w-14 h-14" />}
              <Typography className=" text-blue-gray-900">{dialogMessage}</Typography>

              {!isLoading && !isDeleteWarning &&
                <Button onClick={()=> {if(isSuccess){navigate('/')} if(isWarn){setDialogOpen(false)}}}>OK</Button>          
              }
              {
                isDeleteWarning && 
                <div className=" flex flex-row gap-4">
                  <Button onClick={()=> {setDialogOpen(false); setDialogMessage(''); setIsDeleteWarning(false)}} color={formData.formColor} variant="outlined" size="sm">Cancel</Button>
                  <Button onClick={() => {setIsWarn(null); handleDeleteForm()}} color='red'>Hapus</Button>
                </div>
              }
            </DialogBody>      
          </Dialog>

          <Dialog open={shareLinkDialog} className=" w-full max-w-lg md:max-w-2xl -m-4">
              <DialogBody className=" flex flex-col items-center gap-3">
                  <Typography className=" text-black text-xl text-center">Tautan Kuesioner</Typography>
                  <div className=" bg-blue-gray-50 w-fit rounded-md inline-flex gap-2 align-middle items-center pl-4">                    
                    <Typography className=" text-center">{window.location.href}</Typography>                  
                    <div onClick={() => {navigator.clipboard.writeText(window.location.href); setLinkCopied(true)}} className="  py-3 rounded-md flex align-middle items-center bg-blue-gray-50 border-l-2 border hover:bg-blue-gray-100 cursor-pointer mx-auto w-10 h-full justify-center">
                      <DocumentDuplicateIcon className=" h-6 w-6"/>
                    </div>
                  </div>
                  <Typography className={` ${linkCopied? '': 'hidden'}`} >Link Tersalin</Typography>
                  <Button color={formData.formColor} onClick={() => {setShareLinkDialog(false); setLinkCopied(false)}} >Ok</Button>
              </DialogBody>
          </Dialog>

          <div className=" w-full max-w-5xl flex flex-row justify-end gap-4">
            <Button size="sm" variant="outlined" color={formData.formColor} onClick={() => navigate('/')}>Cancel</Button>
            <Button size="sm" color={formData.formColor} onClick={handleSubmit} className=" right-0">Submit</Button>
          </div>

          <Button onClick={() => {console.log([...answer.values()])}} className=" max-w-md text-center">print ansaawfawf</Button>
        </div>
        {/* <div className=" hidden bg-red-50 bg-purple-50 bg-indigo-50 bg-green-50 bg-pink-50 bg-teal-50"></div> */}
      </div>
    </>
  )
}

export default Form