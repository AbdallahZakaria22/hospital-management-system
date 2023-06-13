import mongoose from "mongoose";
const Schema =mongoose.Schema;
const TimingSchema=new Schema({
        Days:[],
        Time:[]
},
{
    timestamps:true
  })
export const Timing=mongoose.model('Timing',TimingSchema);