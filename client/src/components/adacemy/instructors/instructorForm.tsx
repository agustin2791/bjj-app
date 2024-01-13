import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, MenuItem, Select, TextField } from "@mui/material"
import { ChangeEvent, useState } from "react"
import SlotCard from "../../template/card"

interface instructor {
    name: string,
    belt_rank: string,
    classes: string[],
    isHeadInstructor?: boolean,
    id?: string,
    hasProfile: boolean
}

const defaultNewInstructor: instructor = {
    name: '',
    belt_rank: 'Black',
    classes: [] as string[],
    hasProfile: false
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

const InstructorForm = () => {
    const [newInstructor, setNewInstructor] = useState<instructor>(defaultNewInstructor)
    const [classCount, setClassCount] = useState(0)
    const [isUser, setIsUser] = useState(false)

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

    const updateClass = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, class_id: number) => {
        const {value} = event.target
        let classes = [...newInstructor.classes]
        classes[class_id] = value
        setNewInstructor({...newInstructor, classes: classes})
    }

    const addClass = () => {
        setNewInstructor({...newInstructor, classes: [...newInstructor.classes, '']})
    }

    const removeClass = (class_id: number) => {
        let original_classes = newInstructor.classes
        original_classes.splice(class_id, 1)
        setNewInstructor({...newInstructor, classes: original_classes})
    }

    return (<>
    <SlotCard>
        <Grid container spacing={2}>
            <Grid item sm={12}>
                <FormControl variant="standard">
                    {/* <FormLabel component='legend'></FormLabel> */}
                    <FormControlLabel label='Does this instructor have a profile with us?' control={<Checkbox onChange={(e) => {handleCheckboxChange(e, 'hasProfile')}}></Checkbox>} />
                </FormControl>
            </Grid>
            
            {!newInstructor.hasProfile && <>
            <Grid item sm={6}>
                <TextField label="Instructor Name" type="text" name="name" value={newInstructor.name} onChange={(e) => {handleInputChange(e)}} fullWidth></TextField>
            </Grid>
            <Grid item sm={6}>
                <Select label="Belt Rank" value={newInstructor.belt_rank} onChange={(e) => {selectBeltRank(e)}} fullWidth>
                    {beltRanks.map(b => { return (
                        <MenuItem key={b} value={b}>{b}</MenuItem>
                    )})}
                </Select>
            </Grid></> || <>
            
            </>}
            <Grid item sm={12}>
                <Button color="primary" onClick={addClass}>Add Class</Button> 
            </Grid>
            {newInstructor.classes.length > 0 && 
                newInstructor.classes.map((m, index) => { return (
                <Grid item sm={12} container key={index} spacing={2}>
                    <Grid item sm={10}>
                        <TextField label="Class Name" name={`class-${index}`} value={m} onChange={(e) => {updateClass(e, index)}} fullWidth></TextField>
                    </Grid>
                    <Grid item alignSelf={'center'} sm={2}>
                        <Button color="error" onClick={() => {removeClass(index)}}>Remove Class</Button>
                    </Grid>
                </Grid>
                )})
            }
            <Grid item sm={4}>
                <Button color="success" variant="outlined" fullWidth>Submit & Add</Button>
            </Grid>
        </Grid>
    </SlotCard>
    </>)
}

export default InstructorForm