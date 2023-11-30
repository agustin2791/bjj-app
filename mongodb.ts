const mon = require('mongoose')

const conn = 'local'
const conn_translation = {
    local: 'mongodb://localhost/bjjdb'
}

export const connect = async () => {
    await mon.connect(conn_translation[conn],
        {useNewUrlParser: true, useUnifiedTopology: true})
    console.log('connected to mongodb')
}