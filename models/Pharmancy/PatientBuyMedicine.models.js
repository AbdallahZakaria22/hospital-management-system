import mongoose from "mongoose";
const Schema =mongoose.Schema;
const PatientBuyMedicineSchema=new Schema({
  user:{
    type:mongoose.Types.ObjectId,
    ref:'user',
    required:true
  },
  Prescription:{
    type:mongoose.Types.ObjectId,
    ref:'prescription',
    required:true
  }
},{
  timestamps:true
})
export const PatientBuyMedicine=mongoose.model('PatientBuyMedicine',PatientBuyMedicineSchema);