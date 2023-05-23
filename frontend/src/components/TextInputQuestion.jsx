import { Typography, Button } from "@material-tailwind/react"
import { useState } from "react"
import TextArea from 'react-textarea-autosize'


function TextInputQuestion({index, question, handleAnswer, color}) {
  const questionIndex = index

  const [answerText, setAnswerText] = useState('')

  const handleChange = (e) => {
    setAnswerText(e.target.value)
    handleAnswer(questionIndex, {questionId: question.questionId, answer: e.target.value})
  }

  const clearAnswer = () => {
    setAnswerText('')
    handleAnswer(questionIndex, null)
  }

  return (
    <div className=" flex flex-row h-auto">
      <Typography variant="p" className=" text-lg text-black me2">{index + 1}.</Typography>
      <div className="grow">
        <Typography className=" text-lg text-black">{question.questionText}</Typography>
        <div className=" relative w-full min-w-[200px] mt-3">
          <TextArea 
            className={`peer h-full w-full resize-none border-b border-blue-gray-200 bg-transparent pt-4 pb-1.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border-blue-gray-200 focus:border-${color}-500 focus:outline-0 disabled:resize-none disabled:border-0 disabled:bg-blue-gray-50`}
            placeholder=" "
            onChange={handleChange}
            value={answerText}
          />
          <label className={`after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none text-[13px] font-normal leading-tight text-blue-gray-500 transition-all after:absolute after:-bottom-0 after:block after:w-full after:scale-x-0 after:border-b-2 after:border-${color}-500 after:transition-transform after:duration-300 peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[4.25] peer-placeholder-shown:text-blue-gray-500 peer-focus:text-[13px] peer-focus:leading-tight peer-focus:text-${color}-500 peer-focus:after:scale-x-100 peer-focus:after:border-${color}-500 peer-disabled:text-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500`}>
            Jawaban Anda
          </label>
        </div>
        {answerText &&
          <Button onClick={clearAnswer} variant="outlined" color={color} size="sm" className=" rounded-md mt-4">Kosongkan Jawaban</Button>                
        }
      </div>
    </div>
  )
}

export default TextInputQuestion