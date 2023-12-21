import { useState, FC } from 'react' 
import { Stack, Card, Button, Modal, ButtonGroup } from '@mui/material'
import { Comment } from '../../utils/types_interfaces'
import ReplyForm from './replyForm'
import { VoteAPI, newComment } from '../../utils/forum-utils'
import { ThumbDown, ThumbUp } from '@mui/icons-material'

// type CommentStruct  Comment {

// }

interface newCommentInput {
    comment: string,
    author: string,
}

const CommentReply: FC<Comment> = ({
        _id = 0, 
        comment = '', 
        author = '', 
        replies = Array<Comment>, 
        agree = 0, 
        disagree = 0, 
        comment_to_id = 0
    }) => {
    const [newReply, setNewReply] = useState<newCommentInput>()
    const [toggleReply, setToggleReply] = useState<boolean>(false)
    const [allReplies, setAllReplies] = useState<Array<Comment>>(replies)
    const [commentAgree, setCommentAgree] = useState(agree)
    const [commentDisagree, setCommentDisagree] = useState(disagree)


    // METHODS
    const toggleReplyForm = () => {
        console.log(toggleReply)
        setToggleReply(toggleReply ? false : true)
    }

    const addReply = async (user_reply: Comment) => {
        const comment:Comment = await newComment(user_reply)
        setAllReplies([comment, ...allReplies])
    }

    const votePost = async (post_id:string, vote_type: string, vote: string) => {
        interface VoteReturn {
            agree: string,
            disagree: string
        }
        const user_data = JSON.parse(localStorage.getItem('user') as string)
        const voted: VoteReturn = await VoteAPI(post_id, vote_type, vote, user_data['_id']) as VoteReturn
        console.log(voted)
        if (post_id === _id.toString()) {
            let update_agree = voted.agree === 'add' ? commentAgree + 1 : voted.agree === 'remove' ? commentAgree - 1 : commentAgree
            let update_disagree = voted.disagree === 'add' ? commentDisagree + 1 : voted.disagree === 'remove' ? commentDisagree - 1 : commentDisagree
            setCommentAgree(update_agree)
            setCommentDisagree(update_disagree)
        }
    }
    return (
        <div className="comment-container">
            <div className="comment">{comment}</div>
            <div className="comment-details">
                <div className="comment-author">{typeof author === 'object' ? author.username : author.toString()}</div>
                <ButtonGroup variant='outlined' size='small'>
                    <Button 
                        variant='outlined' 
                        color="success" 
                        startIcon={<ThumbUp />} 
                        endIcon={<>{commentAgree}</>}
                        onClick={() => {votePost(_id.toString(), 'comment', 'agree')}}
                        >Agree</Button>
                    <Button 
                        variant='outlined' 
                        color="error" 
                        startIcon={<ThumbDown />} 
                        endIcon={<>{commentDisagree}</>}
                        onClick={() => {votePost(_id.toString(), 'comment', 'disagree')}}
                        >Disagree</Button>
                </ButtonGroup>
                {/* <Button variant="contained" onClick={() => toggleReplyForm()}>Reply dsdf</Button> */}
            </div>
            {toggleReply}
            {toggleReply && <ReplyForm reply_to_id={_id} submitReply={addReply} focus='comment' /> }
            {allReplies.length > 0 && 
                allReplies.map((r, index) => {
                    return (
                        <CommentReply key={index} 
                            _id={r._id} 
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