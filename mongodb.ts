import { MONGO_PADD_DEV, MONGO_PASS } from "./secrets"

const mon = require('mongoose')

const conn = 'prod'
const conn_translation = {
    local: 'mongodb://localhost/bjjdb',
    prod: `mongodb+srv://ahgoosesoftware:${MONGO_PASS}@bjjclustor.9dbddaq.mongodb.net/?retryWrites=true&w=majority&appName=BJJClustor`,
    dev: `mongodb+srv://ahgoosesoftware:${MONGO_PADD_DEV}@bjj-dev.pdsfdbw.mongodb.net/?retryWrites=true&w=majority&appName=bjj-dev`
}

export const connect = async () => {
    await mon.connect(conn_translation[conn],
        {useNewUrlParser: true, useUnifiedTopology: true})
}