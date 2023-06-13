import mongoose from "mongoose";
const Schema =mongoose.Schema;
const DoctorSchema=new Schema({
  Specialization:{
    type:String,
    required:true
  },
  Experience:{
    type:String,
    required:true
  },
  Language:{
    type:String,
    required:true
  },
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
confirmTiming:{
  type:String,
  default:-1
},
Salary:{
  type:mongoose.Types.ObjectId,
  ref:'Payment',
  required:true
}
},{
  timestamps:true
})
export const Doctor=mongoose.model('Doctor',DoctorSchema);
