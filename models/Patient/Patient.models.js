import mongoose from "mongoose";
const Schema =mongoose.Schema;
const PatientSchema=new Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:'user',
        required:true
      }
},{
    timestamps:true
})
export const Patient=mongoose.model('Patient',PatientSchema);
