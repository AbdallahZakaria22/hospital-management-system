import mongoose from "mongoose";
const Schema =mongoose.Schema;
const testLabSchema=new Schema({
    Lab_Name:{
        type:String,
        required:true
      }
},{
  timestamps:true
})
export const testLab=mongoose.model('testLab',testLabSchema);