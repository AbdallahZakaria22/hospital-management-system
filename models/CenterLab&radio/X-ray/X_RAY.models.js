import mongoose from "mongoose";
const Schema =mongoose.Schema;
const X_RAYSchema=new Schema({
  name:{
    type:String,
    required:true
  },
  
  Center:{
    type:mongoose.Types.ObjectId,
    ref:'Center',
    required:true
  }
},{
  timestamps:true
})
export const X_RAY=mongoose.model('X_RAY',X_RAYSchema);
