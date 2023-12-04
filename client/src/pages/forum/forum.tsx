import { useState, ChangeEvent, FormEvent } from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import NewPost from './newPostForm';

interface ForumEntry {
    id: number,
    title: string,
    author: string,
    reply: Array<Comment>,
    agree: number,
    disagree: number,
    description: string
}

interface Comment {
    id: number,
    comment: string,
    author: string,
    agree: number,
    disagree: number,
    reply: [Comment],
    comment_to_id: number
}

const defaultPostForm = {
    title: '',
    author: '',
    description: ''
}

const Forum = () => {
    const [forumList, setForumList] = useState<ForumEntry[] | []>([]);
    const [focusEntry, setFocusEntry] = useState<ForumEntry | null>();
    const [creatingNewEntry, setCreatingNewEntry] = useState(false);
    const [viewingEntry, setViewingEntry] = useState(false);
    const [newPost, setNewPost] = useState(defaultPostForm)


    const postNewForumEntry = async (event: FormEvent<HTMLFormElement>) => {
        // have an api to add/create a post
        event.preventDefault()
        const reply_comments = new Array<Comment>
        const new_post:ForumEntry = {
            id: forumList.length,
            title: newPost.title,
            author: newPost.author,
            description: newPost.description,
            agree: 0,
            disagree: 0,
            reply: reply_comments
        }

        setForumList([...forumList, new_post])
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

    const toggleNewEntryPost = () => {
        setCreatingNewEntry(!creatingNewEntry)
    }

    return (
        <Stack sx={{margin: '20px auto', maxWidth: '700px'}}>
            {forumList.length === 0 && <h1>No Posts</h1>}
            {forumList.map((post, index) => {
                return <div key={index}>
                        <div className="post-list-title">{post.title}</div>
                        <div className="post-list-vote">
                            <button className="agree">Agree</button>
                            <button className="disagree">Disagree</button>
                        </div>
                        <div className="view-post">
                            <button onClick={() => {viewEntry(post.id)}} className="post-list-view-button">View Post</button>
                        </div>
                    </div>
            })}
            <Button className="create-post-button" variant="contained" onClick={() => {toggleNewEntryPost()}}>Create A Post</Button>
            {creatingNewEntry ? 
                <NewPost 
                title={newPost.title}
                author={newPost.author}
                description={newPost.description}
                handleInputChange={updatePostForm}
                submitPost={postNewForumEntry}  />
            : <div></div>}
        </Stack>
    )
}

export default Forum;