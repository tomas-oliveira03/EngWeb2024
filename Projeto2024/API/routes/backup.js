var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var mongoose = require('mongoose');

router.get('/export', async function(req, res, next) {
    try {
        // Ensure the directory exists
        const exportDir = 'exportedData';
        if (!fs.existsSync(exportDir)){
            fs.mkdirSync(exportDir);
        }

        // Export collections
        await exportCollection('ruas', exportDir, true);
        await exportCollection('users', exportDir, false);
        await exportCollection('sugestoes', exportDir, false);
        await exportCollection('posts', exportDir, false);

        res.status(200).send('true');
    } catch (err) {
        console.error('Error exporting data', err);
        res.status(500).send('false');
    }
});

router.get('/import', async function(req, res, next) {
    try {
        const importDir = 'exportedData';
        if (!fs.existsSync(importDir)) {
            return res.status(400).send('false');
        }

        // Import collections
        await importCollection('ruas', importDir, true);
        await importCollection('users', importDir, false);
        await importCollection('sugestoes', importDir, false);
        await importCollection('posts', importDir, false);

        res.status(200).send('true');
    } catch (err) {
        console.error('Error importing data', err);
        res.status(500).send('false');
    }
});

// Auxiliary functions
const exportCollection = async (collectionName, exportDir, flag) => {
    try {
        // Fetch documents from the collection
        const docs = await mongoose.connection.db.collection(collectionName).find({}).toArray();

        let sanitizedDocs = [];
        if (!flag) {
            // Remove the _id field from each document
            sanitizedDocs = docs.map(doc => {
                const { _id, ...rest } = doc; // Use destructuring to remove _id
                return rest;
            });
        }
        else {
            sanitizedDocs = docs;
        }

        // Define the file path
        const filePath = path.join(exportDir, `${collectionName}.json`);

        // Write sanitized documents to the file
        fs.writeFileSync(filePath, JSON.stringify(sanitizedDocs, null, 2));
    } catch (err) {
        console.error(`Error writing ${collectionName} to file`, err);
    }
};

const importCollection = async (collectionName, importDir, flag) => {
    try {
        const filePath = path.join(importDir, `${collectionName}.json`);
        if (fs.existsSync(filePath)) {
            const data = fs.readFileSync(filePath, 'utf8');
            const docs = JSON.parse(data);

            let sanitizedDocs = docs;
            if (!flag) {
                // Ensure each document does not have _id field
                sanitizedDocs = docs.map(doc => {
                    const { _id, ...rest } = doc;
                    return rest;
                });
            }

            const collection = mongoose.connection.db.collection(collectionName);
            await collection.deleteMany({}); // Clear existing documents

            if (sanitizedDocs.length > 0) {
                await collection.insertMany(sanitizedDocs); // Insert sanitized documents
            } 
        } else {
            console.warn(`File ${filePath} does not exist.`);
        }
    } catch (err) {
        console.error(`Error importing ${collectionName} from file`, err);
    }
};

module.exports = router;