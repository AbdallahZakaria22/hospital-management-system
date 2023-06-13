import { createTransport } from "nodemailer";
import { userEamilHTML } from './HMS.html.js';
import  jwt from 'jsonwebtoken'
import dotenv from 'dotenv';
import { generateSingin } from './../util/generateSingin.js';
dotenv.config();
export async function sendMail(options,role,password) {

    let transporter = createTransport({
        service: 'gmail',
        auth: {
            user: 'hmsytem65@gmail.com',
            pass: 'gqvvhquecasoxvks', // generated ethereal password
        }, 
    });
    // let token =jwt.sign({options},process.env.JWT_KEY) 
    let token=generateSingin({options})
    let info = await transporter.sendMail({
        from: '"HMS" <hmsytem65@gmail.com>',
        to: options,
        subject: "[HMS] Please verify your Email ",
        html: userEamilHTML(options,token,role,password)
    });
}