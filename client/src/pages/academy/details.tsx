import { Box, Grid, Paper, Typography } from "@mui/material";
import MapView from "../../components/adacemy/map";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAcademyClassSchedule, getAcademyClasses, getAcademyDetails, getAcademyFullSchedule, getAcademyInstructors } from "../../utils/academy-utils";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import { Academy, AcademyClass, AcademyClassSchedule, AcademyInstructor, User } from "../../utils/types_interfaces";
import ScheduleWeekView from "../../components/adacemy/schedule/weekView";
import AcademyClassList from "../../components/adacemy/schedule/classList";
import InstructorList from "../../components/adacemy/instructors/listInstructors";

const AcademyDetails = () => {
    const {slug} = useParams()
    const user = useSelector((state: RootState) => {return state.auth.user}) as User
    const [academy, setAcademy] = useState<Academy>()
    const [allClasses, setAllClasses] = useState<AcademyClass[]>()
    const [fullSchedule, setFullSchedule] = useState<AcademyClassSchedule[]>()
    const [instructors, setInstructors] = useState<AcademyInstructor[]>([])

    useEffect(function () {
        if (slug) {
            getAcademy()
        }
    }, [slug])

    const getAcademy = async () => {
        if (slug) {
            console.log(slug)
            const details = await getAcademyDetails(slug, user) as Academy
            setAcademy(details)
            if (details._id){
                await getClasses(details._id)
                await getInstructors(details._id)
            }
        }
    }

    const getClasses = async (a_id: string) => {
        const class_list = await getAcademyClasses(a_id)
        setAllClasses(class_list as AcademyClass[])
        const schedule = await getAcademyFullSchedule(class_list as [])
        setFullSchedule(schedule as AcademyClassSchedule[])
    }

    const getInstructors = async (a_id: string) => {
        const instructor_list = await getAcademyInstructors(a_id)
        setInstructors(instructor_list as AcademyInstructor[])
    }
    return (<>
    <Box sx={{width: '100%', height: '100%'}}>
        {academy ? 
        <Grid container spacing={2} alignItems='stretch' justifyContent='center'>
            
            <Grid item sm={12} md={10} sx={{margin: '10px auto'}}>
                
                <Typography variant="h1">{academy.name}</Typography>
                <Grid container spacing={2} alignItems='stretch'>
                    <Grid item sm={12} md={6}>
                        <Paper sx={{padding: '20px', height: '100%'}}>
                            <Typography variant="body1">
                                {academy.formattedAddress}<br />
                                {academy.phone_number}<br />
                                <a href={academy.website} target="_blank">{academy.website}</a><br />
                                <br />
                                Head instructor: {academy.head_instructor}<br />
                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item sm={12} md={6}>
                        <Paper sx={{padding: '20px'}}>
                            <MapView multiple={false} height="300px" location={academy.location ? academy.location : undefined} />
                        </Paper>
                    </Grid>
                    {instructors && 
                    <Grid item sm={12}>
                        <InstructorList read_only={true} instructors={instructors} />
                    </Grid>}
                    {fullSchedule && <Grid item sm={12}>
                        <Paper sx={{padding: '20px'}}>
                            <Typography variant='h4'>Schedule</Typography><br />
                            <ScheduleWeekView schedule={fullSchedule} />
                        </Paper>
                    </Grid>}
                    {allClasses && 
                    <Grid item sm={12}>
                        <Paper sx={{padding: '20px'}}>
                            <Typography variant="h4">Class Details</Typography><br />
                            <AcademyClassList edit={false} academy_class_list={allClasses} academy_id={academy._id ? academy._id : ''} />
                        </Paper>
                    </Grid>}
                </Grid>
            </Grid>
            
        </Grid> : <div>...Still looking</div>}
    </Box>
    </>)
}

export default AcademyDetails;