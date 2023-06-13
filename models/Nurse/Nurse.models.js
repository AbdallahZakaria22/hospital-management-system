import mongoose from "mongoose";
const Schema =mongoose.Schema;
const NurseSchema=new Schema({
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
export const Nurse=mongoose.model('Nurse',NurseSchema);
