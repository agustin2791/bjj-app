import { useState, FC, useEffect } from 'react'
import { Card, Modal, Stack, ListItem, Button, ButtonGroup, Box } from '@mui/material'
import { ForumEntry, Comment } from "../../utils/types_interfaces";
import CommentReply from './comment';
import ReplyForm from './replyForm';
import { VoteAPI, newComment } from '../../utils/forum-utils';
import { ThumbDown, ThumbUp } from '@mui/icons-material';
import { load as yt_loader } from 'youtube-iframe';
import { Link } from 'react-router-dom';

const YouTubeIframeLoader = require('youtube-iframe')
// const tag = document.createElement('script')
// tag.src = "https://www.youtube.com/iframe_api"
// const firstScriptTag = document.getElementsByTagName('script')[0]
// firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

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

    useEffect(function () {
        
    }, [entry])

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

    const getYTVideoId = (url: string) => {
        return url.includes('v=') ? url.split('v=')[1] : ''
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
                        <div className="post-author">
                            user: <Link to={`/profile/${entry.author?.username}`}>{typeof entry.author === 'string' ? entry.author : entry.author?.username}</Link>
                        </div>
                    </ListItem>
                    {entry.embedded && entry.embedded_type === 'video' &&
                    <ListItem>
                        <Box sx={{margin: '10px auto'}} id="youtube_player">
                            <iframe
                            width="560"
                            height="315"
                            src={`https://www.youtube.com/embed/${getYTVideoId(entry.embedded_link ? entry.embedded_link : '')}?si=Llfw2STacD8JEuMz`}
                            title="YouTube video player"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                            ></iframe>
                        </Box>
                        
                    </ListItem>
                    }
                    {entry.embedded && entry.embedded_type === 'link' && 
                        <ListItem>
                            <Box sx={{margin: '10px auto'}}>
                                <a href={entry.embedded_link} target='_blank'>{entry.embedded_link}</a>
                            </Box>
                        </ListItem>
                    }
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
                        {toggleReply && logged_in && <ReplyForm reply_to_id={entry?._id} submitReply={addComment} focus="post" /> }
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