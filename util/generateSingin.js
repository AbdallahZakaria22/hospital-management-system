import dotenv from 'dotenv';
dotenv.config();
import  jwt from 'jsonwebtoken'
export function generateSingin(payload){
    let token=jwt.sign(payload,process.env.JWT_KEY);
    return token;
}