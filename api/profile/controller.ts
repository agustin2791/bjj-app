import { connect } from "../../mongodb";
import express, { Express, Request, Response} from 'express'
import { Profile } from "./schema";
import { IUser, User } from "../auth/schema";
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "../../secrets";
import multer from 'multer';
import path from 'path'
import { Channel, IChannel } from "../forum/schema";
import mongoose, { mongo } from "mongoose";
const app: Express = express()
const storage = multer.memoryStorage()
const upload = multer({storage: storage})

module.exports = app.post('/get_profile', async (req: Request, res: Response) => {
    await connect()
    try {
        const username = req.body.user
        const user = await User.findOne({username})
        const profile_list = await Profile.find({user: user?._id}).populate('channel_subs').exec()
        if (profile_list.length > 1) {
            for (let i = 1; i < profile_list.length; i++) {
                await Profile.findByIdAndDelete(profile_list[i]._id)
            }
        }
        const profile = profile_list[0]
        if (profile) {
            return res.status(200).json(profile)
        } else {
            // const user = await User.findOne({user: {username}})
            const new_profile = new Profile({
                name: username,
                user: user
            })
            await new_profile.save()
            await new_profile.populate('channel_subs', 'academy_subs')
            return res.status(200).json(new_profile)
        }
    } catch (e) {
        console.log(e)
        return res.status(400).send('could not find profile')
    }
})

module.exports = app.post('/update_profile', async (req: Request, res: Response) => {
    await connect()
    try {
        const username = req.body.username
        const updates = req.body.updates
        const user = await User.findOne({username})
        const profile = await Profile.findOneAndUpdate({user}, updates).populate('channel_subs')

        return res.status(200).json(profile)
    } catch (e) {
        return res.status(400).send('No updates made')
    }
})

interface subToggleBus {
    channel: string,
    profile_id: string
}
module.exports = app.post('/toggle_subscriptions', async (req: Request, res: Response) => {
    await connect()
    try {
        const { channel, profile_id }: subToggleBus = req.body
        
        const channel_ = await Channel.findOne({slug: channel})
        const profile = await Profile.findById(profile_id).populate('channel_subs')
        if (!channel_) return res.status(403).send('No channel found')
        console.log(profile?.channel_subs.includes(channel_._id), profile?.channel_subs)
        const subs_flat = profile?.channel_subs.map((c) => {return c.id as string})
        console.log(subs_flat?.includes(channel_.id as string), subs_flat, channel_.id)
        if (subs_flat?.includes(channel_.id as string)) {
            profile?.channel_subs.pull(channel_)
            await profile?.save()
        } else {
            profile?.channel_subs.push(channel_)
            await profile?.save()
        }
        return res.status(200).json(profile)
    } catch (e) {
        console.log(e)
        return res.status(403).send('Nothing happened')
    }
})

module.exports = app.post('/update_image', upload.single('image'), async (req: Request, res: Response) => {
    await connect()
    const AWS = require('aws-sdk')
    try {
        if (!req.file) {
            return res.status(400).send('no files were uploaded.')
        }
        AWS.config.update({
            region: 'us-east-2',
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY
        })
        const s3 = new AWS.S3();
        console.log(req.body)
        const image = req.file
        console.log('image:', image)
        const username = req.body.username
        const params = {
            Bucket: 'bjj-app',
            Key: `profile/${username}/${path.basename(image.originalname)}`,
            Body: image.buffer,
            ACL: 'public-read'
        }
        const user = await User.findOne({username})
        let profile = await Profile.findOne({user: user?._id})
        s3.upload(params, (err: any, data: any) => {
            if (err) {
                return res.status(400).json({"error": true, "message": err.message})
            } else {
                console.log(data.Location)
                profile!.image = data.Location
                profile?.save()
                return res.status(200).json(profile)
            }
        })
    } catch (e) {
        console.log(e)
        return res.status(404).json({"error": true, "message": "nothing was updated"})
    }
})