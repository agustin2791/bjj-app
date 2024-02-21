import { ForumEntryBus, Comment } from './types_interfaces'
import { AxiosResponse } from 'axios'
import api from './../axios'

export const getAllPosts = async <T>(
    channel: string | undefined,
    post_id: string | undefined,
    start: number,
    end: number,
    allow_nsfw: boolean
) : Promise<T> => {
    const data = await api.post('/forum/posts ', {channel, post_id, start, end, allow_nsfw})
        .then((res) => {
            return res.data
        }).catch((e) => {
            return []
        })
    return data
}

export const getPostById = async <T>(post_id: string): Promise<T> => {
    const data = await api.post('/forum/get_post_by_id', {post_id})
        .then((res) => {return res.data})
        .catch((e) => {console.log(e)})
    return data
}

export const getUserPosts = async <T>(username: string): Promise<T> => {
    const data = await api.post('/forum/get_user_posts', {username})
        .then(res => {return res.data})
        .catch(e => {console.error(e)})

    return data
}

export const newPost = async <T>(post: ForumEntryBus) : Promise<T> => {
    const data = await api.post('/forum/new_post', {post: post})
        .then(res => {return res.data})
        .catch(err=> { return {'message': 'no post created'}})

    return data
}
export const uploadPostImages = async <T>(formdata: FormData): Promise<T> => {
    const upload = api.post('/forum/upload_images', formdata, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
        .then((res) => {
            return res.data
        })
        .catch((err) => console.error(err))

    return upload
}
export const editDeletePost = async <T>(
    type: string,
    post_id: number,
    edit_field: string,
    edit_value: any
) : Promise<T> => {
    const res = await fetch('http://localhost:8000/forum/' + type, {
        method: 'Post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({post_id, edit_field, edit_value})
    })

    return await res.json()
}

export const newComment = async <T>(comment: Comment) : Promise<T> => {
    const res = await api.post('/forum/new_reply/', comment)
        .then((response) => {
            return response.data
        })
        .catch((e) => {
            console.log(e)
            return []
        })

    return res
}

export const editDeleteReply = async <T>(
    type: string,
    comment_id: number,
    edit_field: string,
    edit_value: any
) : Promise<T> => {
    const res = await fetch('http://localhost:8000/forum/' + type, {
        method: 'Post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({comment_id, edit_field, edit_value})
    })

    return await res.json()
}

export const VoteAPI = async <T>(
    vote_for: string,
    vote_type: string,
    vote: string,
    user: string
) : Promise<T> => {
    const data = await api.post('/forum/vote', {
        data: {
            vote_for: vote_for, 
            vote_type: vote_type,
            vote: vote
        },
        user: user
    }).then((res) => {
        return res.data
    }).catch((e) => {
        console.log(e)
        return []
    })
    return data
}

export const GetDefaultChannels = async <T>(): Promise<T> => {
    const data = await api.post('/forum/get_default_channels', {})
        .then((res) => {return res.data})
        .catch(err => console.log(err))
    
    return data
}

export const CreateChannel = async <T>(
    category: string,
    user: string
) : Promise<T> => {
    const data = await api.post('/forum/create_channel', {
        user: user,
        data: {
            category: category
        }
    }).then((res) => {
        return res.data
    }).catch((error) => {
        console.log(error)
        return {}
    })
    return data
}

export const getChannelsByChar = async <T>(
    channel: string
) : Promise<T> => {
    const data = await api.post('/forum/find_channel', {
        channel: channel
    }).then(res => {
        return res.data
    }).catch(err => {
        return {'message': 'No channels found'}
    })

    return data
}

export const toggleChannelSubscription = async <T>(channel: string, profile_id: string): Promise<T> => {
    const data = await api.post('/profile/toggle_subscriptions', {channel, profile_id})
        .then(res => {return res.data})
        .catch(err => console.log(err))
    
    return data
}