import { FC, useEffect, useState } from "react";
import { AcademyClass, AcademyClassSchedule, User } from "../../../utils/types_interfaces";
import { Accordion, AccordionDetails, AccordionSummary, Stack, Paper } from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import ClassSchedule from "./classSchedule";
import ScheduleWeekView from "./weekView";
import { getAcademyFullSchedule } from "../../../utils/academy-utils";

type AEProps = {
    class_list: AcademyClass[],
    user: User,
    update_class: Function
}

const AddEditSchedule: FC<AEProps> = (props) => {
    const { class_list, user, update_class } = props
    const [schedule, setSchedule] = useState<AcademyClassSchedule[]>()

    useEffect(function () {
        getAllClassSchedules()
    }, [class_list])

    const getAllClassSchedules = async () => {
        const list = class_list.map(c => {return c._id as string})
        const data = await getAcademyFullSchedule(list) as AcademyClassSchedule[]
        setSchedule(data)

    }

    const classUpdated = () => {
        update_class()
    }

    return (<>
        <Paper sx={{padding: '30px'}}>
            <Stack>
                {class_list.length > 0 && class_list.map(c => {
                    return (
                        <Accordion key={c._id}>
                            <AccordionSummary expandIcon={<ExpandMore />}>
                                {c.name}
                            </AccordionSummary>
                            <AccordionDetails>
                                {c.details}
                                <ClassSchedule class_edit={c} user={user} updated_class={classUpdated} />
                            </AccordionDetails>
                        </Accordion>
                    )
                })}
                
            </Stack>
        </Paper>
        <Paper sx={{padding: '30px'}}>
            <ScheduleWeekView schedule={schedule} />
        </Paper>
    </>)
}

export default AddEditSchedule;