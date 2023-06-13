import mongoose from "mongoose";
const Schema =mongoose.Schema;
const appointmentSchema=new Schema({
    Patient:{
        type:mongoose.Types.ObjectId,
        ref:'Patient',
        required:true
        },
        Doctor:{
            type:mongoose.Types.ObjectId,
            ref:'Doctor',
            required:true
        },
        Date:{
            type:String,
            required:true
        }
},{
    timestamps:true
})
export const appointment=mongoose.model('appointment',appointmentSchema);