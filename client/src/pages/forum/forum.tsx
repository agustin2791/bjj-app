import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { Stack, Button, Modal, Box, Fab} from '@mui/material'
import NewPost from './newPostForm';
import { newPost as postApi, getAllPosts, VoteAPI, toggleChannelSubscription, getPostById, uploadPostImages } from '../../utils/forum-utils';
import { ForumEntry, ForumEntryBus, Comment, User, Profile } from '../../utils/types_interfaces';
import PostList from './postList';
import Post from './post';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { useParams, useSearchParams } from 'react-router-dom';
import SlotModal from '../../components/template/modal';
import { Add } from '@mui/icons-material';
import { set_profile } from '../../store/auth';


interface defaultPostInterface {
    title: string,
    author: string,
    description: string,
    channel: string,
    channel_id: string,
    embedded: boolean,
    embedded_type: string,
    embedded_link: string,
    has_images: boolean,
    images?: File[],
    nsfw: boolean
}
const defaultPostForm: defaultPostInterface = {
    title: '',
    author: '',
    description: '',
    channel: '',
    channel_id: '',
    embedded: false,
    embedded_type: 'link',
    embedded_link: '',
    has_images: false,
    nsfw: false
}


const blankEntry = (): ForumEntry => {
    const replyArray = new Array<Comment>
    return {
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
        created_at: new Date(),
        nsfw: false
    }
}

const fabStyle = {
    position: 'absolute',
    bottom: 16,
    right: 16,
};

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
    const [extendAddBtn, setExtendAddBtn] = useState(false)
    const [isSubscribed, setIsSubscribed] = useState(false)
    const [currentPagination, setCurrentPagination] = useState(0)
    const [hasMorePosts, setHasMorePosts] = useState(true)
    const user = useSelector((state: RootState) => state.auth.user) as User
    const profile = useSelector((state: RootState) => state.auth.profile) as Profile
    const is_logged_in: boolean = useSelector((state: RootState) => state.auth.is_logged_in)
    const dispatch = useDispatch()

    useEffect(() => {
        getInitPosts()
    }, [channel])

    useEffect(() => {
        checkSub()
    }, [profile])

    useEffect(() => {
        if (post_id)
            viewEntry(post_id)
    }, [forumList])
    
    const getInitPosts = async () => {
        const allow_nsfw = Object.keys(profile).includes('is_adult') ? profile.is_adult : false
        let allPosts:ForumEntry[] = await getAllPosts(channel, post_id, currentPagination, 10, allow_nsfw ? allow_nsfw : false)
        checkSub()

        setForumList(allPosts)
        setInitForumCall(true)
        if (post_id) {
            console.log('has post id')
            let has_post = false
            allPosts.forEach((p) => {
                if (post_id === p?._id?.toString()) has_post = true
            })
            if (has_post) {
                console.log('list has post')
                viewEntry(post_id)
            }
            else {
                console.log('list does not have post')
                const f_post = await getPostById(post_id) as ForumEntry
                setForumList([...forumList, f_post])
                viewEntry(post_id)
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
            channel: channel ? channel : newPost.channel_id,
            nsfw: newPost.nsfw
        }
        let image_urls = []
        if (newPost.has_images) {
            // new_post.images = (newPost.images ? newPost.images : undefined)
            const images_upload = (newPost.images ? newPost.images : undefined) as File[]
            console.log(images_upload)
            if (images_upload) {
                let upload_params = new FormData()
                images_upload.forEach((i, idx) => {
                    upload_params.append('images', i)
                })
                // upload_params.append('images[]', images_upload as Blob)
                upload_params.append('username', user?.username as string)
                upload_params.append('channel', new_post.channel as string)
                image_urls = await uploadPostImages(upload_params) as string[]
                new_post.images = image_urls
            } else {
                console.log('nothing to upload')
            }
            // send to upload images 
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
        console.log('name of field', name, value)
        if (name === 'images' && event.target.files) {
            console.log(event.target.files)
            if (!event.target.files[0].type.includes('image')) return
            const file_to_upload = event.target.files[0]
            const image_list = (newPost.images ? [...newPost?.images as File[], file_to_upload] : [file_to_upload]) as File[]
            setNewPost({...newPost, images: image_list})
        } else {
            const bool_names = ['embedded', 'has_images']
            setNewPost({...newPost, [name]: bool_names.includes(name) ? value === 'true' : value})
        }
    }

    const removeImagePostForm = (image_index: number) => {
        if (!newPost.images) return
        const update_images = newPost?.images.filter((i, index) => index !== image_index)
        setNewPost({...newPost, images: update_images})
    }
    
    const viewEntry = (entry_id: string) => {
        console.log('viewing entry', entry_id)
        const entry = forumList.filter(f => {return f._id === entry_id})
        console.log(entry)
        setFocusEntry(entry[0])
        setViewingEntry(true)
    }

    const toggleViewingEntry = () => {
        setViewingEntry(!viewingEntry)
        setFocusEntry(blankEntry)
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

    const checkSub = () => {
        if (profile.channel_subs){
            const subbed = profile.channel_subs.map(s => {return s.slug})
            setIsSubscribed(subbed.includes(channel as string))
        }
    }

    const subToggle = async () => {
        if (!channel || !profile._id) return
        const profile_update = await toggleChannelSubscription(channel, profile?._id)
        dispatch(set_profile(profile_update))
    }

    if (forumList.length <= 0 && !initForumCall) {
        getInitPosts()
    }

    return (
        <Stack sx={{margin: '20px auto', maxWidth: '80%'}}>
            <h2>Welcome {channel ? 'to ' + channel : user.username ? user.username : ''}</h2>
            {is_logged_in && 
                <Fab sx={fabStyle} 
                    className="create-post-button" 
                    onMouseOver={() => {setExtendAddBtn(true)}}
                    onMouseLeave={() => {setExtendAddBtn(false)}}
                    size='medium'
                    color='primary'
                    variant={extendAddBtn ? 'extended' : 'circular'}
                    onClick={() => {toggleNewEntryPost()}}>
                        <Add />
                        {extendAddBtn ? 'Create A Post' : ''}
                    </Fab>}
            {is_logged_in && channel &&
                <Fab size='small' 
                    variant='extended'
                    color='info'
                    onClick={() => {subToggle()}}
                    sx={{
                        maxWidth: '200px', 
                        position: 'absolute', 
                        top: '120px', 
                        right: '20px',
                        opacity: isSubscribed ? '0.5' : '1'
                    }}>{isSubscribed ? 'Subscribed' : 'Subscribe'}</Fab>
            }
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
                    has_images={newPost.has_images}
                    images={newPost.images ? newPost.images : []}
                    handleInputChange={updatePostForm}
                    removeImage={removeImagePostForm}
                    submitPost={postNewForumEntry}
                    nsfw={newPost.nsfw ? newPost.nsfw : false}  />}
                ></SlotModal>}
            {forumList.length === 0 && <h1>No Posts</h1>}
            <PostList posts={forumList} viewEntry={viewEntry} vote={votePost} />
            {focusEntry && 
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