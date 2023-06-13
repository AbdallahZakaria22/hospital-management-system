import mongoose from "mongoose";
const Schema =mongoose.Schema;
const AccountantSchema=new Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    ref:'user',
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
export const Accountant=mongoose.model('Accountant',AccountantSchema);
