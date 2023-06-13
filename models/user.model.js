import mongoose from "mongoose";
const Schema=mongoose.Schema;
const user=new Schema({
    name:{
    type:String,
    required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:['admin','user','doctor','pharmacist','Laboratoriest','Radiologist','Accountant','Nurse'],
        default:'user',
        required:true
    },
    Mobile:{
        type:Number,
        required:true
    },
    Gender:{
        type:String,
        required:true
    },
    DOB:{
        type:String,
        required:true
    },
    Address:{
        type:String,
        required:true
    },
    confirmEmail:{
        type:Boolean,
        default:false
    },
    forgetCode:{
        type:Number,
        default:null
    }
});
export const userModel=mongoose.model('user',user);