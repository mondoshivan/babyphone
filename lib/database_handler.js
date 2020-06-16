const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectID;
const config = require('./config');
const debug = require('debug')('babyphone:database_handler');

class DatabaseHandler {

    constructor() {
        const USER      = config.get('db.user');
        const PASSWORD  = config.get('db.password');
        const HOST      = config.get('db.host');
        const PORT      = config.get('db.port');
        this.db_name    = config.get('db.name');
        this.URL        = "mongodb://"+USER+":"+PASSWORD+"@"+HOST+":"+PORT;
        this.client     = null;
    }

    convertId(id) {
        return new ObjectId(id);
    }

    convertParams(config) {
        const { id } = config;
        if (id === undefined) { return config; }
        try {
            config['_id'] = this.convertId(id);
            delete config.id;
        } catch (e) {
            debug('Converting failed!');
            debug(config);
            debug(e);
        }
        return config;
    }

    async db() {
        this.client = await MongoClient.connect(this.URL, { useUnifiedTopology: true });
        return this.client.db(this.db_name);
    }

    async insert(collectionName, data) {
        return Array.isArray(data) ?
            await this.insertMany(collectionName, data) :
            await this.insertOne(collectionName, data);
    }

    async insertOne(collectionName, data) {
        const db = await this.db();
        try {
            const collection = db.collection(collectionName);
            return await collection.insertOne(data);
        } finally {
            this.close();
        }
    }

    async insertMany(collectionName, data) {
        const db = await this.db();
        try {
            const collection = db.collection(collectionName);
            return await collection.insertMany(data);
        } finally {
            this.close();
        }
    }

    async find(collectionName, params) {
        params = this.convertParams(params);
        const db = await this.db();
        try {
            const result = await db.collection(collectionName).find(params).toArray();
            return result.length === 0 ? null : result;
        } finally {
            this.close();
        }
    }

    async updateOne(collectionName, params, changes) {
        params = this.convertParams(params);
        changes = { $set: changes };
        const db = await this.db();
        try {
            const collection = db.collection(collectionName);
            const result = await collection.updateOne(params, changes);
            return result.result.n === 0 ? null : result;
        } finally {
            this.close();
        }
    }

    async deleteOne(collectionName, params) {
        params = this.convertParams(params);
        const db = await this.db();
        try {
            const collection = db.collection(collectionName);
            const result = await collection.deleteOne(params);
            return result.result.n === 0 ? null : result;
        } finally {
            this.close();
        }
    }

    async deleteMany(collectionName, params) {
        params = this.convertParams(params);
        const db = await this.db();
        try {
            const collection = db.collection(collectionName);
            return await collection.deleteMany(params);
        } finally {
            this.close();
        }
    }

    async findClient(params) {
        params = this.convertParams(params);
        const result = await this.find('Clients', params);
        if (result && result.length === 1) {
            return result[0];
        } else {
            return null;
        }
    }

    close() {
        if (this.client) { this.client.close();}
    }
}

module.exports = DatabaseHandler;
