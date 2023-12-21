import { FC } from 'react';
import { Box, Button, ButtonGroup, Card, CardContent, Stack } from '@mui/material'
import { ForumEntry } from '../../utils/types_interfaces';
import { ThumbUp, ThumbDown } from '@mui/icons-material'

type PostListProps = {
    posts: Array<ForumEntry>,
    viewEntry: Function,
    vote: Function
}

const PostList: FC<PostListProps> = ({ posts, viewEntry, vote }) => {
    
    return (
        <Stack spacing={2} className="Stack-container">
            {posts.map((post, index) => {
                return <Card key={index} sx={{width: '100%'}}>
                        <CardContent className="post-list-title" sx={{cursor: 'pointer'}} onClick={() => {viewEntry(post._id)}}>{post.title}</CardContent>
                        <CardContent className="post-list-vote">
                            <ButtonGroup variant='outlined' size='small'>
                                <Button 
                                    variant='outlined' 
                                    color="success" 
                                    startIcon={<ThumbUp />} 
                                    endIcon={<>{post.agree}</>}
                                    onClick={() => {vote(post._id, 'post', 'agree')}}
                                    >Agree</Button>
                                <Button 
                                    variant='outlined' 
                                    color="error" 
                                    startIcon={<ThumbDown />} 
                                    endIcon={<>{post.disagree}</>}
                                    onClick={() => {vote(post._id, 'post', 'disagree')}}
                                    >Disagree</Button>
                            </ButtonGroup>
                            
                            <Button sx={{float: 'right'}} onClick={() => {viewEntry(post._id)}} className="post-list-view-button">View Post</Button>
                        </CardContent>
                    </Card>
            })}
        </Stack>
    )
}

export default PostList;