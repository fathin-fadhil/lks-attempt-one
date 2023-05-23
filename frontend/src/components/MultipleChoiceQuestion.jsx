import { Radio, Typography, Button } from "@material-tailwind/react"
import { useState } from "react"


function MultipleChoiceQuestion({index , question, handleAnswer, color}) {
  console.log("🚀 ~ file: MultipleChoiceQuestion.jsx:6 ~ MultipleChoiceQuestion ~ question:", question)
  const questionIndex = index

  const [selectedChoice, setSelectedChoice] = useState('');

  const setAnswer = (answerIndex, answer) => {
    setSelectedChoice(answer)
    handleAnswer(questionIndex, {questionId: question.questionId, answerIndex, answer})
  }

  const clearChoice = () => {
    setSelectedChoice('')
    handleAnswer(questionIndex. null)
  }

  return (
    <div className=" flex flex-row">
      <Typography variant='paragraph' className=" text-lg text-black me-2">{index + 1}.</Typography>
      <div>
        <Typography variant="paragraph" className=" text-lg text-black">  {question.questionText}</Typography>
        <div className=" grid grid-cols-1 gap-3 mt-3">
          {
            question.choices.map((choice, index) => (
              <Radio color={color} containerProps={{className: 'p-0 mr-4'}} ripple={false} value={choice} onChange={(e) => {setAnswer(index, e.target.value)}} checked={selectedChoice === choice}  key={index} id={`question-${questionIndex}-choice-${index}`} name={`choicesOfQuestion${questionIndex}`} label={                                
                <label htmlFor={`question-${questionIndex}-choice-${index}`}>{choice}</label>                                
              }></Radio>
            ))
          }
        </div>
      {
        selectedChoice && (
          <Button onClick={clearChoice} variant="outlined" color={color} size="sm" className=" rounded-md mt-4">Batalkan pilihan</Button>                
        )
      }
      </div>
    </div>
  )
}

export default MultipleChoiceQuestion