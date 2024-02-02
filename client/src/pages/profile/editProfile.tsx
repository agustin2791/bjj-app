import { ChangeEvent, useEffect, useState } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../store"
import { Profile, User } from "../../utils/types_interfaces"
import { Button, Grid, Stack, styled } from "@mui/material"
import { CloudUpload } from "@mui/icons-material"
import { getProfile, updateProfileImage } from "../../utils/profile-utils"
import { useParams } from "react-router-dom"
import ProfileUpdateImage from "../../components/profile/updateImage"
import ProfileDetailsForm from "../../components/profile/detailsForm"

const EditUserProfile = () => {
    const [newImage, setNewImage] = useState<File>()
    const [userProfile, setUserProfile] = useState<Profile>()
    const { username } = useParams()
    const user = useSelector((state: RootState) => { return state.auth.user}) as User

    useEffect(function() {
        getUserProfile()
    }, [username])

    const getUserProfile = async () => {
        const profile = await getProfile(username as string)
        console.log(profile)
        setUserProfile(profile as Profile)
    }

    

    return (<>
    <Grid sx={{margin: '10px auto'}} container spacing={2} alignItems={'stretch'} justifyContent='center'>
        <Grid sx={{maxWidth: '350px'}} item container justifyContent={'center'}>
            <Stack spacing={2} sx={{width: '100%'}} justifyContent={'center'}>
                <ProfileUpdateImage username={username} image={userProfile?.image} imageUpdated={getUserProfile} />
                
            </Stack>
        </Grid>
        <Grid item sm={8}>
            <Stack spacing={2}>
                <ProfileDetailsForm
                    username={username ? username : ''}
                    userProfile={userProfile ? userProfile : {} as Profile} />
                <Grid container spacing={2} alignItems={'stretch'}>
                    <Grid item sm={12} md={6}></Grid>
                    <Grid item sm={12} md={6}></Grid>
                </Grid>
            </Stack>
            
        </Grid>
    </Grid>
    
    </>)
}

export default EditUserProfile