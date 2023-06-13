import mongoose from "mongoose";
const Schema =mongoose.Schema;
const LaboratoriestSchema=new Schema({
  userId:{
    type:mongoose.Types.ObjectId,
    ref:'user',
    required:true
  },
  Laboratory:{
    type:mongoose.Types.ObjectId,
    ref:'Laboratory',
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
export const Laboratoriest=mongoose.model('Laboratoriest',LaboratoriestSchema);
