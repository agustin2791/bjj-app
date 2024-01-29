import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import axios from "axios";
import path from "path";
import cors from "cors";
import {connect} from './mongodb';
import { academyMiddleware, accessMiddleware } from "./middleware";
require('dotenv').config();
const auth = require('./api/auth/controller')
const forum = require('./api/forum/controller')
const academy = require('./api/academy/controller')
const maps = require('./api/mapController')

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());


const port = process.env.PORT || 8000;

app.get('/', (req: Request, res: Response) => {
res.send('Hello World From the Typescript Server!')
});

// API Calls
app.use('/auth', auth)
app.use('/forum', accessMiddleware, forum)
app.use('/academy', academyMiddleware, academy)
app.use('/maps', maps)
app.use('/google-map-search', async (req: Request, res: Response) => {

  try {
    const url = req.body.query
    const response = await axios.get(url)
    if (response.data.status === 'OK') {
      console.log('response data', response.data.candidates[0].geometry)
      const location = response.data.candidates[0].geometry.location
      return res.status(200).json(location)
    } else {
      return res.status(404).send('address not found')
    }
  } catch (e) {
    return res.status(404).send('not found')
  }
})



app.listen(port, async () => {
    await connect()
    console.log(`Example app listening on port ${port}`)
});



interface FormInput {
    email: string,
    password: string
}

const users = [
    {
      id: 1,
      name: 'Maria D',
      email: 'maria@example.com',
      password: 'maria123'
    },
    {
      id: 2,
      name: 'Juan Doe',
      email: 'juan@example.com',
      password: 'juan123'
    }
];

// routing  
// app.post('/login', (req: Request, res: Response) => {
//     const {email, password}: FormInput = req.body;

//     const user = users.find(user => {
//         return user.email === email && user.password === password
//     });

//     if (!user) {
//         return res.status(404).send('User not found')
//     }

//     return res.status(200).json(user)
// });