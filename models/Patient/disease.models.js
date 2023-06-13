import mongoose from "mongoose";
const Schema =mongoose.Schema;
const DiseaseSchema=new Schema({
    Patient:{
        type:mongoose.Types.ObjectId,
        ref:'Patient',
        required:true
        },
        Disease:{
            type:[],
            required:true
        },
},{
    timestamps:true
})
export const Disease=mongoose.model('Disease',DiseaseSchema);