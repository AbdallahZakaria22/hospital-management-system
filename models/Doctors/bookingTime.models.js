import mongoose from "mongoose";
const Schema =mongoose.Schema;
const bookingTimeSchema=new Schema({
    doctor:{
        type:mongoose.Types.ObjectId,
        ref:'Doctor',
        required:true
      },
      Times:{
        type:mongoose.Types.ObjectId,
        ref:'Timing',
        required:true
      },
      limitRange:{
        type:Number,
        required:true
      }
    },
      {
        timestamps:true
      })
      export const bookingTime=mongoose.model('bookingTime',bookingTimeSchema);