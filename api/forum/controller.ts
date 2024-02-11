import { connect } from "../../mongodb";
import express, { Express, Request, Response } from "express";
import type { IPost, IComment } from "./schema"
import { Post, Comment, Channel, Vote } from "./schema"
import { Schema, Types } from "mongoose";
import { User } from "../auth/schema";
const app:Express = express()

const convertObjectID = (user_id: string) => {
    return new Types.ObjectId(user_id)
}

// POSTS API =========================
module.exports = app.post('/posts', async (req: Request, res: Response) => {
    await connect()
    const {channel, post_id, start, end} = req.body
    try {
        let query
        if (channel) {
            const get_channel = await Channel.findOne({slug: channel})
            if (get_channel) {
                query = Post.where({channel: get_channel})
            } else {
                return res.status(404).json({'message': 'Channel does not exist'})
            }
            
        } else {
            query = Post.where({})
        }
        let all_post_query = await query.find()
            .populate('author')
            .populate({path: 'replies', populate: {path: 'author'}})
            .skip(start)
            .limit(end)
            .sort('-created_at')
        return res.status(200).send(all_post_query)
    } catch (e) {
        console.log(e)
        return res.status(404).send('No Post found')
    } 
})

module.exports = app.post('/get_post_by_id', async (req: Request, res: Response) => {
    await connect()
    try {
        const post_id = req.body.post_id
        const post = await Post.findById(post_id)
            .populate('author')
            .populate({path: 'replies', populate: {path: 'author'}})

        return res.status(200).json(post)
    } catch (e) {
        console.log(e)
        return res.status(404).json({'error': true, 'message': 'No post found'})
    }
})

module.exports = app.post('/get_user_posts', async (req: Request, res: Response) => {
    await connect()
    const username = req.body.username
    try {
        const user = await User.findOne({username: username})
        const posts = await Post.find({author: user}).populate('channel')
        const comments = await Comment.find({author: user})
            .populate('post_id')
            .populate({path: 'post_id', populate: {path: 'channel'}})

        return res.status(200).json({'posts': posts, 'comments': comments})
    } catch(e) {
        console.error(e)
        return res.status(404).json({'error': true, 'message': 'No user post'})
    }
})

module.exports = app.post('/new_post', async (req: Request, res: Response) => {
    console.log('setting up new post')
    await connect()
    const post = req.body.post

    post['author'] = convertObjectID(post['author'])
    let get_channel
    try {
        get_channel = await Channel.findOne({_id: post['channel']})
    } catch (e) {
        get_channel = await Channel.findOne({slug: post['channel']})
    }
    post['channel'] = get_channel?._id
    const new_post = new Post(post)
    await new_post.save()
    new_post.populate('author')
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
    await Comment.find({})
    await Post.findOneAndDelete({_id: post_id})

    return res.status(200).json({'message': 'Post deleted'})
})

// COMMENT API =================================
module.exports = app.post('/new_reply', async (req: Request, res: Response) => {
    await connect()
    try {
        const comment: IComment = req.body
        console.log(comment)
        const new_comment = new Comment(comment)
        new_comment.save()

        if (comment?.post_id) {
            const update_post = await Post.findOne({_id: comment.post_id})
            update_post?.replies.push(new_comment)
            update_post?.save()
        } else {
            const update_post = await Comment.findOne({_id: comment?.comment_to_id})
            update_post?.replies.push(new_comment)
            update_post?.save()
        }

        return res.status(200).json(new_comment)
    } catch (e) {
        console.log(e)
        return res.status(403).send(e)
    }
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

// CHANNEL API
module.exports = app.post('/channels', async (req: Request, res: Response) => {
    await connect()
    const all_channels = Channel.find().sort('channel')
    return res.status(200).json(all_channels)
})

interface ChannelInput {
    data:{
        channel_id: string,
        category: string
    },
    user: string
}
module.exports = app.post('/create_channel', async (req: Request, res: Response) => {
    await connect()
    const {data, user}:ChannelInput = req.body
    const channel_slug = data.category.replace(/ /g, '-').toLowerCase()
    const new_channel = new Channel({category: data.category, slug: channel_slug, top: false})
    new_channel.save()

    return res.status(200).json(new_channel)
    // return res.status(200).json({})
})

module.exports = app.post('/find_channel', async (req: Request, res: Response) => {
    await connect()
    const channel = req.body.channel
    console.log(channel)
    const channel_query = await Channel.find({category: {$regex: channel.toString()}})

    return res.status(200).json(channel_query)
})

module.exports = app.post('/delete_channel', async (req: Request, res: Response) => {
    await connect()
    const {data, user}:ChannelInput = req.body

    await Channel.findOneAndDelete({_id: data.channel_id})
    return res.status(200).json({'message': 'Channel Deleted'})
})

// VOTING 
interface VoteInput {
    vote_for: string,
    vote_type: string,
    vote: string
}

module.exports = app.post('/vote', async (req: Request, res: Response) => {
    await connect()
    const {vote_for, vote_type, vote}: VoteInput = req.body.data
    const user_id = req.body.user
    let vote_query
    let update_
    if (vote_type === 'post') {
        vote_query = Vote.where({ post: { $_id: vote_for}, user: {$_id: user_id} })
        update_ = await Post.findOne({_id: vote_for})
    } else {
        vote_query = Vote.where({ comment: { $_id: vote_for}, user: { $_id: user_id}})
        update_ = await Comment.findOne({_id: vote_for})
    }
    const vote_ = await Vote.findOne({[vote_type]: vote_for, user: user_id})
    let change = {
        agree: 'NA',
        disagree: 'NA'
    }
    if (vote_) {
        if (vote === vote_.vote) {
            if (vote === 'agree' && update_) {
                update_.agree = update_.agree - 1
                update_.save()
                change.agree = 'remove'
            } else if (vote === 'disagree' && update_) {
                update_.disagree = update_.disagree - 1
                update_.save()
                change.disagree = 'remove'
            }
            vote_.vote = 'NA'
            vote_.save()
        } else {
            if (vote === 'agree' && update_) {
                if (vote_.vote !== 'NA') {
                    update_.disagree = update_.disagree - 1
                    change.disagree = 'remove'
                }
                update_.agree = update_.agree + 1
                update_.save()
                change.agree = 'add'
            } else if (vote === 'disagree' && update_) {
                if (vote_.vote !== 'NA') {
                    update_.agree = update_.agree - 1
                    change.agree = 'remove'
                }
                update_.disagree = update_.disagree + 1
                update_.save()
                change.disagree = 'add'
            }
            vote_.vote = vote
            vote_.save()
        }
    } else {
        const new_vote = new Vote({
            post: vote_type === 'post' ? vote_for : null,
            comment: vote_type === 'comment' ? vote_for : null,
            vote: vote,
            user: user_id 
        })
        new_vote.save()

        if (vote === 'agree' && update_) {
            update_.agree = update_.agree + 1
            update_.save()
            change.agree = 'add'
        } else if (vote === 'disagree' && update_) {
            update_.disagree = update_.disagree + 1
            update_.save()
            change.disagree = 'add'
        }
    }
    return res.status(200).json(change)
})