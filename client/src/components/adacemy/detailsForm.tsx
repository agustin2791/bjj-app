import { ChangeEvent, FC, useEffect, useState } from "react"
import { Academy, User } from "../../utils/types_interfaces"
import { Backdrop, Button, CircularProgress, FormControlLabel, FormGroup, Grid, Stack, Switch, TextField } from "@mui/material"
import SlotCard from "../template/card"
import { RootState } from "../../store"
import { useSelector } from "react-redux"
import { createNewAcademy, updateAcademyDetails } from "../../utils/academy-utils"
import { useLocation, useSearchParams } from "react-router-dom"


const defaultAcademyForm: Academy = {
    name: '',
    slug: '',
    address: {
        street: '',
        city: '',
        state: '',
        zip_code: '',
        country: ''
    },
    phone_number: '',
    preferred_email: '',
    affiliation: '',
    affiliation_id: '',
    owner: {} as User,
    head_instructor: '',
    head_instructor_id: undefined,
    private: false,
    website: ''
}

type FormProps = {
    isEdit?: boolean,
    academyEdit?: Academy
}
const AcademyDetailForm: FC<FormProps> = (props) => {
    const {isEdit, academyEdit} = props
    const { search } = useLocation()
    const [academyForm, setAcademyForm] = useState<Academy>(defaultAcademyForm)
    const [loading, setLoading] = useState(false)
    const user = useSelector((state: RootState) => state.auth.user) as User 
    const [searchParams, setSearchParams] = useSearchParams()

    useEffect(function () {
        if (academyEdit !== undefined)
            setAcademyForm(academyEdit)
    }, [academyEdit])
    useEffect(function () {
        console.log(search)
        if (!isEdit){
            console.log('getting query')
            try {
                // const query = useMemo(() => new URLSearchParams(search), [search])
                // console.log(query)
                setAcademyForm({...academyForm, name: searchParams.get('name') as string, 
                address: {
                    street: searchParams.get('street') as string,
                    city: searchParams.get('city') as string,
                    state: searchParams.get('state') as string,
                    country: searchParams.get('country') as string,
                    zip_code: searchParams.get('zip') as string

                }})
            }
            catch (e) {
                console.error(e)
                return
            }
        }
    }, [isEdit])

    const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const {name, value} = event.target
        if (['street', 'city', 'state', 'zip_code', 'country'].includes(name)) {
            setAcademyForm({...academyForm, address: {...academyForm.address, [name]: value}})
        } else if (name === 'private') {
            const event_private = event as ChangeEvent<HTMLInputElement>
            setAcademyForm({...academyForm, private: event_private.target.checked})
        } else {
            setAcademyForm({...academyForm, [name]: value})
        }
        
    }

    const clearForm = () => {
        setAcademyForm(defaultAcademyForm)
    }

    const submitForm = async () => {
        if (!isEdit){
            setLoading(true)
            const slug = academyForm.name.replace(/ /g, '-').toLowerCase()
            setAcademyForm({...academyForm, slug: slug})
            const academy_data = await createNewAcademy(academyForm, user) as Academy
            setLoading(false)
            window.location.href = `/academy/edit/${slug}`
        } else {
            setLoading(true)
            const academy_data = await updateAcademyDetails(academyForm, user)
            setLoading(false)
        }
    }
    return (
        <>
        <div style={{width: '50%', margin: '10px auto'}}>
            <Backdrop
                open={loading}>
                    <CircularProgress color="inherit" />
            </Backdrop>
        <SlotCard>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <h2>New Academy</h2>
                </Grid>
                <Grid item xs={12}>
                    <p>This is a primilinary form to create a new academy to display. You can later edit and update the information, create a schedule to display, add/remove instructors, and add/remove students.</p>
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth label="Academy Name" name="name" value={academyForm.name} onChange={(e) => {handleInputChange(e)}}></TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth label="Affiliation" name="affiliation" value={academyForm.affiliation} onChange={(e) => {handleInputChange(e)}}></TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label="Website" name="website" value={academyForm.website} onChange={(e) => {handleInputChange(e)}}></TextField>
                </Grid>
                <Grid item xs={12}>
                    <TextField fullWidth label="Address" name="street" value={academyForm.address.street} onChange={(e) => {handleInputChange(e)}}></TextField>
                </Grid>
                <Grid item xs={4}>
                    <TextField fullWidth label="City" name="city" value={academyForm.address.city} onChange={(e) => {handleInputChange(e)}}></TextField>
                </Grid>
                <Grid item xs={2}>
                    <TextField fullWidth label="State/Province" name="state" value={academyForm.address.state} onChange={(e) => {handleInputChange(e)}}></TextField>
                </Grid>
                <Grid item xs={3}>
                    <TextField fullWidth label="Zip/Postal Code" name="zip_code" value={academyForm.address.zip_code} onChange={(e) => {handleInputChange(e)}}></TextField>
                </Grid>
                <Grid item xs={3}>
                <TextField fullWidth label="Country" name="country" value={academyForm.address.country} onChange={(e) => {handleInputChange(e)}}></TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Preferred Email" name="preferred_email" fullWidth value={academyForm.preferred_email} onChange={e => {handleInputChange(e)}} helperText="This email will be displayed for all to see"></TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth label="Phone Number" name="phone_number" value={academyForm.phone_number} onChange={(e) => {handleInputChange(e)}} helperText="This phone number will be displayed for all to see"></TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField label="Owner" fullWidth value={user.username} disabled helperText="This is the owner of the page, it will be treated as an admin for managing this academy in this site."></TextField>
                </Grid>
                <Grid item xs={6}>
                    <TextField fullWidth label="Head Instructor" name="head_instructor" value={academyForm.head_instructor} onChange={(e) => {handleInputChange(e)}}></TextField>
                </Grid>
                <Grid item xs={6}>
                    <FormGroup>
                        <FormControlLabel control={<Switch checked={academyForm.private} name="private" onChange={(e) => {handleInputChange(e)}} />} label="Make it Private" />
                    </FormGroup>
                </Grid>
                <Grid item xs={6}>
                    <Grid container spacing={2}>
                        {!isEdit && 
                            <Grid item xs={6}><Button fullWidth variant="outlined" color="info" onClick={() => {clearForm()}}>Clear</Button></Grid>}
                        <Grid item xs={isEdit ? 12 : 6}><Button fullWidth variant="outlined" color="success" onClick={() => {submitForm()}}>{isEdit ? 'Update' : 'Create Academy'}</Button></Grid>
                    </Grid>
                </Grid>
            </Grid>
        </SlotCard>
        </div>
        
        </>
    )
}

export default AcademyDetailForm