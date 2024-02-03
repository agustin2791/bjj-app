import { FC } from "react"
import { Academy } from "../../utils/types_interfaces"
import { Button, Grid, List, ListItem, Paper, Typography } from "@mui/material"
import { useNavigate } from "react-router-dom"
import { Close } from "@mui/icons-material"

type AcademySubscriptionListProps ={
    subscriptions: Academy[],
    updateSubs: Function
}
const AcademySubscriptionList: FC<AcademySubscriptionListProps> = (props) => {
    const { subscriptions, updateSubs } = props
    const navigate = useNavigate()

    const goToAcademy = (academy: string) => {
        return navigate(`/academy/${academy}`)
    }

    return (<>
        <Paper sx={{height: '100%', padding: '20px', overflow: 'auto'}}>
            <Typography variant="h4">My Academy Subscriptions</Typography>
            <List>
                {subscriptions.map(s => {
                    return (
                        <ListItem key={s._id}>
                            <Grid container>
                                <Grid item sm={11} sx={{cursor: 'pointer'}} onClick={() => {goToAcademy(s?.slug as string)}}>
                                    {s.name}
                                </Grid>
                                <Grid item sm={1}>
                                    <Button startIcon={<Close />} onClick={() => {updateSubs(s._id, 'academy')}}></Button>
                                </Grid>
                            </Grid>
                        </ListItem>
                    )
                })}
            </List>
        </Paper>
    </>)
}

export default AcademySubscriptionList