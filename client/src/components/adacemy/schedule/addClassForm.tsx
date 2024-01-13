import { ChangeEvent, FC, useEffect, useState } from "react"
import { createAcademyClass, updateAcademyClass } from "../../../utils/academy-utils"
import { AcademyClass, User } from "../../../utils/types_interfaces"
import { Button, Grid, Paper, TextField } from "@mui/material"
import { useSelector } from "react-redux"
import { RootState } from "../../../store"

type classFormFields = {
    name: string,
    details: string
}

const defaultClassForm: classFormFields = {
    name: '',
    details: ''
}

type classFormProps = {
    academy_id: string,
    addNewClass: Function,
    classDetails?: AcademyClass,
    isEdit?: boolean
}
const AddClassForm: FC<classFormProps> = (props) => {
    const { academy_id, addNewClass, isEdit, classDetails } = props
    const [classForm, setClassForm] = useState<classFormFields>(defaultClassForm)
    const user = useSelector((state: RootState) => {return state.auth.user}) as User

    useEffect(function () {
        if (isEdit && classDetails) {
            setClassForm({name: classDetails?.name, details: classDetails?.details})
        }
    }, [classDetails])

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target

        setClassForm({...classForm, [name]: value})
    }

    const submitNewClass = async () => {
        const class_payload: AcademyClass = {...classForm, academy: academy_id}
        const new_class = await createAcademyClass(class_payload, academy_id) as AcademyClass
        console.log('return new class', new_class)
        addNewClass(new_class)
        setClassForm(defaultClassForm)
    }

    const updateClass = async () => {
        const update_class_details = {...classDetails, name: classForm.name, details: classForm.details} as AcademyClass
        const update_class = await updateAcademyClass(update_class_details, user) as AcademyClass
        addNewClass(update_class, true)
    }

    return (<>
    <Paper sx={{padding: '10px'}}>
        <Grid container spacing={2}>
            <Grid item sm={12}>
                <TextField fullWidth value={classForm.name} label="Class Name" name="name" onChange={(e) => {handleInputChange(e)}}></TextField>
            </Grid>
            <Grid item sm={12}>
                <TextField fullWidth value={classForm.details} label="Class Details" name="details" onChange={(e) => {handleInputChange(e)}} multiline rows={4}></TextField>
            </Grid>
            <Grid item sm={6}>
                <Button color="success" onClick={isEdit ? updateClass : submitNewClass} variant="outlined" fullWidth>
                    {isEdit ? 'Update Class' : 'Add Class'}
                </Button>
            </Grid>
        </Grid>
    </Paper>
    </>)
}

export default AddClassForm