import { Box, Grid, Typography } from "@mui/material"
import { FC } from "react"

type TooltipProps = {
    name: string,
    address: string
}

const MapTooltip: FC<TooltipProps> = (props) => {
    const {name, address} = props

    return (<>
    <Box sx={{maxWidth: '100px'}}>
        <Grid container>
            <Grid item sm={12}>
                <Typography variant="h4">{name}</Typography>
            </Grid>
            <Grid item sm={12}>
                <Typography variant="subtitle1">{address}</Typography>
            </Grid>
        </Grid>
    </Box>
    </>)
}

export default MapTooltip