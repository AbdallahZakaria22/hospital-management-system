import mongoose from "mongoose";
const Schema =mongoose.Schema;
const PaymentSchema=new Schema({
      Salary:{
        type:Number,
        required:true
      }
},
{
    timestamps:true
  })
export const Payment=mongoose.model('Payment',PaymentSchema);