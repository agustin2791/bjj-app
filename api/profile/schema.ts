import mongoose, { Model, Document, Schema } from 'mongoose';
import { IAcademy } from '../academy/schema';
import { IChannel } from '../forum/schema';


interface IProfile {
    id: number,
    name: string,
    image: any,
    user: {type: Schema.Types.ObjectId, ref: 'User'},
    belt_rank: {type: Schema.Types.ObjectId, ref: 'BeltRank'},
    affiliation: string,
    academy: { type: Schema.Types.ObjectId, ref: 'Academy'},
    location: string,
    academy_subs: [IAcademy],
    channel_subs: [string],
    belt_verified: boolean,
    academy_verified: boolean,
    is_adult: boolean
}

type ProfileModel = Model<IProfile, {}, {}>
const profileSchema = new Schema<IProfile>({
    name: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        required: true
    },
    image: String,
    belt_rank: {
        type: Schema.Types.ObjectId,
        ref: 'BeltRank'
    },
    affiliation: {
        type: String
    },
    academy: {
        type: Schema.Types.ObjectId,
        ref: 'Academy'
    },
    location: {type: String},
    academy_subs: [
        {type: Schema.Types.ObjectId, ref: 'Academy'}
    ],
    channel_subs: [
        {type: Schema.Types.ObjectId, ref: 'Channel'}
    ],
    belt_verified: {type: Boolean, default: false},
    academy_verified: {type: Boolean, default: false},
    is_adult: {type: Boolean, default: false}
})

export const Profile = mongoose.model<IProfile>('Profile', profileSchema)

// BELT RANK
interface IBeltRank {
    color: string,
    stripes: number
}


type BeltRankModel = Model<IBeltRank, {}, {}>
const beltRankSchema = new Schema<IBeltRank>({
    color: {type: String, required: true},
    stripes: {type: Number, required: true, default: 0}
})

export const BeltRank = mongoose.model<IBeltRank>('BeltRank', beltRankSchema)

