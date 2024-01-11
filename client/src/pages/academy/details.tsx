import { Box, Grid, Typography } from "@mui/material";
import MapView from "../../components/adacemy/map";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAcademyDetails } from "../../utils/academy-utils";
import { useSelector } from "react-redux";
import { RootState } from "../../store/index";
import { Academy, User } from "../../utils/types_interfaces";

const AcademyDetails = () => {
    const {slug} = useParams()
    const user = useSelector((state: RootState) => {return state.auth.user}) as User
    const [academy, setAcademy] = useState<Academy>()

    useEffect(function () {
        if (slug) {
            getAcademy()
        }
    }, [slug])

    const getAcademy = async () => {
        if (slug) {
            console.log(slug)
            const details = await getAcademyDetails(slug, user)
            setAcademy(details as Academy)
            
        }
    }
    return (<>
    <Box sx={{width: '100%', height: '100%'}}>
        {academy ? 
        <Grid container spacing={2} alignItems='center'>
            
            <Grid item sm={12} md={10} sx={{margin: '10px auto'}}>
                <Typography variant="h1">Academy details</Typography>
                <Grid container spacing={2}>
                    <Grid item sm={12} md={6}>
                        <MapView multiple={false} height="300px" location={academy.location ? academy.location : undefined} />
                    </Grid>
                </Grid>
            </Grid>
        </Grid> : <div>...Still looking</div>}
    </Box>
    </>)
}

export default AcademyDetails;