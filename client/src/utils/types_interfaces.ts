export interface User {
    _id?: number,
    username?: string,
    email: string,
    password: string,
    createdAt: Date
}

export interface ForumEntry {
    _id: number,
    title: string,
    description: string,
    author?: User,
    replies: Comment[],
    agree: number,
    disagree: number,
    created_at: Date,
    channel: string,
    embedded?: boolean,
    embedded_type?: string,
    embedded_link?: string
}

export interface ForumEntryBus {
    title: string,
    description: string,
    author?: string,
    replies?: Comment[],
    agree: number,
    disagree: number,
    channel: string,
    embedded?: boolean,
    embedded_type?: string,
    embedded_link?: string
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

export interface Channel {
    _id: string,
    category: string,
    slug: string,
    top: boolean
}

export interface Academy {
    _id?: string,
    name: string,
    address: {
        street: string,
        city: string,
        state: string,
        zip_code: string,
        country: string
    },
    phone_number: string,
    preferred_email: string,
    affiliation: string,
    affiliation_id?: string,
    owner: User,
    head_instructor: string,
    head_instructor_id?: string,
    instructors?: [string],
    instructors_id?: [User],
    schedule?: [Schedule],
    students?: [User],
    private?: boolean,
    admin?: [User]
}

export interface Schedule {
    _id?: string,
    name: string,
    classes: [AcadamyClass]
}

export interface AcadamyClass {
    _id?: string,
    name: string,
    description: string,
    start: string,
    end: string,
    instructor: string,
    instructor_id?: User
}