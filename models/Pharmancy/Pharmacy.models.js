import mongoose from "mongoose";
const Schema =mongoose.Schema;
const PharmacySchema=new Schema({
    Name:{
        type:String,
        required:true
      },
},{
  timestamps:true
})
export const Pharmacy=mongoose.model('Pharmacy',PharmacySchema);
