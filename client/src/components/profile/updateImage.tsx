import { Button, Grid, Paper, Stack, styled } from "@mui/material"
import { ChangeEvent, FC, useState } from "react"
import { updateProfileImage } from "../../utils/profile-utils"
import { AccountCircle, CloudUpload } from "@mui/icons-material"
import ProfilePicture from "./picture"

type UpdateImageProps = {
    username: string | undefined,
    image: string | undefined,
    imageUpdated: Function
}

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
})

const ProfileUpdateImage:FC<UpdateImageProps> = (props) => {
    const { username, image, imageUpdated } = props
    const [newImage, setNewImage] = useState<File>()

    const submitNewImage = async () => {
        let formData = new FormData()
        if (!newImage) {
            console.log('no new image')
            return
        }
        formData.append("image", newImage)
        formData.append("username", username as string)
        console.log(formData)
        const data = await updateProfileImage(formData)
        imageUpdated()
    }

    const addImage = (event: ChangeEvent<HTMLInputElement>) => {
        if (event.target.files){
            console.log(event.target.files)
            setNewImage(event.target.files[0])
        }
    }

    return  (
        <Paper sx={{width: '100%', padding: '20px'}}>
            <Grid container justifyContent={'center'}>
                <Grid item sx={{minWidth: '320px', padding: '10px'}} alignContent={'center'}>
                    <Stack spacing={2} justifyContent={'center'}>
                        <ProfilePicture username={username} image={image} />
                        <Button component="label" variant="contained" startIcon={<CloudUpload />}>
                            Upload new profile picture
                            <VisuallyHiddenInput type="file" onChange={(e) => {addImage(e)}} />
                        </Button>
                        <Button disabled={!newImage} onClick={() => {submitNewImage()}} variant='outlined'>Submit</Button>
                    </Stack>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default ProfileUpdateImage