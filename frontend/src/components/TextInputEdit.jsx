import { useState } from "react";
import { Typography, Input, Textarea } from "@material-tailwind/react";
import { useEffect } from "react";

function TextInputEdit({questionArray, setQuestionArray, index, themeColor}) {
  const questionIndex = index;

  const [questionText, setQuestionText] = useState('Loading')
  const [color, setColor] = useState('blue')

  useEffect(() => {
    setQuestionText(questionArray[index].questionText)
  }, [questionArray, index])

  useEffect(() => {
    setColor(themeColor)
  }, [themeColor])

  useEffect(() => {
    const delayUpdatingTheQuestionArray = setTimeout(() => {
      console.log('updating parents question text')
      setQuestionArray(prevState => {
        const newState = [...prevState]
        newState[index].questionText = questionText
        return newState      
      })
    }, 400)
    return () => clearTimeout(delayUpdatingTheQuestionArray)
  }, [questionText])

  const onQuestionTextChange = (e) => {
    setQuestionText(e.target.value)
  }

  return (
    <div className=" flex flex-row">
      <Typography variant="h6" className="text-lg text-black me-2">{questionIndex + 1}.</Typography>
      <div className="grow">
        <Input color={color} className="w-full" value={questionText} onChange={onQuestionTextChange} label="Text Pertanyaan" variant="standard" containerProps={{className: 'p-0'}}></Input>
        <div className=" grid grid-rows-1 gap-3 mt-3" >                  
          <Textarea className=" max-w-sm" disabled label="Kolom Jawaban Text Input" />
        </div>
      </div>
    </div>
  )
}

export default TextInputEdit