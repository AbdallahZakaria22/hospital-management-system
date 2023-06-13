import dotenv from 'dotenv';
import { customAlphabet, nanoid } from 'nanoid'
dotenv.config();
import { hash as _hash, compare } from 'bcrypt';
import { generateSingin as _generateSingin } from '../util/generateSingin.js';
import { userModel } from '../models/user.model.js';
import { sendMail as _sendMail } from '../emails/user.email.js';
import { catchAsncError } from "../util/catchAsncError.js";
import  jwt  from 'jsonwebtoken';
import { AppError } from '../util/AppError.js';
import { Patient } from '../models/Patient/Patient.models.js';
import { sendMail } from '../emails/userRestPassword.email.js';
export const SingnUp= catchAsncError(async(req,res,next)=>{
    let {name,email,password,role,Mobile,Gender,DOB,Address}=req.body;
    let Email=await userModel.findOne({email:email});
    if(!Email){ 
        let userID;
        _hash(password, Number(process.env.ROUND), async function(err, hash) {
            // Store hash in your password DB.
            await userModel.insertMany({name,email,password:hash,role,Mobile,Gender,DOB,Address}).then(response=>{
                userID=response[0]._id;
            });
            await Patient.insertMany({user:userID});
            _sendMail(email);
            res.json({message:'success',status:200});
        });
    }

    else{
        next(new AppError('Email Already in Use',422))
    }

})
export const SingnIn= catchAsncError(async(req,res,next)=>{
    const {email,password}=req.body;
    let user=await userModel.findOne({email:email});
    if(!user||!await compare(password, user.password))
        return next(new AppError('incorrect in email or password',401))
    if(!user.confirmEmail)
        return next(new AppError('this user not confirm',401))     
    let token=_generateSingin({name:user.name,role:user.role,id:user._id,email:user.email})
    req.Token=token
    res.json({message:'success',Token:token,status:200});
})
export const verifiy =catchAsncError(async(req,res,next)=>{
    let {token}=req.params;
    jwt.verify(token, process.env.JWT_KEY,  async function(err, decoded) {
        if(err){
            next(new AppError('Token is invalid',401)) 
        }
        else{
        await userModel.findOneAndUpdate({email:decoded.options},{confirmEmail:true});
        res.send(`<!DOCTYPE html>
        <html>
        
        <head>
          <meta charset="utf-8" />
          <title></title>
          <style>
            * {
              box-sizing: border-box;
            }
          </style>
        </head>
        
        <body style="background-color: #f4f4f4; font-family: Roboto, arial, sans-serif">
          <div style="background-color: #35b8e8; height: 140px;">
          </div>
          <div style="max-width: 550px; background-color: white; margin: -80px auto 0 auto; padding: 20px 60px 80px 60px;">
            <div style="  font-size: 50px; font-weight: 300; margin-top: 20px; text-align: center;"> Email Confirmed!</div>
            <br />
            <p style="font-size: 20px;">Congratulations! Your email has been confirmed and your account is ready. Please close this page and go back to  login.</p>
            <div class=" box-sizing: border-box; width: 100%;">
              <br />
              <br />
        
            </div>
          </div>
        </body>
        
        </html>`)
        }
    });
    
});
////////////////////////////////////////////////////////////////////////
export const sendCode=catchAsncError(async(req,res,next)=>{
let {email}=req.body;
let nanoId=customAlphabet('123456789',5);
let code=nanoId();
await userModel.findOneAndUpdate({email},{forgetCode:code}).then((data)=>{
    if(!data){
        return next(new AppError('Not Register account',404))
    }
    sendMail(code,email);
    res.json({message:'success',status:200});
})
});
////////////////////////////////////////////////////////////////////////
export const restPassword=catchAsncError(async(req,res,next)=>{
    let {email,code,newPassword}=req.body;
    _hash(newPassword, Number(process.env.ROUND), async function(err, hash) {
        await userModel.findOneAndUpdate({email,forgetCode:code},{password:hash}).then(async(data)=>{
            if(!data){
                return next(new AppError('code or email are invalid ',404))
            }
            await userModel.findOneAndUpdate({email},{forgetCode:null});
            res.json({message:'success',status:200});
        })
    })
    });