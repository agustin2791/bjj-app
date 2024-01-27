import { ChangeEvent, FC, useEffect, useState } from "react";
import { AcademyClassSchedule, AcademyClass, User } from "../../../utils/types_interfaces";
import { getAcademyClassSchedule, updateAcademyClassSchedule } from "../../../utils/academy-utils";
import { Button, Grid, MenuItem, Paper, Select, SelectChangeEvent, Stack, TextField } from "@mui/material";
import { Add } from "@mui/icons-material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';
import moment, { Moment } from "moment";

type ClassScheduleProps = {
    class_edit: AcademyClass,
    user: User,
    updated_class: Function
}

const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
const ClassSchedule: FC<ClassScheduleProps> = (props) => {
    const { class_edit, user, updated_class } = props
    const [ classDetails, setClassDetails ] = useState<AcademyClassSchedule>()

    useEffect(function () {
        getClassSchedule()
    }, [class_edit])

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>, class_index: number) => {
        const {name, value} = event.target
        
        if (classDetails?.schedule) {
            const update_schedule = classDetails.schedule.map((s, idx) => {
                if (idx === class_index) {
                    return {...s, [name]: value}
                } else {
                    return s
                }
            })
            setClassDetails({...classDetails, schedule: update_schedule as AcademyClassSchedule['schedule']})
        }
    }
    const handleTimeChange = (value: string | Moment | null, class_index: number, name: string) => {
        
        if (classDetails?.schedule) {
            const update_schedule = classDetails.schedule.map((s, idx) => {
                if (idx === class_index) {
                    return {...s, [name]: value}
                } else {
                    return s
                }
            })
            setClassDetails({...classDetails, schedule: update_schedule as AcademyClassSchedule['schedule']})
        }
    }

    const getClassSchedule = async () => {
        if (class_edit === undefined) return
        if (class_edit._id){
            let class_data = await getAcademyClassSchedule(class_edit, user) as AcademyClassSchedule
            if (class_data.schedule.length > 0) {
                class_data.schedule.forEach(d => {
                    d.start = moment(d.start, 'HH:mm')
                    d.end = moment(d.end, 'HH:mm')
                    if (!d.instructor) 
                        d.instructor = ''
                })
            }
            setClassDetails(class_data)
        }
    }

    const AddNewTime = () => {
        if (!classDetails) return
        else {
            const new_times = {
                day: 'Monday', 
                start: moment('12:00', 'HH:mm'), 
                end: moment('13:00', 'HH:mm'), 
                instructor: '', 
                instructor_id: undefined
            }
            const schedule_add = classDetails.schedule ? [...classDetails.schedule, new_times] : [new_times]
            setClassDetails({...classDetails, schedule: schedule_add as AcademyClassSchedule['schedule']})
        }
        
    }

    const duplicateSchedule = (schedule_dup: any) => {
        if (!classDetails) return
        const schedule_add = [...classDetails.schedule, schedule_dup]
        setClassDetails({...classDetails, schedule: schedule_add as AcademyClassSchedule['schedule']})
    }

    const removeTime = (time_index: number) => {
        if (!classDetails) return
        let update_schedule = classDetails.schedule
        if (update_schedule.length > 1) {
            update_schedule.splice(time_index, 1)
        } else {
            update_schedule = [] as AcademyClassSchedule['schedule']
        }

        setClassDetails({...classDetails, schedule: update_schedule as AcademyClassSchedule['schedule']})

    }

    const updateScheduleDetails = async () => {
        let details = classDetails
        details?.schedule.forEach(s => {
            s.start = moment(s.start).format('HH:mm')
            s.end = moment(s.end).format('HH:mm')
        })
        await updateAcademyClassSchedule(details, user)
        await getClassSchedule()
        updated_class()
    }

    return (<>
    <LocalizationProvider dateAdapter={AdapterMoment}>
        <Stack spacing={2}>
            <Button onClick={AddNewTime} color="primary" endIcon={<Add />} variant="contained">Add Class</Button>
            {classDetails && classDetails.schedule.map((s, idx) => {
                return (
                    <Grid container key={idx} spacing={2}>
                        <Grid item sm={2}>
                            <Select fullWidth label="Day" name="day" value={s.day} onChange={(e) => {handleInputChange(e, idx)}}>
                                {dayOptions.map(d => {
                                    return <MenuItem key={d} value={d}>{d}</MenuItem>
                                })}
                            </Select>
                        </Grid>
                        <Grid item>
                            <TextField label="Instructor" name="instructor" value={s.instructor} onChange={(e) => {handleInputChange(e, idx)}}></TextField>
                        </Grid>
                        <Grid item>
                            <TimePicker label="Start Time" name="start" value={s.start} onChange={(e) => {handleTimeChange(e, idx, 'start')}} />
                            {/* <TextField fullWidth label="Start Time" name="start" value={s.start} onChange={(e) => {handleInputChange(e, idx)}}></TextField> */}
                        </Grid>
                        <Grid item>
                            <TimePicker label="End Time" name="end" value={s.end} onChange={(e) => {handleTimeChange(e, idx, 'end')}} />
                            {/* <TextField fullWidth label="End Time" name="end" value={s.end}  onChange={(e) => {handleInputChange(e, idx)}}></TextField> */}
                        </Grid>
                        <Grid item alignSelf="center">
                            <Button color="primary" variant="contained" onClick={() => {duplicateSchedule(s)}}>Duplicate</Button>
                            <Button color="error" variant="outlined" onClick={() => {removeTime(idx)}}>Remove</Button>
                        </Grid>
                    </Grid>
                )
            })}
            <Button onClick={updateScheduleDetails} color="success" variant="contained">Save Changes</Button>
        </Stack>
    </LocalizationProvider>
    </>)
}

export default ClassSchedule;