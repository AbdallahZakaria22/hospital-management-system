import mongoose from 'mongoose'
import dotenv from 'dotenv';
dotenv.config();
export function DBConnect() {
    mongoose.set('strictQuery', false);
    mongoose.connect(process.env.DB_CONNECTION).then(() => {
        console.log("connected!");
    }).catch((error) => {
        console.log('Not connect!', error);
    });
}