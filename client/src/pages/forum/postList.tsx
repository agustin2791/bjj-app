import { FC } from 'react';
import { Button, Card, CardContent } from '@mui/material'
import { ForumEntry } from '../../utils/types_interfaces';

type PostListProps = {
    posts: Array<ForumEntry>,
    viewEntry: Function
}

const PostList: FC<PostListProps> = ({ posts, viewEntry }) => {
    
    return (
        <div>
            {posts.map((post, index) => {
                return <Card key={index} sx={{width: '100%'}}>
                        <CardContent className="post-list-title">{post.title}</CardContent>
                        <CardContent className="post-list-vote">
                            <Button className="agree">Agree</Button>
                            <Button className="disagree">Disagree</Button>
                        </CardContent>
                        <CardContent className="view-post">
                            <Button onClick={() => {viewEntry(post.id)}} className="post-list-view-button">View Post</Button>
                        </CardContent>
                    </Card>
            })}
        </div>
    )
}

export default PostList;