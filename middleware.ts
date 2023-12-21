import { Request, Response, NextFunction } from "express";
import { SECRET_KEY } from "./secrets";

const jwt = require('jsonwebtoken')

export const accessMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try  {
        if (!req.headers['authorization']) return res.status(502).send('No auth token')
        const bearer_token = req.headers.authorization
        const token = bearer_token.split(' ')[1]

        jwt.verify(token, SECRET_KEY, (err: Error, payload: any) => {
            if (err) return res.status(401).send(err)
            // req.body = payload
            next()
        })
    } catch (e) {
        console.log(e)
        return res.status(401).send(e)
    }
}