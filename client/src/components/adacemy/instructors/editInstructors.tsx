import { Box, Stack } from "@mui/material"
import InstructorForm from "./instructorForm"
import InstructorList from "./listInstructors"
import { FC, useEffect, useState } from "react"
import { AcademyClass, User, AcademyInstructor } from "../../../utils/types_interfaces"
import { createAcademyInstructor, deleteAcademyInstructor, getAcademyInstructors, updateAcademyInstructor } from "../../../utils/academy-utils"
import { RootState } from "../../../store"
import { useSelector } from "react-redux"
import SlotModal from "../../template/modal"

type editInstructorsParams = {
    academy_id: string
}

const EditInstructors:FC<editInstructorsParams> = (params) => {
    const { academy_id } = params
    const [instructors, setInstructors] = useState<AcademyInstructor[]>([])
    const [focusInstructor, setFocusInstructor] = useState<AcademyInstructor | null>(null)
    const user = useSelector((state: RootState) => {return state.auth.user}) as User

    useEffect(function () {
        getInstructors(academy_id)
    }, [academy_id])

    const getInstructors = async (academy_id: string) => {
        const all_instructors = await getAcademyInstructors(academy_id) as AcademyInstructor[]
        console.log('got all instructors', all_instructors)
        setInstructors(all_instructors)
    }

    const addInstructor = async (instructor: AcademyInstructor) => {
        const instructor_bus = {...instructor, academy: academy_id, academy_classes: instructor.classes.map(c => {return c._id})}
        await createAcademyInstructor(instructor_bus, user)
        await getInstructors(academy_id)
    }

    const updateInstructor = async (instructor: AcademyInstructor) => {
        const instructor_bus = {...instructor, academy: academy_id, academy_classes: instructor.classes.map(c => {return c._id})}
        await updateAcademyInstructor(instructor_bus, user)
        await getInstructors(academy_id)
        finishEditing()
    }

    const removeInstructor = async () => {
        if (focusInstructor) {
            await deleteAcademyInstructor(focusInstructor._id, user)
            await getInstructors(academy_id)
            finishEditing()
        }
    }

    const selectToUpdate = (instructor_id: string) => {
        setFocusInstructor(instructors.filter(i => {return i._id === instructor_id})[0])
    }

    const finishEditing = () => {
        setFocusInstructor(null)
    }

    return (
        <Box sx={{width: '85%', margin: '10px auto'}}>
            <SlotModal 
                modal_content={
                <InstructorForm 
                    academy_id={academy_id} 
                    instructor={focusInstructor} 
                    edit={true} 
                    updateInstructor={updateInstructor}
                    removeInstructor={removeInstructor} />}
                open={focusInstructor !== null}
                close={finishEditing} />
            <Stack spacing={2}>
                <InstructorForm academy_id={academy_id} createInstructor={addInstructor} />
                <InstructorList read_only={false} instructors={instructors} selectToUpdate={selectToUpdate} />
            </Stack>
        </Box>
    )
}

export default EditInstructors