import { createTransport } from "nodemailer";
import{userRestPasswordHTML} from './userRestPassword.html.js'
export async function sendMail(code,email) {

    let transporter = createTransport({
        service: 'gmail',
        auth: {
            user: 'hmsytem65@gmail.com',
            pass: 'gqvvhquecasoxvks', // generated ethereal password
        },
    });
    let info = await transporter.sendMail({
        from: '"HMS" <hmsytem65@gmail.com>',
        to: email,
        subject: "[HMS] Rest Password ",
        html: userRestPasswordHTML(code)
    });
}