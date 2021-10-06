const mongoClient = require('mongodb').MongoClient
const state = {
    db: null
}

module.exports.connect = (done) => {
    const url = process.env.MONGODB_URI
    const dbname = process.env.MONGODB_DB
    mongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, data) => {
        if (err) return done(err)
        state.db = data.db(dbname)
        done()
    })
}

module.exports.get = () => state.db