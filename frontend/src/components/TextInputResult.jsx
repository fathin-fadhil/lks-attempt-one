import ReactEchart from 'echarts-for-react'
import useColors from '../hooks/useColors'
import { useState } from 'react'
import { Typography, Checkbox, Accordion, AccordionBody, AccordionHeader } from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

function TextInputResult({question, formData, index}) {
  const questionIndex = index
  return (
    <>
    <div className=" flex flex-row h-auto">      
      <Typography variant="p" className=" text-lg text-black me2">{index + 1}.</Typography>
      <div className="grow">        
        <Typography className=" text-lg text-black mb-2">{question.questionText}</Typography>        
        <div className=" flex flex-col gap-3">
        {
          question.theAnswerAndTheUser.map((answer, index) => (
            <div className=" w-full p-3 bg-blue-gray-50 rounded-md " key={index}>
              <Typography className=" text-black">{answer.answer}</Typography>
              <Typography className=" text-xs">{answer.userName ? answer.userName : "Anonim"}</Typography>
            </div>
          ))
        }
        </div>
      </div>

    </div>
    </>
  )
}

export default TextInputResult