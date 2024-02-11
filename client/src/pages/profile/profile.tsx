import { Fab, Grid, Paper, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Comment, ForumEntry, Profile } from "../../utils/types_interfaces"
import { getProfile } from "../../utils/profile-utils"
import ProfilePicture from "../../components/profile/picture"
import { getUserPosts } from "../../utils/forum-utils"
import UserPostList from "../../components/profile/userPostList"

interface postsOutput {
    posts: ForumEntry[],
    comments: Comment[]
}

const UserProfile = () => {
    const { slug } = useParams()
    const [profile, setProfile] = useState<Profile>()
    const [userPosts, setUserPosts] = useState<ForumEntry[]>([])
    const [userComments, setUserComments] = useState<Comment[]>([])

    useEffect(function () {
        pullProfileData()
    }, [slug])

    const pullProfileData = async () => {
        const prof = await getProfile(slug as string)
        const { posts, comments }: postsOutput = await getUserPosts(slug as string)
        setProfile(prof as Profile)
        setUserPosts(posts)
        setUserComments(comments)
    }

    return (<>
    <Fab></Fab>
    <Grid container sx={{width: '80%', margin: '5px auto'}} spacing={2}>
        <Grid item sm={12}>
            <Paper sx={{padding: '20px'}}>
                <Grid container spacing={2}>
                    <Grid item sm={3}>
                        <ProfilePicture username={slug} image={profile?.image} />
                    </Grid>
                    <Grid item sm={9}>
                        <Typography variant="h4">{profile?.name}</Typography>
                        <Typography variant="body1">{profile?.user.username}</Typography>
                        <Typography variant="body1">{profile?.belt_rank}</Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Grid>
        <Grid item sm={12} md={6}>
            <Paper className='profile-list-container'>
                {<UserPostList list={userPosts as []} type='post' />}
            </Paper>
        </Grid>
        <Grid item sm={12} md={6}>
            <Paper className='profile-list-container'>
            <UserPostList list={userComments as []} type='comment' />
            </Paper>
        </Grid>
    </Grid>
    </>)
}

export default UserProfile