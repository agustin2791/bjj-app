import { Request, Response, NextFunction } from "express";
import { connect } from "./mongodb";
import { SECRET_KEY } from "./secrets";
import { Academy } from "./api/academy/schema";

const jwt = require('jsonwebtoken')

const authorizeToken = (bearer_token: string): boolean => {
    const token = bearer_token.split(' ')[1]

    return jwt.verify(token, SECRET_KEY, (err: Error, payload: any) => {
        if (err) return false
        return true
    })
}

export const accessMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try  {
        console.log(req.url)
        if (req.url.includes('/posts')) return next()
        if (!req.headers['authorization']) return res.status(502).send('No auth token')
        let bearer_token = req.headers.authorization
        const has_access = authorizeToken(bearer_token)
        if (has_access) next()
        else return res.status(401).send('Expired token')
    } catch (e) {
        console.log(e)
        return res.status(401).send(e)
    }
}

export const academyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.url.includes('get')) return next()
        if (!req.headers['authorization']) return res.status(502).send('No auth token')
        let bearer_token = req.headers.authorization
        console.log(bearer_token)
        const has_access = authorizeToken(bearer_token)
        console.log(has_access)
        if (!has_access) res.status(401).send('Expired token')
        if (Object.keys(req.body).includes('user')) {
            // check if user is in the academy admin
            await connect()
            const academy_id = req.body.academy_id
            const academies = await Academy.findById(academy_id)
            const is_admin = academies?.admin.includes(req.body.user._id)
            if (is_admin) next()
            else res.status(401).json({"message": "You do not have access to this academy", "error": true})
        } else {
            return res.status(401).send('You must be signed in')
        }
    } catch (e) {
        return res.status(401).send(e)
    }
}