import { useState, ChangeEvent, FormEvent } from 'react';
import { Stack, Button, Modal, Box} from '@mui/material'
import NewPost from './newPostForm';
import { newPost as postApi, getAllPosts } from '../../utils/forum-utils';
import { ForumEntry, Comment } from '../../utils/types_interfaces';
import PostList from './postList';
import Post from './post';


const defaultPostForm = {
    title: '',
    author: '',
    description: ''
}

const blankEntry = (): ForumEntry => {
    const replyArray = new Array<Comment>
    return {
        id: 0,
        title: '',
        author: '',
        replies: replyArray,
        agree: 0,
        disagree: 0,
        description: '',
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
    const [forumList, setForumList] = useState<ForumEntry[] | []>([]);
    const [focusEntry, setFocusEntry] = useState<ForumEntry>(blankEntry);
    const [creatingNewEntry, setCreatingNewEntry] = useState(false);
    const [viewingEntry, setViewingEntry] = useState(false);
    const [newPost, setNewPost] = useState(defaultPostForm)
    const [initForumCall, setInitForumCall] = useState(false)

    
    const getInitPosts = async () => {
        let allPosts:ForumEntry[] = await getAllPosts(0, 10)
        console.log(allPosts)

        setForumList(allPosts)
        setInitForumCall(true) 
    }

    const postNewForumEntry = async (event: FormEvent<HTMLFormElement>) => {
        // have an api to add/create a post
        event.preventDefault()
        const reply_comments = new Array<Comment>
        const new_post:ForumEntry = {
            title: newPost.title,
            author: newPost.author,
            description: newPost.description,
            agree: 0,
            disagree: 0,
            replies: reply_comments
        }
        
        const post:ForumEntry = await postApi(new_post)
        setForumList([...forumList, post])
        setNewPost(defaultPostForm)
        setCreatingNewEntry(false)
    }

    const updatePostForm = (event: ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        setNewPost({...newPost, [name]: value})
    }
    
    const viewEntry = (entry_id: number) => {
        const entry = forumList.filter(f => f.id === entry_id)
        setFocusEntry(entry[0])
        setViewingEntry(true)
    }

    const toggleViewingEntry = () => {
        setViewingEntry(!viewingEntry)
    }

    const toggleNewEntryPost = () => {
        setCreatingNewEntry(!creatingNewEntry)
    }

    if (forumList.length <= 0 && !initForumCall) {
        getInitPosts()
    }

    return (
        <Stack sx={{margin: '20px auto', maxWidth: '700px'}}>
            <Button className="create-post-button" variant="contained" onClick={() => {toggleNewEntryPost()}}>Create A Post</Button>
             
            <Modal
                open={creatingNewEntry}
                onClose={toggleNewEntryPost}
                aria-labelledby="modal-modal-title">
                <Box sx={modalStyle}>
                    <NewPost 
                        title={newPost.title}
                        author={newPost.author}
                        description={newPost.description}
                        handleInputChange={updatePostForm}
                        submitPost={postNewForumEntry}  />
                </Box>
            </Modal>
            {forumList.length === 0 && <h1>No Posts</h1>}
            <PostList posts={forumList} viewEntry={viewEntry} />
            {focusEntry !== null && <Post entry={focusEntry} open={viewingEntry} closeModal={toggleViewingEntry} />}
        </Stack>
    )
}

export default Forum;