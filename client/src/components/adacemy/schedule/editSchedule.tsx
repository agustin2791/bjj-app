import { Box, Stack, Tab, Tabs } from "@mui/material"
import AcademyClassList from "./classList"
import { useEffect, useState } from "react"
import { Academy, AcademyClass, User } from "../../../utils/types_interfaces"
import { useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import { RootState } from "../../../store"
import { getAcademyClasses, getAcademyDetails } from "../../../utils/academy-utils"
import AddClassForm from "./addClassForm"
import AddEditSchedule from "./addEditSchedule"

const EditAcademySchedule = () => {
    const [editFocus, setEditFocus] = useState('schedule')
    const [allClassList, setAllClassList] = useState<AcademyClass[]>([] as AcademyClass[])
    const [academyId, setAcademyId] = useState('')
    const [toggleNewClass, setToggleNewClass] = useState(false)
    const [classChanges, setClassChanges] = useState(0)
    const { slug } = useParams()
    const user = useSelector((state: RootState) => {return state.auth.user}) as User

    useEffect(function() {
        console.log('getting academy details for schedule')
        getADetails()
    }, [slug])

    useEffect(function () {
        if (academyId)
            getClassList(academyId)
    }, [classChanges])

    const getADetails = async () => {
        if (slug) {
            console.log(slug)
            const details = await getAcademyDetails(slug) as Academy
            console.log('academy details', details)
            setAcademyId(details._id ? details._id : '')
            console.log(academyId)
            if (details._id) {
                console.log('getting academy classes', academyId)
                await getClassList(details._id)
            }
        }
    }

    const getClassList = async (a_id: string) => {
        const class_list = await getAcademyClasses(a_id) as AcademyClass[]
        console.log('class list', class_list)
        setAllClassList(class_list)
    }
    const addClassToList = (new_class: AcademyClass, isEdit: boolean = false) => {
        if (isEdit) {
            const updated_classes = allClassList.map((c) => {
                if (c._id === new_class._id) {
                    return new_class
                } else {
                    return c
                }
            })
            setAllClassList(updated_classes)
        } else {
            console.log('adding class', new_class)
            setAllClassList([...allClassList, new_class])
            setToggleNewClass(false)
        }
    }

    const removeClassFromList = (class_id: string) => {
        const updated_classes = allClassList.filter(c => c._id !== class_id)
        setAllClassList(updated_classes)
    }

    const changeFocus = (event: React.SyntheticEvent, focus: string) => {
        setEditFocus(focus)
    }

    const classUpdated = () => {
        setClassChanges(classChanges + 1)
    }

    return (
        <Box>
            <Tabs
                value={editFocus}
                onChange={changeFocus}>
                <Tab value="schedule" label="Schedule" />
                <Tab value="classes" label="Classes" />
            </Tabs>
            <div role="tabpanel" hidden={editFocus !== 'schedule'} id="tab-scheulde">
                <Stack spacing={3} sx={{width: '95%'}}>
                    <AddEditSchedule class_list={allClassList} user={user} update_class={classUpdated} />
                </Stack>
            </div>
            <div role="tabpanel" hidden={editFocus !== 'classes'} id="tab-classes">
                <Stack spacing={3} sx={{width: '95%'}} >
                    
                    <AddClassForm academy_id={academyId} addNewClass={addClassToList}></AddClassForm>
                    <AcademyClassList academy_class_list={allClassList} academy_id={academyId} update={addClassToList} deleteClass={removeClassFromList} edit={true}></AcademyClassList>
                </Stack>
            </div>
        </Box>
    )
}

export default EditAcademySchedule