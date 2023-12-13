import { useState, FC } from 'react'
import { Card, Modal, Stack, ListItem, Button } from '@mui/material'
import { ForumEntry, Comment } from "../../utils/types_interfaces";
import CommentReply from './comment';
import ReplyForm from './replyForm';
import { newComment } from '../../utils/forum-utils';

type PostProps = {
    entry: ForumEntry,
    open: boolean,
    closeModal: Function
}
const Post: FC<PostProps> = ({ entry, open, closeModal }) => {
    const [toggleReply, setToggleReply] = useState<boolean>(false)
    const [replyComments, setComments] = useState<Comment[]>([])

    const toggleReplyForm = () => {
        setToggleReply(!toggleReply)
    }

    const addComment = async (new_comment: Comment) => {
        const comment:Comment = await newComment(new_comment)
        setComments([...replyComments, comment])
    }
    return (
        <Modal open={open}
            onClose={() => {closeModal()}}>
            <Card className="post-card-container">
                <Stack className="post-container" spacing={2}>
                    <ListItem>
                        <div className="post-title">{entry.title}</div>
                        <div className="post-author">{entry.author.toString()}</div>
                    </ListItem>
                    <ListItem>
                        <div className="post-description">{entry.description}</div>
                    </ListItem>
                    <ListItem className="comment-section">
                        <Button variant="contained" 
                            onClick={() => toggleReplyForm()}>Reply</Button>
                        <br />
                        {toggleReply && 'starting reply'}
                        <br />
                        {toggleReply && <ReplyForm reply_to_id={entry.id} submitReply={addComment} /> }
                        {replyComments.length > 0 && replyComments.map((r: Comment, index) => {
                            return (
                                <CommentReply key={index} 
                                    id={r.id} 
                                    comment={r.comment} 
                                    author={r.author} 
                                    replies={r.replies}
                                    agree={r.agree}
                                    disagree={r.disagree}
                                    comment_to_id={r.comment_to_id} />
                            )
                        })}
                    </ListItem>
                </Stack>
            </Card>
        </Modal>
    )
}

export default Post;