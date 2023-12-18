import { connect } from "../../mongodb";
import express, { Express, Request, Response } from "express";
import type { IPost, IComment } from "./schema"
import { Post, Comment } from "./schema"
import { Schema, Types } from "mongoose";
const app:Express = express()

const convertObjectID = (user_id: string) => {
    return new Types.ObjectId(user_id)
}

module.exports = app.post('/posts', async (req: Request, res: Response) => {
    await connect()
    const {start, end} = req.body
    try {
        const all_post_query = await Post.find().skip(start).limit(end).sort('-created_at')
        console.log(all_post_query)
        return res.status(200).json(all_post_query)
    } catch (e) {
        console.log(e)
        return res.status(404).send('No Post found')
    } 
})

module.exports = app.post('/new_post', async (req: Request, res: Response) => {
    console.log('setting up new post')
    await connect()
    const post = req.body.post

    post['author'] = convertObjectID(post['author'])

    const new_post = new Post(post)
    await new_post.save()
    res.status(200).json(new_post)
})

interface EditPostInput {
    post_id: Schema.Types.ObjectId,
    edit_field: string,
    edit_value: any
}

module.exports = app.post('/edit_post', async (req: Request, res: Response) => {
    await connect()
    const {post_id, edit_field, edit_value}: EditPostInput = req.body

    const post = await Post.findOneAndUpdate({_id: post_id}, { [edit_field]: edit_value})
    
    return res.status(200).json(post)
})

module.exports = app.post('/delete_post', async (req: Request, res: Response) => {
    await connect()
    const {post_id}: EditPostInput = req.body
    await Post.findOneAndDelete({_id: post_id})

    return res.status(200).json({'message': 'Post deleted'})
})

module.exports = app.post('/new_reply', async (req: Request, res: Response) => {
    await connect()
    const comment: IComment = req.body.comment

    const new_comment = new Comment(comment)
    new_comment.save()

    return res.status(200).json(new_comment)
})

interface CommentEditInput {
    comment_id: Schema.Types.ObjectId,
    edit_field: string,
    edit_value: any
}

module.exports = app.post('/edit_reply', async (req: Request, res: Response) => {
    await connect()
    const {comment_id, edit_field, edit_value}: CommentEditInput = req.body

    const comment = await Comment.findOneAndUpdate({_id: comment_id}, {[edit_field]: edit_value})
    return res.status(200).json(comment)
})

module.exports = app.post('/delete_reply', async (req: Request, res: Response) => {
    await connect()
    const {comment_id}: CommentEditInput = req.body
    await Comment.findOneAndDelete({_id: comment_id})
    return res.status(200).json({'message': 'Comment deleted'})
})