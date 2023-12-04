import mongoose, { Model, Document, Schema } from 'mongoose';


interface IProfile {
    id: number,
    name: string,
    user: {type: Schema.Types.ObjectId, ref: 'user'},
    belt_rank: {type: Schema.Types.ObjectId, ref: 'BeltRank'},
    affiliation: string,
    acadamy: { type: Schema.Types.ObjectId, ref: 'Acadamy'},
    location: string   
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
    belt_rank: {
        type: Schema.Types.ObjectId,
        ref: 'BeltRank'
    },
    affiliation: {
        type: String
    },
    acadamy: {
        type: Schema.Types.ObjectId
    },
    location: {type: String}
})

const Profile = mongoose.model<IProfile>('Profile', profileSchema)
module.exports = Profile;

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

const BeltRank = mongoose.model<IBeltRank>('BeltRank', beltRankSchema)
module.exports = BeltRank
