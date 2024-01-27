import { Drawer, Grid, List, ListItem, Tab, Tabs } from "@mui/material";
import { redirect, useParams } from "react-router-dom";
import AcademyDetailForm from "../../components/adacemy/detailsForm";
import { useEffect, useState } from "react";
import { Academy, User } from "../../utils/types_interfaces";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getAcademyDetails } from "../../utils/academy-utils";
import EditInstructors from "../../components/adacemy/instructors/editInstructors";
import EditAcademySchedule from "../../components/adacemy/schedule/editSchedule";

const editFocusOption = [
    {label: 'Details', value: 'details'},
    {label: 'Instructors', value: 'instructors'},
    {label: 'Students', value: 'students'},
    {label: 'Schedule', value: 'schedule'}
]

const EditAcademy = () => {
    const {slug} = useParams()
    const [academyInfo, setAcademyInfo] = useState<Academy>()
    const [editFocus, setEditFocus] = useState('details')
    const user = useSelector((state: RootState) => {return state.auth.user}) as User

    useEffect(function () {
        if (slug)
            getAcademyInfo()
    }, [slug])

    const getAcademyInfo = async () => {
        // get info for academy to edit
        if (slug) {
            const academyData = await getAcademyDetails(slug, user) as Academy
            setAcademyInfo(academyData)
        } else {
            redirect('/academy/create')
        }

    }

    const changeFocus = (event: React.SyntheticEvent, focus: string) => {
        setEditFocus(focus)
    }
    return (
        <>
        <Grid container spacing={1}>
            <Grid item xs={2}>
                <Tabs
                    orientation="vertical"
                    value={editFocus}
                    onChange={changeFocus}
                    sx={{ borderRight: 1, borderColor: 'divider' }}>
                    {editFocusOption.map((e, index) => {
                        return <Tab key={index} value={e.value} label={e.label} />
                    })}
                    
                </Tabs>
            </Grid>
            <Grid item xs={10}>
                <div style={{width: '100%'}}>
                        <div role="tabpanel" hidden={editFocus !== 'details'} id="vertical-tab-details">
                            <AcademyDetailForm isEdit={true} academyEdit={academyInfo} />
                        </div>
                        <div role="tabpanel" hidden={editFocus !== 'instructors'} id="vertical-tab-instructors">
                            {academyInfo?._id && <EditInstructors academy_id={academyInfo?._id} /> || <div>Nothing here</div>}
                        </div>
                        <div role="tabpanel" hidden={editFocus !== 'schedule'} id="vertical-tab-schedule">
                            <EditAcademySchedule />
                        </div>
                </div>
            </Grid>
        </Grid>
        </>
    )
}

export default EditAcademy;