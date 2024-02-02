import { Moment } from "moment"

export interface User {
    _id?: number,
    username?: string,
    email: string,
    password: string,
    createdAt: Date
}

export interface Profile {
    id?: number,
    name: string,
    image?: any,
    user: User,
    belt_rank?: string,
    affiliation?: string,
    academy?: Academy,
    location?: string,
    academy_subs?: [string],
    channel_subs?: [string]
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
    slug?: string,
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
    admin?: [User],
    formattedAddress?: string,
    website?: string,
    location?: {lat: number, lng: number}
}

export interface AcademyClass {
    _id?: string,
    name: string,
    academy: string,
    details: string,
}

export interface Schedule {
    _id?: string,
    name: string,
    classes: [AcademyClassSchedule]
}

export interface AcademyClassSchedule {
    _id?: string,
    academy_class: AcademyClass,
    schedule: [
        {
            day: string, 
            start: string | Moment, 
            end: string | Moment, 
            instructor: string, 
            instructor_id?: User}
    ] | []
}

export interface AcademyInstructor {
    _id?: string,
    name: string,
    belt_rank: string,
    classes: AcademyClass[],
    user?: User
}