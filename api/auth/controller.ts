import { connect } from "../../mongodb"
import express, { Express, Request, Response } from "express";
import { IUser } from "./schema";
import { SignAccessToken, SignRefreshToken, VerifyRefreshToken, verifyToken, UserID } from "./tokens";


const app:Express = express()
const User = require('./schema')


interface UserInput {
    username: string,
    email: string,
    password: string
}


module.exports = app.post('/register', async (req: Request, res: Response) => {
    await connect()
    const { username, email, password }: UserInput = req.body;

    try {
        const newUser = new User({
            username: username,
            email: email,
            password: password
        });
        await newUser.save()
    } catch (error) {
        console.log(error)
        return res.status(404).send('Cannot register new user')
    }
})

module.exports = app.post('/login', async (req: Request, res: Response) => {
    await connect()
    const { username, password }: UserInput = req.body;
    console.log('getting ', username, password)

    try {
        console.log('finding one')
        const query = User.where({username: username})
        let login_user = await query.findOne()
        console.log(login_user)
        if (!login_user) return res.status(404).send('User Not Found')

        const match = await login_user.comparePassword(password)
        console.log('is a match', match)
        if (match) {
            const access_token = await SignAccessToken(username, password)
            const access_refresh_token = await SignRefreshToken(username, password)
            console.log(login_user)
            return res.status(200).json({user: login_user, token: access_token, refresh_token: access_refresh_token})
        }
        return res.status(404).send('User Not Found')
    } catch (e) {
        console.log(e)
        return res.status(403).send('Not Found')
    }
})

module.exports = app.post('/refresh-token', async (req: Request, res: Response) => {
    console.log('refresh token request', req.body)
    try {
        const refresh_token:string = req.body.refresh_token
        const userId = await VerifyRefreshToken(refresh_token) as UserID
        console.log('verify_refresh token', userId)
        const accessToken = await SignAccessToken(userId.username, userId.password)
        const refreshToken = await SignRefreshToken(userId.username, userId.password)

        return res.status(200).json({token: accessToken, refresh_token: refreshToken})
    } catch (e) {
        return res.status(503).json({error: JSON.stringify(e)})
    }
    
})