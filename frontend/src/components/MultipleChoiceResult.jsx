import { Accordion, AccordionBody, AccordionHeader, Radio, Typography } from '@material-tailwind/react';
import ReactEchart from 'echarts-for-react'
import { useState } from 'react';
import useColors from '../hooks/useColors';
import { ChevronDownIcon } from "@heroicons/react/24/outline";

function MultipleChoiceResult({question, formData, index}) {
  const questionIndex = index
  const colors = useColors()

  const [openAccordion, setOpenAccordion] = useState(false)

  const option = {
    tooltip: {
      trigger: 'item',
    },
  legend: {
    top: '5%',
    left: 'center'
  },
  series: [
    {
      name: `Grafik jawaban pertanyaan nomor ${index + 1}`,
      type: 'pie',
      radius: ['40%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      labelLine: {
        show: false
      },
      data: question.choicesAndWhoPickedIt.map((choice, index) => { return { value: choice.usersWhoPickedIt.length, name: `Opsi ke-${index+1}`}})
    }
  ]
};

  return (
    <>
      <div className="flex flex-row">
        <Typography variant="paragraph" className="text-lg text-black me-2">{index + 1}.</Typography>
        <div className=' grow'>
          <Typography variant="paragraph" className=" text-lg text-black">  {question.questionText}</Typography>
          <div className=" grid grid-rows-1 gap-3 mt-3" >
              {
                question.choices.map((choice, index) => (
                  <Radio disabled color={formData.formColor} containerProps={{className: 'p-0 mr-4'}}  key={index} id={`question-${questionIndex}-choice-${index}`} name={`choicesOfQuestion${questionIndex}`} label={                                
                    <label htmlFor={`question-${questionIndex}-choice-${index}`}>{choice}</label>                                
                  }></Radio>
                ))
              }
          </div>            
        </div>
      </div>

      <ReactEchart option={option} 
        style={{ height: '400px'}}
      />

      <Accordion className="border border-blue-gray-100 px-4 rounded-lg mb-2" open={openAccordion} icon={<ChevronDownIcon className=' h-5 w-5' />}>
        <AccordionHeader className={`border-b-0  `} onMouseOver={(e) => {e.target.style.color = colors[String(formData.formColor)]}} onMouseLeave={e => {e.target.style.color = '#000'}} onClick={() => setOpenAccordion(!openAccordion)}>
          {`Dijawab oleh ${question.choicesAndWhoPickedIt.reduce((accumulator, currentValue) => accumulator + currentValue.usersWhoPickedIt.length, 0)} user`}
        </AccordionHeader>
        <AccordionBody>
          {
            formData.isAnonymous
            ? 'Tidak bisa menampilkan jawaban user pada Formulir Anonim'
            : (
              <div className="flex flex-col gap-3">
                {
                  question.choicesAndWhoPickedIt.map((choice, index) => (
                    <div key={index} className="bg-blue-gray-50 rounded-md p-2">
                      <Typography className='text-black font-medium'>{`Opsi ke-${index+1} : '${choice.choice}'`}</Typography>
                      {choice.usersWhoPickedIt.length > 0 
                      ? (choice.usersWhoPickedIt.map((user, key) => (
                        <Typography key={key}>{`• ${user}`}</Typography>
                      )))                
                      : 'Tidak ada user yang memilih'                    
                    }
                    </div> 
                  ))
                }
              </div>
            )
          }
        </AccordionBody>
      </Accordion>
    
    </>
  )
}

export default MultipleChoiceResult