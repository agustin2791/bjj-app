import mongoose from "mongoose";
import { IUser } from '../auth/model'

type IPost = {
    id: number,
    title: string,
    description: string,
    author?: mongoose.Schema.Types.ObjectId,
    replies: [IComment],
    agree: number,
    disagree: number,
    created_at: Date
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
    agree: Number,
    disagree: Number,
    created_at: {
        type: Date,
        default: Date.now(),
        immutable: true
    }
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
    created_at: Date
}
const CommentSchema = new mongoose.Schema<IComment>({
    comment: {
        type: String,
        required: true
    },
    author: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    agree: Number,
    disagree: Number,
    replies: [
        {type: mongoose.Schema.ObjectId, ref: 'Comment'}
    ],
    comment_to_id: {
        type: mongoose.Schema.ObjectId,
        ref: 'Comment'
    },
    created_at: {
        type: Date,
        default: Date.now(),
        immutable: true
    }
})

export const Comment = mongoose.model<IComment>('Comment', CommentSchema)


export type { IPost, IComment }