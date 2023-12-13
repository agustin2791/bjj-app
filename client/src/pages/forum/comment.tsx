import { useState, FC } from 'react' 
import { Stack, Card, Button, Modal } from '@mui/material'
import { Comment } from '../../utils/types_interfaces'
import ReplyForm from './replyForm'

// type CommentStruct  Comment {

// }

interface newComment {
    comment: string,
    author: string,
}

const CommentReply: FC<Comment> = ({
        id = undefined, 
        comment = '', 
        author = '', 
        replies = Array<Comment>, 
        agree = 0, 
        disagree = 0, 
        comment_to_id = 0}) => {
    const [newReply, setNewReply] = useState<newComment>()
    const [toggleReply, setToggleReply] = useState(false)
    const [allReplies, setAllReplies] = useState<Array<Comment>>(replies)


    // METHODS
    const toggleReplyForm = () => {
        setToggleReply(!toggleReply)
    }

    const addReply = (user_reply: Comment) => {
        setAllReplies([...allReplies, user_reply])
    }
    return (
        <div className="comment-container">
            <div className="comment">{comment}</div>
            <div className="comment-details">
                <div className="comment-author">{author.toString()}</div>
                <Button variant="contained" color="primary">Agree {agree} </Button>
                <Button variant="contained" color="secondary">Disagree {disagree} </Button>
                <Button variant="contained" onClick={() => toggleReplyForm}>Reply</Button>
            </div>
            {toggleReply &&
                <Card>
                    <ReplyForm reply_to_id={id} submitReply={addReply} />
                </Card>
            }
            {allReplies.length > 0 && 
                allReplies.map((r, index) => {
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
                })
            }
        </div>
    )
}

export default CommentReply;