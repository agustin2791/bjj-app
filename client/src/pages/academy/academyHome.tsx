import { Divider, Grid, Paper, Typography } from "@mui/material"
import { Link, useNavigate } from "react-router-dom"

const AcademyHome = () => {
    const navigate = useNavigate()

    const navigateTo = (nav: string) => {
        return navigate(nav)
    }
    return (<>
    <Grid sx={{width: "80%", margin: "20px auto"}} container spacing={2}>
        <Grid item sm={12}>
            <Paper sx={{width: '100%', padding: '20px'}}>
                <Typography variant="h2">Navigation</Typography>
                <Divider />
                <br />
                <Typography variant="body1">
                    If you are new or a veteran to Jiu-jitsu and are looking for a new place to train or visiting a new city and want to check out a local academy, go to the search page down below. If you are new and don’t know where to start, be mindful for some red flags, such as, academies where you have to pay for your belt promotion, toxic mentality, dirty mats, or long-term contracts only memberships. Here is a forum of helpful tips on what to look for when seeking out an academy. Hope you all find a good place to train and keep it legit!
                </Typography>
                <br />
                <Link to={'/academy/find'}>Search Page</Link>
                <br /><br />
                <Typography variant="body1">
                    Are you an instructor or academy owner? We user Google Maps so you can search for your academy and register it to your account or you can register directly using the link below<br />
                    <Link to="/academy/create">Register Academy</Link>
                </Typography>
            </Paper>
        </Grid>
    </Grid>
    </>)
}

export default AcademyHome