import mongoose from "mongoose";
const Schema =mongoose.Schema;
const medicalHistorySchema=new Schema({
    Conditions:{
        type:{},
        required:true
    },
    symptoms:{
        type:{},
        required:true
    },
    medication:{
        type:{},
        required:true
    },
    allergies:{
        type:{},
        required:true
    },
    tobacco:{
        type:{},
        required:true
    },
    illegalDrugs:{
        type:{},
        required:true
    },
    consumeAlcohol:{
        type:String,
        required:true
    },
    Patient:{
        type:mongoose.Types.ObjectId,
        ref:'Patient',
        required:true
        }
},{
    timestamps:true
})
export const medicalHistory=mongoose.model('medicalHistory',medicalHistorySchema);