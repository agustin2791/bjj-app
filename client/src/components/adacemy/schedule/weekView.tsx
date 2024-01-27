import { FC, useEffect, useState } from "react"
import { AcademyClassSchedule } from "../../../utils/types_interfaces"
import { Grid, Stack, Typography } from "@mui/material"
import moment from "moment"

const dayOptions = ['Times', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

type WeekViewProps = {
    schedule?: AcademyClassSchedule[]
}

type ScheduleObj = {
    _id: string,
    day: string,
    start: string,
    end: string,
    instructor: string
}

type FormattedScheduleObj = {
    time: string,
    monday: string,
    tuesday: string,
    wednesday: string,
    thursday: string,
    friday: string, 
    saturday: string,
    sunday: string
}
const ScheduleWeekView: FC<WeekViewProps> = (props) => {
    const {schedule} = props
    const [formatSchedule, setFormatSchedule] = useState<FormattedScheduleObj[]>([])

    useEffect(function() {
        ScheduleFormatter()
    }, [schedule])

    const ScheduleFormatter = () => {
        let times: string[] = []
        let schedules: ScheduleObj[] = []
        schedule?.forEach(c => {
            c.schedule.forEach(s => schedules.push(s as ScheduleObj))
        })
        schedules.forEach(s => {
            if (!times.includes(s.start)) {
                times.push(s.start)
            }
        })
        times = times.sort((a, b) => a > b ? 1 : a < b ? -1 : 0 )
        const data = times.map(d => {
            let out: any = {
                time: '',
                monday: '',
                tuesday: '',
                wednesday: '',
                thursday: '',
                friday: '', 
                saturday: '',
                sunday: ''
            }
            schedule?.forEach(c => {
                c.schedule.forEach(s => {
                    if (s.start === d) {
                        out[s.day.toLowerCase()] += `${c.academy_class.name} `
                        if (out.time === '') {
                            out.time = `${moment(s.start, 'HH:mm').format('h:mm A')} - ${moment(s.end, 'HH:mm').format('h:mm A')}`
                        }
                    }
                    
                })
            })
            return out

        }) as FormattedScheduleObj[]
        setFormatSchedule(data)

        
    }
    return (<>
    <Stack spacing={1}>
        <Grid container spacing={1} alignItems={'stretch'} justifyContent={'space-between'}>
            {dayOptions.map(d => {return (
                <Grid key={d} item className="schedule-box"><Typography variant="h5">{d}</Typography></Grid>
            )})}
        </Grid>
        {formatSchedule.map(s => {
            return (
            <Grid container key={s.time} spacing={1} alignItems={'stretch'} justifyContent={'space-between'}>
                <Grid item className="schedule-box">{s.time}</Grid>
                <Grid item className="schedule-box">{s.monday}</Grid>
                <Grid item className="schedule-box">{s.tuesday}</Grid>
                <Grid item className="schedule-box">{s.wednesday}</Grid>
                <Grid item className="schedule-box">{s.thursday}</Grid>
                <Grid item className="schedule-box">{s.friday}</Grid>
                <Grid item className="schedule-box">{s.saturday}</Grid>
                <Grid item className="schedule-box">{s.sunday}</Grid>
            </Grid>)
        })}
    </Stack>
    </>)
}

export default ScheduleWeekView