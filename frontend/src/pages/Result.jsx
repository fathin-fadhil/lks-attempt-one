import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import useAxiosPrivate from '../hooks/useAxiosPrivate'
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useEffect, useState } from "react";
import useColors from "../hooks/useColors";
import CheckboxResult from "../components/CheckboxResult";
import MultipleChoiceResult from "../components/MultipleChoiceResult";
import TextInputResult from "../components/TextInputResult";
import NavbarComp from "../components/NavbarComp";

import { Accordion, AccordionBody, AccordionHeader, Card, CardBody, CardFooter, Typography, Tooltip } from "@material-tailwind/react";

import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { TbAsteriskSimple } from "react-icons/tb";

function Result() {
  const {formId} = useParams()

  const { auth } = useAuth()
  const axiosPrivate = useAxiosPrivate()
  const navigate = useNavigate()
  const [parent] = useAutoAnimate({duration: 500})
  const colors = useColors()

  const [formData, setFormData] = useState({isAnonymous: false, formTitle: 'Loading...', formDescription: '', formColor: 'blue', createdbyUserId: -1, answeredBy: []})
  const [formQuestions, setFormQuestions] = useState([])
  const [openAccordion, setOpenAccordion] = useState(false)

  useEffect(() => {
    const getForm = async () => {
      try {
        const res = await axiosPrivate.get(`/api/forms/answers/${formId}`)
        console.log("🚀 ~ file: Form.jsx:35 ~ getForm ~ res:", res)
        setFormData({
          formTitle: res.data.formTitle, 
          formDescription: res.data.formDescription, 
          formColor: res.data.formColor ? res.data.formColor : 'blue',
          isAnonymous: res.data.isAnonymous ? res.data.isAnonymous : false,
          answeredBy: res.data.answeredBy,
          createdbyUserId: res.data.createdbyUserId,
          createdByUserName: res.data.createdByUserName
        })
        setFormQuestions(res.data.questionAndTheChoicesWithWhoAnsweredIt)        
      } catch (error) {
        console.log("🚀 ~ file: Result.jsx:35 ~ getForm ~ error:", error)
        navigate('/')
      }
    }

    getForm()
  }, [])

  return (
    <>
      <NavbarComp />
      <div className={`bg-${formData.formColor}-50 w-full flex flex-col  h-fit min-h-full`}>
        <div className={`bg-${formData.formColor}-50  flex flex-col items-center gap-3 p-4`}>
        <Card shadow={false} className={`shadow-md w-full max-w-5xl border-b-4 border-${formData.formColor}-500`}>
          <CardBody>
            <Typography variant="h1" >{formData.formTitle}</Typography>
            <Typography variant="p" className=" mb-3 text-black">{formData.formDescription}</Typography>
            <Typography variant="p">Dibuat oleh : {formData.createdByUserName}</Typography>
          </CardBody>
          <CardFooter className=" border-t-2 p-4">
              {
                !formData.isAnonymous
                ? <Typography>Kuesioner Ini merekam data user</Typography>
                : <Typography>Kuesioner ini tidak merekam data user</Typography>
              }
            </CardFooter>
        </Card>

        <Card className=" w-full max-w-5xl">
          <CardBody>
            <Accordion className="rounded-lg" open={openAccordion} icon={<ChevronDownIcon className="h-5 w-5"/>}>
              <AccordionHeader className=" border-b-0" onMouseOver={(e) => {e.target.style.color = colors[String(formData.formColor)]}} onMouseLeave={e => {e.target.style.color = '#000'}} onClick={() => setOpenAccordion(!openAccordion)}>
                {`${formData.answeredBy.length} User menjawab kuis ini`}
              </AccordionHeader>
              <AccordionBody>
              {
                  formData.isAnonymous
                  ? 'Tidak bisa melihat data user pada Kuis Anonim'
                  : (
                    formData.answeredBy.map((user, index) => (
                      <div key={index} className=" flex items-center gap-2 p-2 bg-blue-gray-50 rounded-md mb-2">
                        <Typography>{user}</Typography>
                      </div>
                    ))
                  )
                }
              </AccordionBody>
            </Accordion>
          </CardBody>              
        </Card>

        <div ref={parent} className=" w-full flex flex-col items-center gap-3 ">
          {formQuestions.map((question, index) => (
            <Card key={index} className=" shadow-md w-full max-w-5xl" shadow={false}>
              {
                question.required && (
                  <Tooltip content="Pertanyaan ini wajib dijawab" placement='bottom'>
                    <div>
                      <TbAsteriskSimple className=" absolute top-4 right-4 text-red-700" />
                    </div>                      
                  </Tooltip>                    
                )                  
              }

              <CardBody>
              {
                question.type === 'checkbox' 
                  ? <CheckboxResult question={question} formData={formData} index={index} />
                  : question.type === 'multipleChoice'
                    ? <MultipleChoiceResult question={question} formData={formData} index={index} />
                    : question.type === 'textInput'
                      ? <TextInputResult question={question} formData={formData} index={index} />
                      : ''
              }
              </CardBody>
            </Card>          
          ))
          }        
        </div>
        </div>

      </div>
    </>
  )
}

export default Result