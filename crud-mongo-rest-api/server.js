const express = require('express')
const logger = require('morgan')
const errorhandler = require('errorhandler')
const bodyParser = require('body-parser')
const mongodb = require('mongodb')

const url = 'mongodb://localhost:27017/edx-course-db'
let app = express()
app.use(logger('dev'))
app.use(bodyParser.json())

// Connect to the mongodb database using the client
mongodb.MongoClient.connect(url, (err, client) => {
    if (err) return process.exit(1)

    // Get the database from the client
    const db = client.db('edx-course-db')

    // Get the accounts from the database
    app.get('/accounts', (req, res, next) => {
        // Set the collection to the accounts 
        db.collection('accounts')
            .find({}).sort({ name: -1 }).toArray((err, result) => {
                if (err) return next(err)
                res.send(result)
            })
    })

    // Insert new accounts document from the request body to the accounts collection
    app.post('/accounts', (req, res, next) => {
        let newAccount = req.body
        db.collection('accounts').insert(newAccount, (err, result) => {
            if (err) return next(err)
            res.send(result)
        })
    })

    // Update account based on passed ID paramater
    app.put('/accounts/:id', (req, res, next) => {
        let query = {_id: mongodb.ObjectID(req.params.id)}
        let updatedAccount = { $set: req.body}
        db.collection('accounts')
            .updateOne(query, updatedAccount, (err, result) => {
                    if (err) return next(err)
                    console.log(`Update ${result.result.n} documents`)
                    res.send(result)
                })
    })

    // Remove the account based on the id parameter
    app.delete('/accounts/:id', (req, res, next) => {
        db.collection('accounts')
            .remove({_id: mongodb.ObjectID(req.params.id)}, (err, result) => {
                if (err) return next(err)
                console.log(`Removed ${result.result.n} documents`)
                res.send(result)
            })
    })

    app.use(errorhandler())
    app.listen(3000, () => {
        console.log('Application running on port 3000')
    })
})