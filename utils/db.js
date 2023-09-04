import mongodb from 'mongodb';
// eslint-disable-next-line no-unused-vars
import Collection from 'mongodb/lib/collection';
import envLoader from './env_loader';


class DBClient {

    constructor() {
        envLoader();
        const { DB_HOST, DB_PORT, DB_DATABASE } = process.env;
        this.host = DB_HOST;
        this.port = DB_PORT;
        this.database = DB_DATABASE;
        this.client = new mongodb.MongoClient(`mongodb://${this.host}:${this.port}`, { useUnifiedTopology: true });

        this.client.connect((err) => {
            if (err) console.log(err);
            else console.log('Database connected');
        });
    }

        isAlive() {
            return this.client.isConnected();
        }

        async nbUsers() {
            return this.client.db(this.database).collection('users').countDocuments();
        }

        async nbFiles() {
            return this.client.db(this.database).collection('files').countDocuments();
        }
        
        async findUser(user) {
            return this.client.db(this.database).collection('users').findOne(user);
        }

        async createUser(user) {
            return this.client.db(this.database).collection('users').insertOne(user);
        }

}

const dbClient = new DBClient();

export default dbClient;