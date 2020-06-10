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

    async insert(COLLECTION, data) {
        return Array.isArray(data) ?
            await this.insertMany(COLLECTION, data) :
            await this.insertOne(COLLECTION, data);
    }

    async insertOne(COLLECTION, data) {
        const db = await this.db();
        try {
            const collection = db.collection(COLLECTION);
            return await collection.insertOne(data);
        } finally {
            this.close();
        }
    }

    async insertMany(COLLECTION, data) {
        const db = await this.db();
        try {
            const collection = db.collection(COLLECTION);
            return await collection.insertMany(data);
        } finally {
            this.close();
        }
    }

    async find(COLLECTION, params) {
        params = this.convertParams(params);
        const db = await this.db();
        try {
            const collection = db.collection(COLLECTION);
            const result = await collection.find(params).toArray();
            return result.length === 0 ? null : result;
        } finally {
            this.close();
        }
    }

    async updateOne(COLLECTION, params, changes) {
        params = this.convertParams(params);
        changes = { $set: changes };
        const db = await this.db();
        try {
            const collection = db.collection(COLLECTION);
            const result = await collection.updateOne(params, changes);
            return result.result.n === 0 ? null : result;
        } finally {
            this.close();
        }
    }

    async deleteOne(COLLECTION, params, callback) {
        params = this.convertParams(params);
        const db = await this.db();
        try {
            const collection = db.collection(COLLECTION);
            const result = await collection.deleteOne(params);
            return result.result.n === 0 ? null : result;
        } finally {
            this.close();
        }
    }

    async findClient(ip) {
        const result = await this.find('Clients', { ip: ip});
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
