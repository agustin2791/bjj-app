import mongoose from "mongoose";
import { IUser } from '../auth/schema'

type IAcademy = {
    _id?: string,
    name: string,
    slug: string,
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
    affiliation_id: mongoose.Schema.Types.ObjectId,
    owner: IUser,
    head_instructor: string,
    head_instructor_id?: mongoose.Schema.Types.ObjectId,
    instructors: [string],
    instructors_id?: [IUser],
    schedule: [ISchedule],
    students: [IUser],
    private: boolean,
    admin: [IUser]
}

const AcademySchema = new mongoose.Schema<IAcademy>({
    name: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    address: {
        street: String,
        city: String,
        state: String,
        zip_code: String,
        country: String
    },
    phone_number: String,
    preferred_email: String,
    affiliation: {
        type: String,
        required: true
    },
    affiliation_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Academy',
        required: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    head_instructor: {
        type: String,
        required: true
    },
    head_instructor_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref: 'User'
    },
    instructors: [String],
    instructors_id: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    schedule: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Schedule'
    }],
    students: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    private: Boolean,
    admin: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }]
})

export const Academy = mongoose.model<IAcademy>('Academy', AcademySchema)

type ISchedule = {
    _id?: string,
    name: string,
    classes: [IClass]
}

const ScheduleSchema = new mongoose.Schema<ISchedule>({
    name: String,
    classes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AcademyClass'
    }]
})

export const Schedule = mongoose.model<ISchedule>('Schdule', ScheduleSchema)

type IClass = {
    _id?: string,
    name: string,
    description: string,
    start: string,
    end: string,
    instructor: string,
    instructor_id?: IUser
}

const AcademyClassSchema = new mongoose.Schema<IClass>({
    name: {type: String, required: true},
    description: {type: String, required: true},
    start: {type: String, required: true},
    end: {type: String, required: true},
    instructor: String,
    instructor_id: {type: mongoose.Schema.Types.ObjectId, ref: 'User'}
})

export const AcademyClass = mongoose.model<IClass>('AcademyClass', AcademyClassSchema)