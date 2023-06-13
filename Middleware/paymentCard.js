import { Patient } from "../models/Patient/Patient.models.js";
import { Order } from "../models/Patient/order.models.js";
import { bookRoom } from "../models/rooms/bookRoom.models.js";
import { catchAsncError } from "../util/catchAsncError.js";

export const finshBay=catchAsncError(async(req,res,next)=>{
    let idOrder=req.orderID;
    await Order.findById(idOrder).then(async(orderData)=>{
        await Patient.findOne({user:orderData.user}).then(async(PatientData)=>{
            await bookRoom.findOneAndDelete({Patient:PatientData._id});
        })
    })

})