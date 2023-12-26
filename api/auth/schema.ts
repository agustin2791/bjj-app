import mongoose, { Model, Document, Schema } from 'mongoose';
import { UserInfo } from 'os';
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10 

export interface IUser {
    id: number,
    username: string,
    email: string,
    password: string,
    createdAt: Date,
    first_name: string,
    last_name: string,
    subscriptions: [mongoose.Schema.Types.ObjectId]
}

interface IUserMethods {
    comparePassword(): boolean
}

type UserModel = Model<IUser, {}, IUserMethods>;
const userSchema = new Schema<IUser>({
    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    subscriptions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Channel'
    }]
})

userSchema.pre('save', async function (next: any) {
    
    if (!this.isModified('password')) return next()

    try {
        const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
        this.password = await bcrypt.hash(this.password, salt)
        return next()
    } catch (err) {
        return next(err)
    }
})

userSchema.method('comparePassword', async function comparePassword(candidatePassword: string) {
    console.log('comparing passwords', candidatePassword)
    return await bcrypt.compare(candidatePassword, this.password)
})

const User = mongoose.model<IUser>('User', userSchema)
module.exports = User;
