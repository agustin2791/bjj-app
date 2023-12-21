export interface User {
    _id?: number,
    username?: string,
    email: string,
    password: string,
    createdAt: Date
}

export interface ForumEntry {
    _id?: number | undefined,
    title: string,
    description: string,
    author?: User | string,
    replies: Array<Comment>,
    agree: number,
    disagree: number,
    created_at?: Date | null
}

export interface Comment {
    _id?: number | undefined,
    comment: string,
    author?: User | string,
    agree: number,
    disagree: number,
    replies: Array<Comment>,
    comment_to_id?: number,
    post_id?: number,
    created_at?: Date | null
}