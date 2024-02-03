import { Button, Grid, List, ListItem, Paper, Typography } from "@mui/material"
import { Channel } from "../../utils/types_interfaces"
import { FC } from "react"
import { useNavigate } from "react-router-dom"
import { Close } from "@mui/icons-material"

type SubscriptionListProps = {
    subscriptions: Channel[],
    updateSubs: Function
}
const PostSubscriptionList: FC<SubscriptionListProps> = (props) => {
    const { subscriptions, updateSubs } = props
    const navigate = useNavigate()

    const navToPostPage = (channel: string) => {
        return navigate(`/posts/${channel}`)
    }

    const removeFromList = async (sub_id: string) => {
        await updateSubs(sub_id)
    }

    return (<>
        <Paper sx={{height: '100%', overflow: 'auto', padding: '20px'}}>
            <Typography variant="h4">My Channel Subscriptions</Typography>
            <List>
                {subscriptions.map((s) => {
                    return (
                        <ListItem key={s._id}>
                            <Grid container>
                                <Grid item sm={11} sx={{cursor: 'pointer'}} onClick={() => {navToPostPage(s.slug)}}>
                                    {s.category}
                                </Grid>
                                <Grid item sm={1}>
                                    <Button startIcon={<Close />}></Button>
                                </Grid>
                            </Grid>
                        </ListItem>
                    )
                })}
            </List>
        </Paper>
    </>)
}

export default PostSubscriptionList