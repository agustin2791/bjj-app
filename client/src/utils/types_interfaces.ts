import { Moment } from "moment"

export interface User {
    _id?: number,
    username?: string,
    email: string,
    password: string,
    createdAt: Date
}

export interface Profile {
    _id?: string,
    name: string,
    image?: any,
    user: User,
    belt_rank?: BeltRank,
    affiliation?: string,
    academy?: Academy,
    location?: string,
    academy_subs?: Academy[],
    channel_subs?: Channel[],
    is_adult?: boolean
}

export interface ForumEntry {
    _id?: string,
    title: string,
    description: string,
    author?: User,
    replies: Comment[],
    images?: string[],
    agree: number,
    disagree: number,
    created_at: Date,
    channel: string | Channel,
    embedded?: boolean,
    embedded_type?: string,
    embedded_link?: string,
    nsfw: boolean
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
    embedded_link?: string,
    images?: string[],
    has_images?: boolean,
    nsfw: boolean
}

export interface Comment {
    _id?: string,
    comment: string,
    author?: User | string,
    agree: number,
    disagree: number,
    replies: Array<Comment>,
    comment_to_id?: string,
    post_id?: string | ForumEntry,
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

export interface BeltRank {
    _id: string,
    color: string,
    stripes: number
}