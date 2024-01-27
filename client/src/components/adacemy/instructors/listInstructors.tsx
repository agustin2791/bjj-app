import { FC } from "react"
import { AcademyInstructor } from "../../../utils/types_interfaces"
import { Divider, Paper, Typography } from "@mui/material"

type instructorListParams = {
    instructors: AcademyInstructor[],
    selectToUpdate?: Function,
    read_only: boolean
}
const InstructorList:FC<instructorListParams> = (params) => {
    const { instructors, selectToUpdate, read_only } = params

    return (
        <Paper sx={{padding: '20px'}}>
            {read_only && <Typography variant="h4">Instructors</Typography>}
            {instructors.length > 0 && 
            instructors.map((i, idx) => {
                return (<div style={{cursor: read_only ? '' : 'pointer'}} onClick={() => {read_only ? '' : selectToUpdate ? selectToUpdate(i._id) : ''}} key={idx}>
                    <br />
                    <Typography variant="body1">{i.name} - {i.belt_rank}</Typography>
                    <Typography variant="body2">({i.classes.map(c => {return (<i key={c._id}>{c.name} </i>)})})</Typography>
                    <br />
                    <Divider />
                </div>)
            })}
        </Paper>
    )
}

export default InstructorList