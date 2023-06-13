import mongoose from "mongoose";
const Schema =mongoose.Schema;
const EmployeeSchema=new Schema({
    name:{
        type:String,
        required:true
        },
        role:{
            type:String,
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
            Times:{
            type:mongoose.Types.ObjectId,
            ref:'Timing',
            required:true
            },
            Salary:{
            type:mongoose.Types.ObjectId,
            ref:'Payment',
            required:true
            }
},{
    timestamps:true
})
export const Employee=mongoose.model('Employee',EmployeeSchema);
