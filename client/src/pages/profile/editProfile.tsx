import { ChangeEvent, useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { RootState } from "../../store"
import { Academy, Channel, Profile, User } from "../../utils/types_interfaces"
import { Button, Grid, Stack, styled } from "@mui/material"
import { CloudUpload } from "@mui/icons-material"
import { getProfile, updateProfileDetails, updateProfileImage } from "../../utils/profile-utils"
import { useNavigate, useParams } from "react-router-dom"
import ProfileUpdateImage from "../../components/profile/updateImage"
import ProfileDetailsForm from "../../components/profile/detailsForm"
import PostSubscriptionList from "../../components/profile/postSubscriptionList"
import AcademySubscriptionList from "../../components/profile/academySubscriptionList"
import { set_profile } from "../../store/auth"

const EditUserProfile = () => {
    const [newImage, setNewImage] = useState<File>()
    const [userProfile, setUserProfile] = useState<Profile>()
    const { username } = useParams()
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const user = useSelector((state: RootState) => { return state.auth.user}) as User
    const profile = useSelector((state: RootState) => { return state.auth.profile }) as Profile

    useEffect(function() {
        if (username !== user.username) {
            navigate('/')
        } else {
            getUserProfile()
        }
    }, [username])

    useEffect(function() {
        setUserProfile(profile)
    }, [profile])

    const getUserProfile = async () => {
        if (username){
            const updated_profile = await getProfile(username)
            dispatch(set_profile(updated_profile))
        }

    }

    const updateSubscriptions = async (sub_id: string, type: string) => {
        if (!username) return
        if (type === 'academy') {
            if (userProfile?.academy_subs) {
                const subs = userProfile?.academy_subs?.filter(s => {return s?._id !== sub_id}) as Academy[]
                setUserProfile({...userProfile, academy_subs: subs})
            } else {return}
        } else if (type === 'posts') {
            if (userProfile?.channel_subs) {
                const subs = userProfile?.channel_subs?.filter(s => {return s?._id !== sub_id}) as Channel[]
                setUserProfile({...userProfile, channel_subs: subs})
            } else {return}
        } else {return}
        
        const profile_update = await updateProfileDetails(username, userProfile)
        dispatch(set_profile(profile_update))
    }

    

    return (<>
    <Grid sx={{margin: '10px auto'}} container columnSpacing={2} alignItems={'stretch'} justifyContent='center'>
        <Grid sx={{maxWidth: '350px'}} item container justifyContent={'stretch'}>
            <Stack spacing={2} sx={{width: '100%'}} justifyContent={'stretch'}>
                <ProfileUpdateImage username={username} image={userProfile?.image} imageUpdated={getUserProfile} />
                
            </Stack>
        </Grid>
        <Grid item sm={8}>
            <Stack rowGap={2}>
                <ProfileDetailsForm
                    username={username ? username : ''}
                    userProfile={userProfile ? userProfile : {} as Profile} />
                <Grid container columnSpacing={2} alignItems={'stretch'}>
                    <Grid item sm={12} md={6}>
                        {profile?.channel_subs && 
                        <PostSubscriptionList subscriptions={profile?.channel_subs} updateSubs={updateSubscriptions}></PostSubscriptionList>}
                    </Grid>
                    <Grid item sm={12} md={6}>
                        {userProfile?.academy_subs &&
                        <AcademySubscriptionList subscriptions={userProfile?.academy_subs} updateSubs={updateSubscriptions}></AcademySubscriptionList>}
                    </Grid>
                </Grid>
            </Stack>
            
        </Grid>
    </Grid>
    
    </>)
}

export default EditUserProfile