import { MongoClient } from 'mongodb';
import { config } from 'dotenv';

/** db client */

config();

class DBClient {
  constructor() {
    this.db = null;
    this.client = new MongoClient(process.env.DB_HOST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    this.client.connect((err) => {
      if (err) console.log(err.message);
      this.db = this.client.db(process.env.DB_DATABASE);
    });
  }

  isAlive() {
    return !!this.client && !!this.db;
  }

  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

const dbClient = new DBClient();

export default dbClient;
