import { Box } from "@mui/material"
import InstructorForm from "./instructorForm"
import InstructorList from "./listInstructors"
import { useState } from "react"


type Instructor = {
    _id?: string,
    name: string,
    belt_rank: string,
    classes: string[]
}
const EditInstructors = () => {
    const [instructors, setInstructors] = useState<Instructor[]>([])

    const addInstructor = (instructor: Instructor) => {
        
    }

    return (
        <Box sx={{width: '85%', margin: '10px auto'}}>
            <InstructorList />
            <InstructorForm />
        </Box>
    )
}

export default EditInstructors