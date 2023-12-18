import express, { Express, NextFunction, Request, Response } from "express";
import { SECRET_KEY, REFRESH_SECRET_KEY } from "../../secrets";

const app:Express = express()
const jwt = require('jsonwebtoken')

export interface UserID {
    username: string,
    password: string
}

export const SignAccessToken = async <T>(
    username: string,
    password: string
) : Promise<T> => {
    const access_token = jwt.sign({username: username, password: password}, SECRET_KEY, {
        expiresIn: '1w'
    })
    return access_token 
}

export const SignRefreshToken = async <T>(
    username: string,
    password: string
) : Promise<T> => {
    const access_token = jwt.sign({username: username, password: password}, REFRESH_SECRET_KEY, {
        expiresIn: '1y'
    })
    return access_token
}

export const verifyToken = (req: Request, res: Response, next: NextFunction)  => {
    if (!req.headers['authorization']) return next(new Error('Unauthorized'))
    const bearer_token = req.headers.authorization
    const token = bearer_token.split(' ')[1]

    jwt.verify(token, SECRET_KEY, (err: Error, payload: any) => {
        if (err) return next(err)
        req.body = payload
        next()
    })
}

export const VerifyRefreshToken = <UserID>(refreshToken: string) : Promise<UserID> => {
    return new Promise((resolve, reject) => {
        jwt.verify(refreshToken, REFRESH_SECRET_KEY, (err: Error, payload: any) => {
            if (err) return reject(new Error('Unauthorize'))
            console.log('verify token', payload)
            const userId = payload
            resolve(userId)
        })
    })
}



// export const VerifyRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         const { refresh_token } = req.body
//         if (!refresh_token) throw res.status(404).send('No Refresh Token')

//     } catch (error) {
//         next(error)
//     }
// }