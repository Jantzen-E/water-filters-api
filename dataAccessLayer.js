const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
require('dotenv').config();
var cors = require('cors');
const databaseName = 'water-filtration-db';
const collectionName = 'water-filters';

const mongoDbUrl = process.env.ATLAS_CONNECTION;

const settings = {
    useUnifiedTopology: true
};

let database;

const Connect = function() {
    return new Promise((resolve, reject) => {
        MongoClient.connect(mongoDbUrl, settings, function(err, client) {
            if(err) {
                reject(err);
            }
            else {
                console.log('successfully connected to database');
                database = client.db(databaseName);
                resolve();
            }
        });
    });
};

const Find = function(product) {

    let productQuery = {};

    if(product) {
        productQuery = product;
    }
 
    return new Promise((resolve, reject) => {
        const productCollection = database.collection('water-filters');
        productCollection.find(productQuery).toArray(function(err, res) {
            if(err) {
                reject(err);
            }
            else {
                console.log('successfully found list of filters');
                resolve(res);
            }
        });
    });
};

const Insert = function(product) {
    return new Promise((resolve, reject) => {
        const productCollection = database.collection('water-filters');
        productCollection.insertOne(product, function(err, res) {
            if(err) {
                reject(err);
            }
            else {
                console.log('successfully inserted a new filter');
                resolve(res);
            }
        });
    });
};

const Update = function(product, newProduct) {
    return new Promise((resolve, reject) => {
        const productCollection = database.collection('water-filters');
        productCollection.updateOne(product, newProduct, function(err, res) {
            if(err) {
                reject(err);
            }
            else {
                console.log('successfully updated filters');
                resolve(res);
            }
        });
    });
};

const Remove = function(product) {
    return new Promise((resolve, reject) => {
        const productCollection = database.collection('water-filters');
        productCollection.deleteOne(product, function(err, res) {
            if(err) {
                reject(err);
            }
            else {
                console.log('successfully removed a filter');
                resolve(res);
            }
        });
    });
};

module.exports = { Connect, Find, Insert, Update, Remove };