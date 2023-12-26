import { useState, FC } from 'react'
import { Card, Modal, Stack, ListItem, Button, ButtonGroup } from '@mui/material'
import { ForumEntry, Comment } from "../../utils/types_interfaces";
import CommentReply from './comment';
import ReplyForm from './replyForm';
import { VoteAPI, newComment } from '../../utils/forum-utils';
import { ThumbDown, ThumbUp } from '@mui/icons-material';

type PostProps = {
    entry: ForumEntry,
    open: boolean,
    logged_in: boolean,
    closeModal: Function,
    updateVote: Function
}
const Post: FC<PostProps> = ({ entry, open, logged_in, closeModal, updateVote }) => {
    const [toggleReply, setToggleReply] = useState<boolean>(false)
    const [replyComments, setComments] = useState<Comment[]>(entry.replies)

    const toggleReplyForm = () => {
        setToggleReply(!toggleReply)
    }

    const addComment = async (new_comment: Comment) => {
        const comment:Comment = await newComment(new_comment)
        if (replyComments === undefined) {
            setComments([comment])
        } else {
            setComments([comment, ...replyComments])
        }
    }

    const votePost = async (vote_type: string, vote: string) => {
        if (!logged_in) return
        const post_id = entry._id ? entry._id.toString() : ''
        interface VoteReturn {
            agree: string,
            disagree: string
        }
        const user_data = JSON.parse(localStorage.getItem('user') as string)
        const voted: VoteReturn = await VoteAPI(post_id, vote_type, vote, user_data['_id']) as VoteReturn
        console.log(voted)
        if (post_id === entry._id?.toString()) {
            let data_userAgree:number = voted.agree === 'add' ? entry.agree + 1 : voted.agree === 'remove' ? entry.agree - 1 : entry.agree
            let data_userDisagree:number = voted.disagree === 'add' ? entry.disagree + 1 : voted.disagree === 'remove' ? entry.disagree - 1 : entry.disagree
            updateVote(data_userAgree, data_userDisagree)
        }
    }

    if (entry.replies.length > replyComments.length) {
        setComments(entry.replies)
    }
    return (
        <Modal open={open}
            onClose={() => {closeModal()}}>
            <Card className="post-card-container">
                <Stack className="post-container" spacing={2}>
                    <ListItem>
                        <div className="post-title">{entry.title}</div>
                        <div className="post-author">{typeof entry.author === 'string' ? entry.author : entry.author?.username}</div>
                    </ListItem>
                    <ListItem>
                        <div className="post-description">{entry.description}</div>
                    </ListItem>
                    <div className="comment-section">
                        <ButtonGroup variant='outlined' size='small'>
                            <Button 
                                variant='outlined' 
                                color="success" 
                                startIcon={<ThumbUp />} 
                                endIcon={<>{entry.agree}</>}
                                onClick={() => {votePost('post', 'agree')}}
                                >Agree</Button>
                            <Button 
                                variant='outlined' 
                                color="error" 
                                startIcon={<ThumbDown />} 
                                endIcon={<>{entry.disagree}</>}
                                onClick={() => {votePost('post', 'disagree')}}
                                >Disagree</Button>
                        </ButtonGroup>
                        <br />{logged_in &&
                        <>
                            <br />
                            <Button variant="contained" 
                                onClick={() => toggleReplyForm()}>Reply</Button>
                            <br />
                        </>
                        }<br />
                        {toggleReply && logged_in && <ReplyForm reply_to_id={entry._id} submitReply={addComment} focus="post" /> }
                        {replyComments.length > 0 && replyComments.map((r: Comment, index) => {
                            return (
                                <CommentReply key={index} 
                                    _id={r._id} 
                                    comment={r.comment} 
                                    author={r.author} 
                                    replies={r.replies}
                                    agree={r.agree}
                                    disagree={r.disagree}
                                    post_id={r.comment_to_id}
                                     />
                            )
                        })}
                    </div>
                </Stack>
            </Card>
        </Modal>
    )
}

export default Post;