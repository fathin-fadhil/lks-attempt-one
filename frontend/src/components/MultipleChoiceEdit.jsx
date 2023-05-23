/* eslint-disable react/prop-types */
import { Input, Typography, Radio, Button } from "@material-tailwind/react"
import { useEffect, useState } from "react"
import { FaTrash } from "react-icons/fa";


function MultipleChoiceEdit({questionArray, setQuestionArray, index, themeColor}) {
  const questionIndex = index

  const [questionText, setQuestionText] = useState('')
  const [questionChoices, setQuestionChoices] = useState([])
  const [color, setColor] = useState('blue')

  useEffect(() => {
    setQuestionText(questionArray[index].questionText)
    setQuestionChoices(questionArray[index].choices)
  }, [questionArray, index])

  useEffect(() => {
    setColor(themeColor)
  }, [themeColor])

  const addChoices = () => {
    setQuestionChoices([...questionChoices, `Opsi pilihan ganda ${questionChoices.length + 1}`])
  }

  const onChoiceTextChange = (index, value) => {
    setQuestionChoices(prev => { return prev.map((choice, i) => i === index ? value : choice)})
  }

  const deleteChoice = (index) => {
    if (questionChoices.length === 1) return
    setQuestionChoices(prev => { return prev.filter((_, i) => i !== index)})
  }

  useEffect(() => {
    const updateTheQuestionTextToParent = setTimeout(() => {
      setQuestionArray(prev => {
        const newState = [...prev]
        newState[index].questionText = questionText
        return newState
      })
    }, 400)

    return () => {clearTimeout(updateTheQuestionTextToParent)}
  }, [questionText])

  useEffect(() => {
    const updateTheQuestionChoicesToParent = setTimeout(() => {
      setQuestionArray(prev => {
        const newState = [...prev]
        newState[index].choices = questionChoices
        return newState
      })
    }, 400)

    return () => {clearTimeout(updateTheQuestionChoicesToParent)}
  }, [questionChoices])

  return (
    <div className="flex flex-row">
      <Typography className='text-lg text-black me-2'>{questionIndex + 1}.</Typography>
      <div className="grow">
        <Input value={questionText} onChange={(event) => {setQuestionText(event.target.value)}} variant="standard" color={color} className=" w-full" label="Text Pertanyaan" containerProps={{className: 'p-0'}}></Input>
        <div className=" grid grid-rows-1 gap-3 mt-3" >                  
          {
            questionChoices.map((choice, index) => (
              <div key={index} className=" w-full flex flex-row gap-2">
                  <Radio color={color} containerProps={{className: 'p-0 mr-4'}} ripple={false} value={choice} id={`question-${questionIndex}-choice-${index}`} name={`choicesOfQuestion${questionIndex}`} label={                                
                          <Input className=" grow w-fit md:w-[400px]" containerProps={{className: ' grow'}} value={questionChoices[index]} onChange={(e) => {onChoiceTextChange(index, e.target.value)}} color={color} label={`Opsi ${index + 1}`} htmlFor={`question-${questionIndex}-choice-${index}`}></Input>                                                        
                  }></Radio>
                  <Button onClick={() => deleteChoice(index)} variant="text" size="sm" color="red">
                    <FaTrash size={15} />
                  </Button>
              </div>
            ))
          }
        <Button color={color} onClick={addChoices} className="p-0 max-w-[7rem] h-7" variant="outlined" size="sm">Tambah Opsi</Button>
      </div>
      </div>
    </div>
  )
}

export default MultipleChoiceEdit