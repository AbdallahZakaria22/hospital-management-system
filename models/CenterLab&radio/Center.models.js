import mongoose from "mongoose";
const Schema =mongoose.Schema;
const CenterSchema=new Schema({
    Name:{
        type:String,
        required:true
      }
},{
  timestamps:true
})
export const Center=mongoose.model('Center',CenterSchema);
