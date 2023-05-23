import ReactEchart from 'echarts-for-react'
import useColors from '../hooks/useColors'
import { useState } from 'react'
import { Typography, Checkbox, Accordion, AccordionBody, AccordionHeader } from "@material-tailwind/react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";


function CheckboxResult({question, formData, index}) {
  const questionIndex = index
  const maxSelectedChoice = question.numberOfUsersThatAnsweredTheQuestion
  const colors = useColors()

  const [openAccordion, setOpenAccordion] = useState(false)

  const option = {
    xAxis: {
			max: 'dataMax'
		},
		yAxis: {
			type: 'category',
			axisLabel: {
				rotate: 90,
			},
			data: ['Jumlah pilihan'],
			inverse: true,
			animationDuration: 300,
			animationDurationUpdate: 300,
			max: 'dataMax'
		},
		series: question.choicesAndWhoPickedIt.map((choice, index) => { return {			
				realtimeSort: true,
				name: `Opsi checkbox ke-${index + 1}`,
				type: 'bar',
				data: [(choice.usersWhoPickedIt.length)],
				label: {
					show: true,
					position: 'right',
					valueAnimation: true,
					formatter: () => Math.floor(100 * (choice.usersWhoPickedIt.length) / maxSelectedChoice) + '%'					
				}		
			} 
		}),
		legend: {
			show: true
		},
		toolbox: {
			show: true
		},
		tooltip: {
			show: true,			
		},
		animationDuration: 1000,
		animationDurationUpdate: 1000,
		animationEasing: 'quarticOut',
		animationEasingUpdate: 'linear'
	};

  return (
    <>
      <div className=" flex flex-row mb-6">
        <Typography variant='p' className=" text-lg text-black me-2">{index + 1}.</Typography>
        <div className="">
          <Typography variant="paragraph" className=" text-lg text-black">{question.questionText}</Typography>
          <div className="grid grid-rows-1 gap-3 mt-3">
            {
              question.choices.map((choice, index) => (
                  <Checkbox disabled color={formData.formColor} containerProps={{className: 'p-0 mr-4'}}  id={`question-${questionIndex}-choice-${index}`} key={index} label={
                    <label htmlFor={`question-${questionIndex}-choice-${index}`}>{choice}</label>
                  }></Checkbox>
              ))
            }
          </div>
        </div>   
      </div>

      <ReactEchart
        option={option}
        style={{height: '400px'}}
       ></ReactEchart>

        <Accordion className="border border-blue-gray-100 px-4 rounded-lg mb-2" open={openAccordion} icon={<ChevronDownIcon className=' h-5 w-5' />}>
          <AccordionHeader className="border-b-0" onMouseOver={(e) => {e.target.style.color = colors[String(formData.formColor)]}} onMouseLeave={e => {e.target.style.color = '#000'}} onClick={() => setOpenAccordion(!openAccordion)}>
            {`Dijawab oleh ${question.numberOfUsersThatAnsweredTheQuestion} user`}
          </AccordionHeader>
          <AccordionBody>
            {
              formData.isAnonymous 
              ? 'Tidak bisa menampilkan jawaban user pada Formulir anonim' 
              : (
                <div className=' flex flex-col gap-2'>
                  {
                    question.choicesAndWhoPickedIt.map(((choice, index) => (
                      <div key={index} className=' bg-blue-gray-50 rounded-md p-2'>
                        <Typography className='text-black font-medium'>{`Opsi ke-${index+1} : '${choice.choice}'`}</Typography>
                        {choice.usersWhoPickedIt.length > 0 
                        ? (choice.usersWhoPickedIt.map((user, key) => (
                          <Typography key={key}>{`• ${user}`}</Typography>
                        )))                
                        : 'Tidak ada user yang memilih'                    
                      }
                      </div>
                    )))
                  }
                </div>
              )
            }
          </AccordionBody>
      </Accordion>
    </>
  )
}

export default CheckboxResult