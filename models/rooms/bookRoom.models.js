import mongoose from "mongoose";
const Schema =mongoose.Schema;
const bookRoomSchema=new Schema({
    Patient:{
        type:mongoose.Types.ObjectId,
        ref:'Patient',
        required:true
    },
    Room:{
        type:mongoose.Types.ObjectId,
        ref:'Room',
        required:true
    }
},{
    timestamps:true
})
export const bookRoom=mongoose.model('bookRoom',bookRoomSchema);