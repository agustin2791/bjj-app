import { Box, Button, Grid, Typography } from "@mui/material";
import { FC } from "react";
import { useNavigate } from "react-router-dom";

type detailsProps = {
    name: string,
    slug?: string,
    has_page: boolean,
    address: string,
    head_instructor?: string,
    phone_number?: string,
    website?: string,
    email?: string
}
const FindDetails: FC<detailsProps> = (props) => {
    const { name, slug, has_page, address, head_instructor, phone_number, website, email } = props
    const navigate = useNavigate()

    const goToPage = (path: string) => {
        return navigate(path)
    }

    const goToRegister = () => {
        console.log(address)
        if (address) {
            let [street, city, statezip, country] = address.split(',')
            console.log(statezip)
            let [blank, state, zip] = statezip.split(' ')
            const url_path = `/academy/create?name=${name}&street=${street}&city=${city}&state=${state}&zip=${zip}&country=${country}`.replace(/ /g, '%20')
            console.log(url_path)
            return navigate(url_path)
        }
    }
    return (
        <Box className="details-container">
        <Grid className="academy_find_details" container alignItems="stretch" sx={{textAlign: 'center'}} spacing={3}>
            <Grid item sm={12}>
                <Typography variant='h3'>{name}</Typography>
            </Grid>
            <Grid item sm={12}>
                <Typography variant='subtitle1'><b>Address: </b>{address}</Typography>
            </Grid>
            {head_instructor ? 
            <Grid item sm={12}>
                <Typography variant='subtitle1'><b>Head Instructor: </b>{head_instructor}</Typography>
            </Grid> : <></>}
            {phone_number ? 
            <Grid item sm={12}>
                <Typography variant='subtitle2'><b>Phone Number: </b>{phone_number}</Typography>
            </Grid> : <></>}
            {website ? 
            <Grid item sm={12}>
                <Typography variant='subtitle2'><b>Website: </b><a href={website} target="_blank">{website}</a></Typography>
            </Grid> : <></>}
            {email ? 
            <Grid item sm={12}>
                <Typography variant='subtitle2'><b>Email: </b>{email}</Typography>
            </Grid> : <></>}
            <Grid item sm={12}>
            {has_page ? 
                <Button variant="outlined" color="primary" onClick={() => {goToPage('/academy/' + slug)}}>Go To Page</Button>
            :   <Button variant="outlined" color="primary" onClick={() => {goToRegister()}}>Register this Academy</Button>}
            </Grid>
        </Grid>
        </Box>
    )
}

export default FindDetails;