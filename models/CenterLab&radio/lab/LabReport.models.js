import mongoose from "mongoose";
const Schema =mongoose.Schema;
const LabReportSchema=new Schema({
    type:{
        type:String,
        required:true
    },
    path:{
        type:String,
        required:true
    },
    createdBy:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    Patient:{
        type:mongoose.Types.ObjectId,
        ref:'Patient',
        required:true
    },
    prescription:{
        type:mongoose.Types.ObjectId,
        ref:'prescription',
        required:true
    }
    },{
    timestamps:true
})
export const LabReport=mongoose.model('LabReport',LabReportSchema);