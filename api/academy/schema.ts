import mongoose from "mongoose";
import axios from "axios";
import { IUser } from '../auth/schema'

export type IAcademy = {
    _id?: string,
    name: string,
    slug: string,
    address: {
        street: string,
        street2: string,
        city: string,
        state: string,
        zip_code: string,
        country: string
    },
    formattedAddress: string,
    website: string,
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
        street2: String,
        city: String,
        state: String,
        zip_code: String,
        country: String
    },
    formattedAddress: String,
    website: String,
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
AcademySchema.pre('save', async function(next) {
    if (!this.formattedAddress || !this.formattedAddress.includes(this.address.street)){
        const {street, street2, city, state, zip_code, country} = this.address
        try {
            const GOOGLE_MAP_API = process.env.MAPAPI
            const full_address = `${street} ${street2}, ${city}, ${state} ${zip_code}`
            const goo_url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?fields=formatted_address%2Cname%2Crating%2Copening_hours%2Cgeometry&input=${full_address.replace(/ /g, '%2C')}&inputtype=textquery&key=${GOOGLE_MAP_API}`
            const data = await axios.get(goo_url)
            console.log(data.data)
            if (data.data.status === 'OK') {
                this.formattedAddress = data.data.candidates[0].formatted_address
                next()
            } else {
                next()
            }
        } catch (e) {
            next()
        }
    }
    next()
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