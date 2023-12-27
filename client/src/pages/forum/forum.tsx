import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Stack, Button, Modal, Box} from '@mui/material'
import NewPost from './newPostForm';
import { newPost as postApi, getAllPosts, VoteAPI } from '../../utils/forum-utils';
import { ForumEntry, ForumEntryBus, Comment, User } from '../../utils/types_interfaces';
import PostList from './postList';
import Post from './post';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useParams, useSearchParams } from 'react-router-dom';
import SlotModal from '../../components/form-input/template/modal';


const defaultPostForm = {
    title: '',
    author: '',
    description: '',
    channel: '',
    channel_id: '',
    embedded: false,
    embedded_type: 'link',
    embedded_link: ''
}


const blankEntry = (): ForumEntry => {
    const replyArray = new Array<Comment>
    return {
        _id: 0,
        title: '',
        author: undefined,
        replies: replyArray,
        agree: 0,
        disagree: 0,
        description: '',
        channel: '',
        embedded: false,
        embedded_type: '',
        embedded_link: '',
        created_at: new Date()
    }
}

const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '80%',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

// const convertPostsToEntries: (posts: []) => ForumEntry[] | [] = function(posts) {
//     console.log(posts)
//     return posts.map(p => {
//         return {...p}
//     })
// }
const Forum = () => {
    const { channel, post_id } = useParams()
    const [forumList, setForumList] = useState<ForumEntry[] | []>([]);
    const [focusEntry, setFocusEntry] = useState<ForumEntry>(blankEntry);
    const [creatingNewEntry, setCreatingNewEntry] = useState(false);
    const [viewingEntry, setViewingEntry] = useState(false);
    const [newPost, setNewPost] = useState(defaultPostForm)
    const [initForumCall, setInitForumCall] = useState(false)
    const user = useSelector((state: RootState) => state.auth.user) as User
    const is_logged_in: boolean = useSelector((state: RootState) => state.auth.is_logged_in)

    useEffect(() => {
        getInitPosts()
    }, [channel])
    
    const getInitPosts = async () => {

        let allPosts:ForumEntry[] = await getAllPosts(channel, post_id, 0, 10)
        

        setForumList(allPosts)
        setInitForumCall(true)
        if (post_id) {
            let has_post = false
            allPosts.forEach((p) => {if (post_id === p?._id?.toString()) has_post = true})
            if (has_post) {
                viewEntry(parseInt(post_id))
            }
            else {

            }

        }
    }

    const postNewForumEntry = async (event: FormEvent<HTMLFormElement>) => {
        // have an api to add/create a post
        event.preventDefault()
        const reply_comments:Comment[] = []
        let new_post: ForumEntryBus = {
            title: newPost.title,
            author: user._id ? user?._id.toString() : '',
            description: newPost.description,
            agree: 0,
            disagree: 0,
            replies: reply_comments,
            channel: channel ? channel : newPost.channel_id
        }

        if (newPost.embedded) {
            new_post.embedded = newPost.embedded
            new_post.embedded_type = newPost.embedded_type
            new_post.embedded_link = newPost.embedded_link
        }
        
        const post:ForumEntry = await postApi(new_post)
        setForumList([...forumList, post])
        setNewPost(defaultPostForm)
        setCreatingNewEntry(false)
    }

    const updatePostForm = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        
        setNewPost({...newPost, [name]: name === 'embedded' ? value === 'true' : value})
    }
    
    const viewEntry = (entry_id: number) => {
        console.log('viewing entry', entry_id)
        const entry = forumList.filter(f => {return f._id === entry_id})
        setFocusEntry(entry[0])
        setViewingEntry(true)
    }

    const toggleViewingEntry = () => {
        setViewingEntry(!viewingEntry)
    }

    const toggleNewEntryPost = () => {
        setCreatingNewEntry(!creatingNewEntry)
    }

    const votePost = async (post_id:string, vote_type: string, vote: string) => {
        if (!is_logged_in) return
        interface VoteReturn {
            agree: string,
            disagree: string
        }
        const user_data = JSON.parse(localStorage.getItem('user') as string)
        const voted: VoteReturn = await VoteAPI(post_id, vote_type, vote, user_data['_id']) as VoteReturn
        console.log(voted)
        if (vote_type === 'post') {
            const update_posts = forumList.map((p) => {
                console.log(post_id, p._id)
                if (post_id === p._id?.toString()) {
                    p.agree = voted.agree === 'add' ? p.agree + 1 : voted.agree === 'remove' ? p.agree - 1 : p.agree
                    p.disagree = voted.disagree === 'add' ? p.disagree + 1 : voted.disagree === 'remove' ? p.disagree - 1 : p.disagree
                }
                return p
            })
            setForumList(update_posts)
        }
    }

    const updateFocusVote = (up: number, down: number) => {
        if (!is_logged_in) return
        setFocusEntry({...focusEntry, ['agree']: up, ['disagree']: down})
        let list = forumList
        list.forEach((f) => {
            if (f._id === focusEntry._id) {
                f.agree = up
                f.disagree = down
            }
        })
        setForumList(list)
    }
    if (forumList.length <= 0 && !initForumCall) {
        console.log(channel, post_id)
        getInitPosts()
    }

    return (
        <Stack sx={{margin: '20px auto', maxWidth: '80%'}}>
            <h2>Welcome {user.username ? user.username : ''}</h2>
            {is_logged_in && 
                <Button className="create-post-button" variant="contained" onClick={() => {toggleNewEntryPost()}}>Create A Post</Button>}
             
            {is_logged_in &&
            <SlotModal
                open={creatingNewEntry}
                close={toggleNewEntryPost}
                modal_content={
                <NewPost 
                    title={newPost.title}
                    author={user.username ? user.username : newPost.author}
                    description={newPost.description}
                    channel={channel ? channel : newPost.channel}
                    embedded={newPost.embedded}
                    embedded_type={newPost.embedded_type}
                    embedded_link={newPost.embedded_link}
                    has_channel={channel !== undefined}
                    handleInputChange={updatePostForm}
                    submitPost={postNewForumEntry}  />}
                ></SlotModal>}
            {forumList.length === 0 && <h1>No Posts</h1>}
            <PostList posts={forumList} viewEntry={viewEntry} vote={votePost} />
            {focusEntry !== null && 
                <Post 
                    entry={focusEntry} 
                    open={viewingEntry}
                    logged_in={is_logged_in}
                    closeModal={toggleViewingEntry} 
                    updateVote={updateFocusVote} />}
        </Stack>
    )
}

export default Forum;