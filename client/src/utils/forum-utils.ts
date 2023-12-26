import { ForumEntryBus, Comment } from './types_interfaces'
import { AxiosResponse } from 'axios'
import api from './../axios'
import { UseAutocompleteParameters } from '@mui/material'
export const getAllPosts = async <T>(
    channel: string | undefined,
    post_id: string | undefined,
    start: number,
    end: number
) : Promise<T> => {
    const data = await api.post('/forum/posts ', {channel, post_id, start, end})
        .then((res) => {
            return res.data
        }).catch((e) => {
            return []
        })
    return data
}

export const newPost = async <T>(post: ForumEntryBus) : Promise<T> => {
    const data = await api.post('/forum/new_post', {post: post})
        .then(res => {return res.data})
        .catch(err=> { return {'message': 'no post created'}})

    return data
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