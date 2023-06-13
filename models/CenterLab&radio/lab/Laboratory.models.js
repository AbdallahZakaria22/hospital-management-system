import mongoose from "mongoose";
const Schema =mongoose.Schema;
const LaboratorySchema=new Schema({
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
export const Laboratory=mongoose.model('Laboratory',LaboratorySchema);
