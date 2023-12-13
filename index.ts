import dotenv from "dotenv";
import express, { Express, Request, Response } from "express";
import path from "path";
import cors from "cors";
import {connect} from './mongodb';

const auth = require('./api/auth/view')
const forum = require('./api/forum/controller')

dotenv.config();

const app: Express = express();

app.use(express.json());
app.use(cors());

app.get('/', (req: Request, res: Response) => {
res.send('Hello World From the Typescript Server!')
});

// API Calls
app.use('/auth', auth)
app.use('/forum', forum)

const port = process.env.PORT || 8000;

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