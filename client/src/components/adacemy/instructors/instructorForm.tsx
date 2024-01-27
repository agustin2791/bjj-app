import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material"
import { ChangeEvent, FC, useEffect, useState } from "react"
import SlotCard from "../../template/card"
import { getAcademyClasses } from "../../../utils/academy-utils"
import { AcademyClass, AcademyInstructor } from "../../../utils/types_interfaces"

interface instructor {
    name: string,
    belt_rank: string,
    classes: string[],
    isHeadInstructor?: boolean,
    id?: string,
    hasProfile: boolean
}

type instructorFormParams = {
    academy_id: string,
    edit?: boolean,
    instructor?: AcademyInstructor | null,
    createInstructor?: Function,
    updateInstructor?: Function,
    removeInstructor?: Function
}
const defaultNewInstructor: AcademyInstructor = {
    name: '',
    belt_rank: 'Black',
    classes: [] as AcademyClass[]
}

const beltRanks = [
    'White', 'White - one stripe', 'White - two stripe', 'White - three stripe', 'White - four stripe',
    'Blue', 'Blue - one stripe', 'Blue - two stripe', 'Blue - three stripe', 'Blue - four stripe',
    'Purple', 'Purple - one stripe', 'Purple - two stripe', 'Purple - three stripe', 'Purple - four stripe',
    'Brown', 'Brown - one stripe', 'Brown - two stripe', 'Brown - three stripe', 'Brown - four stripe',
    'Black', 'First degree Black Belt', 'Second degree Black Belt', 'Third degree Black Belt', 'Fourth degree Black Belt',
    'Fifth degree Black Belt', 'Sixth degree Black Belt', 'Seventh degree Red & Black Belt', 'Eight degree Red & Black Belt',
    'Ninth degree Black Belt (Red)', 'Tenth degree Black Belt (Red)',
]

const InstructorForm:FC<instructorFormParams> = (params) => {
    const { academy_id, createInstructor, edit, instructor, updateInstructor, removeInstructor } = params
    const [newInstructor, setNewInstructor] = useState<AcademyInstructor>(instructor ? instructor : defaultNewInstructor)
    const [allClasses, setAllClasses] = useState<AcademyClass[]>([])
    const [classCount, setClassCount] = useState(0)
    const [isUser, setIsUser] = useState(false)

    useEffect(function() {
        getClasses()
    }, [academy_id])

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target
        
        setNewInstructor({...newInstructor, [name]: value})
        
    }

    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>, focus: string) => {
        setNewInstructor({...newInstructor, [focus]: event.target.checked})
    }

    const selectBeltRank = (event: any) => {
        try {
            event.target.name = 'belt_rank'
            handleInputChange(event)
        } catch (e) {
            return
        }
    }

    const getClasses = async () => {
        const all_classes = await getAcademyClasses(academy_id) as AcademyClass[]
        setAllClasses(all_classes)
    }

    const updateClass = (event: SelectChangeEvent<string>, class_id: number) => {
        const {value} = event.target
        console.log(event)
        let classes = [...newInstructor.classes] as AcademyClass[]
        let class_chosen = allClasses.filter((c) => c._id === value)[0] as AcademyClass
        classes.splice(class_id, 1, class_chosen)
        setNewInstructor({...newInstructor, classes: classes})
    }

    const addClass = () => {
        setNewInstructor({...newInstructor, classes: [...newInstructor.classes, allClasses[0]]})
    }

    const removeClass = (class_id: number) => {
        let original_classes = newInstructor.classes
        original_classes.splice(class_id, 1)
        setNewInstructor({...newInstructor, classes: original_classes})
    }

    const submitNewInstructor = () => {
        if (createInstructor) createInstructor(newInstructor)
        if (edit && updateInstructor) updateInstructor(newInstructor)
        setNewInstructor(defaultNewInstructor)
    }

    return (<>
    <SlotCard>
        <Grid container spacing={2}>
            {/* <Grid item sm={12}>
                <FormControl variant="standard">
                    <FormControlLabel label='Does this instructor have a profile with us?' control={<Checkbox onChange={(e) => {handleCheckboxChange(e, 'hasProfile')}}></Checkbox>} />
                </FormControl>
            </Grid> */}
            
            <Grid item sm={6}>
                <TextField label="Instructor Name" type="text" name="name" value={newInstructor.name} onChange={(e) => {handleInputChange(e)}} fullWidth></TextField>
            </Grid>
            <Grid item sm={6}>
                <Select label="Belt Rank" value={newInstructor.belt_rank} onChange={(e) => {selectBeltRank(e)}} fullWidth>
                    {beltRanks.map(b => { return (
                        <MenuItem key={b} value={b}>{b}</MenuItem>
                    )})}
                </Select>
            </Grid>
            <Grid item sm={12}>
                <Button color="primary" onClick={addClass}>Add Class</Button> 
            </Grid>
            {newInstructor.classes.length > 0 && 
                newInstructor.classes.map((m, index) => { return (
                <Grid item sm={12} container key={index} spacing={2}>
                    <Grid item sm={10}>
                        <Select
                            value={m._id}
                            onChange={(e) => {updateClass(e, index)}}
                            fullWidth>
                            {allClasses.map(c => {
                                return (
                                    <MenuItem key={c.name} value={c._id}>{c.name}</MenuItem>
                                )
                            })}
                        </Select>
                        {/* <TextField label="Class Name" name={`class-${index}`} value={m} onChange={(e) => {updateClass(e, index)}} fullWidth></TextField> */}
                    </Grid>
                    <Grid item alignSelf={'center'} sm={2}>
                        <Button color="error" onClick={() => {removeClass(index)}}>Remove Class</Button>
                    </Grid>
                </Grid>
                )})
            }
            <Grid item sm={4}>
                <Button color="success" variant="outlined" onClick={submitNewInstructor} fullWidth>{edit ? 'Update' : 'Add'}</Button>
                {edit && removeInstructor &&
                <Button color="error" variant="outlined" onClick={() => {removeInstructor()}} fullWidth>Remove</Button>}
            </Grid>
        </Grid>
    </SlotCard>
    </>)
}

export default InstructorForm