import { ForumEntry, Comment } from './types_interfaces'
export const getAllPosts = async <T>(
    start: number,
    end: number
) : Promise<T> => {
    const res = await fetch('http://localhost:8000/forum/posts ', {
        method: 'Post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({start, end})
    })

    return await res.json()
}

export const newPost = async <T>(post: ForumEntry) : Promise<T> => {
    const res = await fetch('http://localhost:8000/forum/new_post', {
        method: 'Post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({post})
    })

    return await res.json()
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
    const res = await fetch('http://localhost:8000/forum/new_reply', {
        method: 'Post',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({comment})
    })

    return await res.json()
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