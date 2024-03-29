import mongoose from "mongoose";
import { IUser } from '../auth/schema'
import { NextFunction } from "express";

type IPost = {
    id: number,
    title: string,
    description: string,
    author?: mongoose.Schema.Types.ObjectId,
    replies: [IComment],
    agree: number,
    disagree: number,
    created_at: Date,
    channel: IChannel,
    images: [string],
    user_agree?: number,
    user_disagree?: number,
    embedded: boolean,
    embedded_type: string,
    embedded_link: string,
    nsfw: boolean
}


const PostSchema = new mongoose.Schema<IPost>({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    replies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    }],
    images: [String],
    agree: Number,
    disagree: Number,
    created_at: {
        type: Date,
        default: Date.now(),
        immutable: true
    },
    channel: {
        type: mongoose.Schema.ObjectId,
        ref: 'Channel'
    },
    embedded: Boolean,
    embedded_type: String,
    embedded_link: String,
    nsfw: {type: Boolean, default: false}
})


export const Post = mongoose.model<IPost>('Post', PostSchema)


type IComment = {
    id: number,
    comment: string,
    author: IUser,
    agree: number,
    disagree: number,
    replies: [IComment],
    comment_to_id: IComment,
    post_id: IPost,
    created_at: Date
}
const CommentSchema = new mongoose.Schema<IComment>({
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    agree: Number,
    disagree: Number,
    replies: [
        {type: mongoose.Schema.Types.ObjectId, ref: 'Comment'}
    ],
    comment_to_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment'
    },
    post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post'
    },
    created_at: {
        type: Date,
        default: Date.now(),
        immutable: true
    }
})

export const Comment = mongoose.model<IComment>('Comment', CommentSchema)

type IChannel = {
    _id?: string,
    category: string,
    slug: string,
    top: boolean
}

const ChannelSchema = new mongoose.Schema<IChannel>({
    category: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    top: {
        type: Boolean,
        default: false
    }
})

export const Channel = mongoose.model<IChannel>('Channel', ChannelSchema)

// VOTE
type IVote = {
    _id?: string,
    user: mongoose.Schema.Types.ObjectId,
    comment?: mongoose.Schema.Types.ObjectId,
    post?: mongoose.Schema.Types.ObjectId,
    vote: string
}

const VoteSchema = new mongoose.Schema<IVote>({
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
    },
    comment: {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment'
    },
    post: {
        type: mongoose.Schema.ObjectId,
        ref: 'Post'
    },
    vote: String
})


export const Vote = mongoose.model<IVote>('Vote', VoteSchema)
export type { IPost, IComment, IChannel, IVote }