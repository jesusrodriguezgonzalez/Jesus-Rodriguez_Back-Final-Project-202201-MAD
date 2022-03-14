import * as dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

export async function mongoConnect() {
    const user = process.env.DBUSER;
    const password = process.env.DBPASSWD;
    let dbName;

    if (process.env.NODE_ENV === 'test') {
        dbName = process.env.TESTDBNAME;
    } else {
        dbName = process.env.DBNAME;
    }

    const uri = `mongodb+srv://${user}:${password}@cluster0.mjbgi.mongodb.net/${dbName}?retryWrites=true&w=majority`;
    const dbConnect = await mongoose.connect(uri);
    return dbConnect;
}
