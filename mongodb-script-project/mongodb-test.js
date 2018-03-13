const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

// Connection url
const url = 'mongodb://localhost:27017'

const insertDocuments = (db, callback) => {
    const collection = db.collection('edx-course-students')
    // Insert 3 documents
    collection.insert([
        {name: 'Bob'}, {name: 'John'}, {name: 'Ringo'}], 
        (err, result) => {
            if (err) return process.exit(1)
            console.log(result.result.n) // will be 3
            console.log(result.ops.length) // will be 3
            console.log(`Inserted ${result.insertedCount} documents into edx-course-students`)
            callback(result)
        })
}

const updateDocuments = (db, callback) => {
    // Get the edx-course-students collection
    const collection = db.collection('edx-course-students')
    // Update document where a is 2, set b equal to 1
    const name = 'John'
    collection.update({name: name}, {$set: {grade: 'A'}}, (err, result) => {
        if (err) return process.exit(1)
        console.log(result.result.n)
        console.log('Update collection document where name =', name)
        callback(result)
    })
}

const removeDocuments = (db, callback) => {
    // Get the students collection
    const collection = db.collection('edx-course-students')
    
    // Remove the student whose name is Ringo
    const name = 'Ringo'
    collection.remove({name: name}, (err, result) => {
        if (err) return process.exit(1)
        console.log(result.result.n)
        console.log('Removed document where name =', name);
        callback(result);
    })
}

const findDocuments = (db, callback) => {
    // get the collection to query 
    const collection = db.collection('edx-course-students')
    
    // invoke find method on that collection
    collection.find().toArray((error, docs) => {
        if (error) return process.exit(1)
        console.log(`We found ${docs.length} documents`)
        console.log('Here are the documents:')
        console.dir(docs)
        callback(docs)
    })
}

// Use connect method to connect to the server
MongoClient.connect(url, (err, client) => {
    if (err) return process.exit(1)
    console.log('Connected to the server!')
    
    // Get the database from the client
    const db = client.db('edx-course-db')
    
    // Perform queries
    insertDocuments(db, () => {
        updateDocuments(db, () => {
            removeDocuments(db, () => {
                findDocuments(db, () => {
                    client.close();
                })
            })
        })
    })
})