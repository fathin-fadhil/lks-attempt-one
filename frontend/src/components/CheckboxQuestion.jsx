/* eslint-disable react/prop-types */
import { Button, Checkbox, Typography } from "@material-tailwind/react";
import { useState } from "react"


function CheckboxQuestion({index, question, handleAnswer, color}) {
  const questionIndex = index

  const [selectedChoice, setSelectedChoice] = useState(new Array(question.choices.length).fill(false));

  const setAnswer = (answerIndex, isChecked) => {
    const newAnswer = [...selectedChoice]
    newAnswer[answerIndex] = isChecked

    const answerArrayObject = []
    newAnswer.forEach((checked, index) => {
      if (checked) {        
        answerArrayObject.push({answerIndex: index, answer: question.choices[index]})
      }
    })
    setSelectedChoice(newAnswer)

    handleAnswer(questionIndex, {questionId: question.questionId, answerArray: [...answerArrayObject]})
  }

  const clearChoice = () => {
    setSelectedChoice(new Array(question.choices.length).fill(false));
    handleAnswer(questionIndex, null)
  }

  return (
    <div className=" flex flex-row">
      <Typography className="text-lg text-black me-2" variant='paragraph'>{index + 1}.</Typography>
      <div>
        <Typography vatiant='paragraph' className=" text-lg text-black">{question.questionText}</Typography>
        <div className=" grid grid-rows-1 gap-3 mt-3">
          {
            question.choices.map((choice, index) => (
              <Checkbox color={color} containerProps={{ className: ' p-0 mr-4'}} checked={selectedChoice[index]} onChange={(e) => {setAnswer(index, e.target.checked)}} key={index} id={`question-${questionIndex}-choice-${index}`} label={
                <label htmlFor={`question-${questionIndex}-choice-${index}`}>{choice}</label>
              }> 
              </Checkbox>))
          }
        </div>
        {selectedChoice.includes(true) && (
          <Button onClick={clearChoice} variant="outlined" color={color} size="sm" className="rounded-md mt-4">
            Batalkan Pilihan
          </Button>
          
        )
        
        }
      </div>
    </div>
  )
}

export default CheckboxQuestion