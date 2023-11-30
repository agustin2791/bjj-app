import { connect } from "../../mongodb"
import express, { Express, Request, Response } from "express";
import { IUser } from "./model";


const app:Express = express()
const User = require('./model')

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
        const login_user = await query.findOne()
        if (!login_user) return res.status(404).send('User Not Found')

        const match = await login_user.comparePassword(password)
        console.log('passwords match', match)
        if (match) return res.status(200).json(login_user)
        return res.status(404).send('User Not Found')
        // await User.find(function(err: Error, user: any) {
        //     console.log(user)
        //     if (err) throw err;

        //     user.comparePassword(password, function(err: any, isMatch: boolean) {
        //         if (err) throw err;

        //         return res.status(200).json(user)
        //     })
        // })
    } catch {
        return res.status(403).send('Not Found')
    }
})