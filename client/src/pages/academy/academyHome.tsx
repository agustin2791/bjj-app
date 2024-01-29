import { Grid, Paper, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"

const AcademyHome = () => {
    const navigate = useNavigate()

    const navigateTo = (nav: string) => {
        return navigate(nav)
    }
    return (<>
    <Grid sx={{width: "80%", margin: "20px auto"}} container spacing={2}>
        <Grid item>
            <Paper sx={{width: '100%', padding: '20px'}}><Typography variant="h2">Navigation</Typography></Paper>
        </Grid>
    </Grid>
    </>)
}

export default AcademyHome