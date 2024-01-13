import { FC, useEffect, useState } from "react";
import { AcademyClass, User } from "../../../utils/types_interfaces";
import { useParams } from "react-router-dom";
import { deleteAcademyClass, getAcademyClasses } from "../../../utils/academy-utils";
import { Box, Button, ButtonGroup, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Grid, List, ListItem, Paper, Typography } from "@mui/material";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import SlotModal from "../../template/modal";
import AddClassForm from "./addClassForm";

type listProps = {
    academy_id: string,
    academy_class_list: AcademyClass[],
    update: Function,
    deleteClass: Function
}
const AcademyClassList: FC<listProps> = (props) => {
    const { academy_id, academy_class_list, update, deleteClass } = props
    const { slug } = useParams()
    const [classFocus, setClassFocus] = useState<AcademyClass>()
    const [showModule, setShowModule] = useState(false)
    const [showDelete, setShowDelete] = useState(false)
    const user = useSelector((state: RootState) => {return state.auth.user}) as User
    
    const closeModal = () => {
        setShowModule(false)
    }

    const openEdit = (class_id: string) => {
        const get_class = academy_class_list.filter(c => c._id === class_id)
        if (get_class.length > 0) {
            setClassFocus(get_class[0])
            setShowModule(true)
        }
    }

    const openDelete = (class_id: string) => {
        const get_class = academy_class_list.filter(c => c._id === class_id)
        if (get_class.length > 0) {
            setClassFocus(get_class[0])
            setShowDelete(true)
        }
    }

    const submitEdit = (class_details: AcademyClass, edit: boolean) => {
        update(class_details, edit)
    }

    const confirmDelete = async () => {
        console.log('delete class')
        if (classFocus){
            await deleteAcademyClass(classFocus, user).then((res) => {
                deleteClass(classFocus?._id)
                setShowDelete(false)
            })
        }
        
    }

    return (
        <>
        <SlotModal open={showModule} 
            modal_content={<AddClassForm academy_id={academy_id} addNewClass={submitEdit} isEdit={true} classDetails={classFocus} />} 
            close={closeModal}></SlotModal>
        <Dialog
            open={showDelete}
            onClose={() => {setShowDelete(false)}}
            >
                <DialogTitle>Remove This Class</DialogTitle>
                <DialogContent>
                    <DialogContentText>Are you sure you want to delete this class? It will automatically remove this class from the schedule</DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {confirmDelete()}} color="error">Delete</Button>
                    <Button onClick={() => {setShowDelete(false)}}>Cancel</Button>
                </DialogActions>
            </Dialog>
        <Paper sx={{padding: '10px'}}>
            <Box>
                <List>
                    {academy_class_list.map((l, index) => {
                        return (
                            <ListItem key={index}>
                                <Grid container>
                                    <Grid item sm={8}>
                                        <Typography variant="body1">{l.name}</Typography>
                                        <Typography sx={{color: '#999'}} variant="caption">{l.details}</Typography>
                                    </Grid>
                                    <Grid item sm={4} sx={{textAlign: 'right'}}>
                                        <ButtonGroup>
                                            <Button color="primary" onClick={() => {openEdit(l._id ? l._id : '')}}>Edit</Button>
                                            <Button color="error" onClick={() => {openDelete(l._id ? l._id : '')}}>Delete</Button>
                                        </ButtonGroup>
                                    </Grid>
                                    <Grid item sm={10}>
                                        <Divider />
                                    </Grid>
                                </Grid>
                                
                            </ListItem>
                        )
                    })}
                </List>
            </Box>
        </Paper>
        </>
    )
}

export default AcademyClassList;