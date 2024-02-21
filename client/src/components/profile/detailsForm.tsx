import { Autocomplete, AutocompleteRenderInputParams, Button, FormControl, FormHelperText, FormLabel, Grid, Input, InputLabel, Stack, Switch, TextField, Typography } from "@mui/material";
import SlotCard from "../template/card";
import { BeltRank, Profile } from "../../utils/types_interfaces";
import { ChangeEvent, FC, SyntheticEvent, useEffect, useState } from "react";
import { getProfileAvailableBelts, updateProfileDetails } from "../../utils/profile-utils";
import { profile } from "console";

type ProfileDetailsFormProps = {
    userProfile: Profile,
    username: string
}
interface ProfileForm {
    [key: string]: any
}

interface BeltOption {
    label: string,
    value: string
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
    const [availableBelts, setAvailableBelts] = useState<any[]>([])
    const [defaultBelt, setDefaultBelt] = useState<BeltOption>()

    useEffect(function () {
        getBelts()
    }, [username])

    useEffect(function () {
        setProfileForm(userProfile)
        if (profileForm.belt_rank) {
            let d_belt = availableBelts.filter(b => b.value === profileForm.belt_rank)[0]
            setDefaultBelt(d_belt)
        }
    }, [userProfile])

    const handleFormChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = event.target
        setProfileForm({...profileForm, [name]: value})
    }

    const handleBeltChange = (event: any) => {
        try {
            if (!event.target) return
            const { value } = event.target
            let new_value = availableBelts.filter(b => b.label === value)[0]['value']
            event.target.value = new_value
            event.target.name = 'belt_rank'
            handleFormChange(event)
        } catch (e) {
            return
        }
    }

    const saveDetails = async () => {
        const data = await updateProfileDetails(username, profileForm)
        console.log(data)
    }

    const toggleBooleanField = (event: any, target_name: string) => {
        try {
            // event.target.name = target_name
            // event.target.value = event.target.checked
            // console.log(event.target.checked)
            setProfileForm({...profileForm, is_adult: event.target.checked})
        } catch (e) {
            return
        }
    }

    const getBelts = async () => {
        const belts = await getProfileAvailableBelts() as BeltRank[]
        const options = belts.map(b => {
            const stripes = b.stripes > 0 ? ` - ${b.stripes} stripes` : ''
            return {
                value: b._id,
                label: `${b.color}${stripes}`
            }
        })
        setAvailableBelts(options as BeltOption[])
        if (profileForm.belt_rank) {
            let d_belt = availableBelts.filter(b => b.value === profileForm.belt_rank)[0]
            setDefaultBelt(d_belt)
        }
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
                {defaultBelt !== undefined && <FormControl>
                    <Autocomplete 
                        options={availableBelts}
                        autoComplete
                        value={profileForm.belt_rank ? availableBelts.filter(b=> b.value===profileForm.belt_rank)[0] : defaultBelt}
                        onSelect={(e) => {handleBeltChange(e)}}
                        onChange={(e) => {handleBeltChange(e)}}
                        getOptionLabel={(options) => options.label}
                        renderInput={(params: AutocompleteRenderInputParams) =>{ return( 
                            <TextField 
                                {...params}
                                name="belt_rank" 
                                label="Belt Rank"
                                onChange={(e) => {handleBeltChange(e)}} />)}} />
                </FormControl>}
                <Grid container alignItems={'center'} justifyItems={'stretch'}>
                    <Grid item>
                        <Switch checked={profileForm.is_adult} onChange={(e) => toggleBooleanField(e, 'is_adult')} />
                    </Grid>
                    <Grid item>Are you over the age of 18?</Grid>
                </Grid>
                <Button fullWidth variant="outlined" onClick={() => {saveDetails()}}>Update</Button>

            </Stack>
        </SlotCard>
    )
}

export default ProfileDetailsForm;