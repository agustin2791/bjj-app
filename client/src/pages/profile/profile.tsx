import { Fab, Grid, Paper, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { Comment, ForumEntry, Profile, User } from "../../utils/types_interfaces"
import { getProfile } from "../../utils/profile-utils"
import ProfilePicture from "../../components/profile/picture"
import { getUserPosts } from "../../utils/forum-utils"
import UserPostList from "../../components/profile/userPostList"
import { Edit } from "@mui/icons-material"
import { useSelector } from "react-redux"
import { RootState } from "../../store"

interface postsOutput {
    posts: ForumEntry[],
    comments: Comment[]
}

const fabStyle = {
    position: 'absolute',
    bottom: 16,
    right: 16,
};

const UserProfile = () => {
    const { slug } = useParams()
    const navigate = useNavigate()
    const [profile, setProfile] = useState<Profile>()
    const [userPosts, setUserPosts] = useState<ForumEntry[]>([])
    const [userComments, setUserComments] = useState<Comment[]>([])
    const [extendEditBtn, setExtendEditBtn] = useState(false)
    const user = useSelector((state: RootState) => state.auth.user) as User

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

    const goToEditPage = () => {
        return navigate('/profile/edit/' + slug)
    }

    return (<>
    {user.username === slug && <Fab size='medium'
        sx={fabStyle}
        color='primary'
        onClick={goToEditPage}
        onMouseOver={() => {setExtendEditBtn(true)}}
        onMouseLeave={() => {setExtendEditBtn(false)}}
        variant={extendEditBtn ? 'extended' : 'circular'}>
            <Edit /> {extendEditBtn ? 'Edit Profile' : ''}
        </Fab>}
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
                        <Typography variant="body1">{profile?.affiliation}</Typography>
                        <Typography variant="body1">{profile?.location}</Typography>
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