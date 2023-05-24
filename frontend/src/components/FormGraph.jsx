import { Button, Card, CardBody, Typography } from "@material-tailwind/react"
import ReactEchart from 'echarts-for-react';
import { useEffect, useState } from "react";
import useAxiosPrivate from "../hooks/useAxiosPrivate";
import DatePicker from "react-datepicker";
import DateTimePicker from 'react-datetime-picker';


function FormGraph() {
  const axiosPrivate = useAxiosPrivate()

  const [formsByDateAndUser, setFormsByDateAndUser] = useState({})
  const [formsCreator, setFormsCreator] = useState([])
  const [usernames, setUsernames] = useState([])
  const [datesArray, setDatesArray] = useState([])
  const [option, setOption] = useState({})
  const [startDate, setStartDate] = useState((new Date('Wed May 20 2023 12:44:17 GMT+0700 (Western Indonesia Time)')))
  const [endDate, setEndDate] = useState((new Date()))


  const getFormGraphData = async ()  => {
    try {
      const res = await axiosPrivate.get('/api/summary/forms', {
        params: {
          startDate: startDate.toString(),
          endDate: endDate.toString()
        }
      })
      console.log("🚀 ~ file: FormGraph.jsx:20 ~ getFormGraphData ~ res:", res)
      setFormsByDateAndUser(res.data.formsByDateAndUser)
      setUsernames(res.data.usernames)        
    } catch (error) {
      console.log("🚀 ~ file: FormGraph.jsx:24 ~ getFormGraphData ~ error:", error)
      alert('Error while retriving data')
    }
  }

  useEffect(() => {

    setDatesArray(getDatesBetween(startDate, endDate))

    getFormGraphData()
  }, [])  

  useEffect(() => {
    setFormsCreator(Object.keys(formsByDateAndUser))
    setDatesArray(getDatesBetween(startDate, endDate))

    setOption(
      {
        title: {
          text: 'Grafik Pembuatan Kuesioner'
        },
        tooltip: {
          trigger: 'axis'
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            saveAsImage: {}
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: getDatesBetween(startDate, endDate)
        },
        yAxis: {
          type: 'value'
        },
        series: usernames.map((username) => {
          return {
            name: username,
            type: 'line',
            stack: 'Total',
            data: getDatesBetween(startDate, endDate).map((date) => {
              if (formsByDateAndUser[date]) {
                if (formsByDateAndUser[date][username]) {
                  console.log(formsByDateAndUser[date][username])
                  return formsByDateAndUser[date][username].length
                } else {
                  return 0
                }            
              } else {
                return 0
              }
            })
          }
        })
      }
    )

    const a = usernames.map((username) => {
      return {
        name: username,
        type: 'line',
        stack: 'Total',
        data: getDatesBetween(startDate, endDate).map((date) => {
          if (formsByDateAndUser[date]) {
            if (formsByDateAndUser[date][username]) {
              console.log(formsByDateAndUser[date][username])
              return formsByDateAndUser[date][username].length
            } else {
              return 0
            }            
          } else {
            return 0
          }
        })
      }
    })
    console.log("🚀 ~ file: FormGraph.jsx:116 ~ a ~ a:", a)
  }, [formsByDateAndUser, usernames])

  return (
    <div className=" w-full max-w-5xl">
        <Card>
            <CardBody className=" flex flex-col gap-10">
                <ReactEchart option={option} style={{height: "400px"}}/>

                <Typography>Start Date</Typography>
                <DateTimePicker className=" w-96 bg-white" onChange={setStartDate} value={startDate} />
                <Typography>End Date</Typography>
                <DateTimePicker className=" w-96 bg-white" onChange={setEndDate} value={endDate} />

                <Button size="sm" onClick={()=>{getFormGraphData()}}>Cari</Button>

            </CardBody>
        </Card>
    </div>
  )
}

export default FormGraph

function getDatesBetween(startDate, endDate) {
  const dates = [];
  // Copy the start date
  let currentDate = new Date(startDate);

  // Iterate while the current date is less than or equal to the end date
  while (currentDate <= endDate) {
    // Format the current date as 'YYYY-MM-DD'
    const formattedDate = currentDate.toISOString().split('T')[0];
    dates.push(formattedDate);

    // Increment the current date by one day
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}