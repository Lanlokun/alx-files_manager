/* eslint-disable import/no-named-as-default */
import sha1 from 'sha1';
import Queue from 'bull/lib/queue';
import dbClient from '../utils/db';

const userQueue = new Queue('email sending');

export default class UsersController {
  static async postNew(req, res) {
    const email = req.body ? req.body.email : null;
    const password = req.body ? req.body.password : null;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return;
    }
    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return;
    }
    const user = await (await dbClient.usersCollection()).findOne({ email });

    if (user) {
      res.status(400).json({ error: 'Already exist' });
      return;
    }
    const insertionInfo = await (await dbClient.usersCollection())
      .insertOne({ email, password: sha1(password) });
    const userId = insertionInfo.insertedId.toString();

    userQueue.add({ userId });
    res.status(201).json({ email, id: userId });
  }

    static async getMe(req, res) {
        const token = req.headers['x-token'];
    
        const userId = await redisClient.get(`auth_${token}`);
    
        if (!userId) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
        }
        const user = await (await dbClient.usersCollection())
        .findOne({ _id: ObjectId(userId) });
    
        if (!user) {
        res.status(401).json({ error: 'Unauthorized' });
        return;
        }
        res.status(200).json({ id: user._id, email: user.email });
    }
}
