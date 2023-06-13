import mongoose from "mongoose";
const Schema =mongoose.Schema;
const reportForPatientSchema=new Schema({
  Nurse:{
    type:mongoose.Types.ObjectId,
    ref:'user',
    required:true
  },
  Patient:{
    type:mongoose.Types.ObjectId,
    ref:'Patient',
    required:true
    },
    bodyTemperature:{
        type:String,
        required:true
    },
    pulseRate:{
        type:String,
        required:true
    },
    respirationRate:{
        type:String,
        required:true
    },
    bloodPressure:{
        type:String,
        required:true
    },
},{
  timestamps:true
})
export const reportForPatient=mongoose.model('reportForPatient',reportForPatientSchema);
