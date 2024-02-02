import { Button, FormControl, FormHelperText, FormLabel, Input, InputLabel, Stack, TextField, Typography } from "@mui/material";
import SlotCard from "../template/card";
import { Profile } from "../../utils/types_interfaces";
import { ChangeEvent, FC, useEffect, useState } from "react";
import { updateProfileDetails } from "../../utils/profile-utils";

type ProfileDetailsFormProps = {
    userProfile: Profile,
    username: string
}
interface ProfileForm {
    [key: string]: any
}
const form_helper = ['name', 'affiliation', 'location']
const name_helper_text: {[key: string]: string} = {
    ['name']: "This will not change your username, this is the option for you to change your name in order for other users to identify you by your real name",
    ['affiliation']: '',
    ['loacation']: ''
}
const ProfileDetailsForm: FC<ProfileDetailsFormProps> = (props) => {
    const { userProfile, username} = props
    const [profileForm, setProfileForm] = useState<Profile>(userProfile)
    useEffect(function () {
        setProfileForm(userProfile)
    }, [userProfile])

    const handleFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setProfileForm({...profileForm, [name]: value})
    }

    const saveDetails = async () => {
        const data = await updateProfileDetails(username, profileForm)
        console.log(data)
    }
    return (
        <SlotCard>
            <Stack spacing={2}>
                <Typography variant="h3">Profile Details</Typography>
                {form_helper.map((f) => {
                    return (
                        <FormControl>
                            <InputLabel shrink>{f.toUpperCase()}</InputLabel>
                            <Input
                                key={f}
                                value={profileForm[f as keyof Profile]}
                                name={f}
                                
                                onChange={(e) => {handleFormChange(e)}} />
                            <FormHelperText>
                                {name_helper_text[f]}
                            </FormHelperText>
                        </FormControl>
                        
                        )
                    })
                }
                <Button fullWidth variant="outlined" onClick={() => {saveDetails()}}>Update</Button>

            </Stack>
        </SlotCard>
    )
}

export default ProfileDetailsForm;