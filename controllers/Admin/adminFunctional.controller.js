import { Patient } from "../../models/Patient/Patient.models.js";
import { Room } from "../../models/rooms/room.model.js"
import { AppError } from "../../util/AppError.js";
import { catchAsncError } from "../../util/catchAsncError.js"
import { userModel } from './../../models/user.model.js';
import { Doctor } from './../../models/Doctors/Doctors.models.js';
import { appointment } from './../../models/Patient/appointment.models.js';
import { Order } from "../../models/Patient/order.models.js";

export const addRoom=catchAsncError(async(req,res,next)=>{
    let {RoomType,price}=req.body;
    let numRoom=await Room.find({RoomType:RoomType}).countDocuments();
    await Room.insertMany({RoomType,price,numberRoom:numRoom+1}).then(()=>{
        res.json({message:'success',status:200})
    }).catch((err)=>{
        next(new AppError('Failed',422));
    })
})
export const searchPatient=catchAsncError(async(req,res,next)=>{
    await Patient.find({},{__v:0,createdAt:0,updatedAt:0}).populate('user','name email Mobile Gender').then((data)=>{
        res.json({message:'success',data,status:200})
    })
})
//////////////////////////////////////////////////////////////////////////////
export const viewPatient=catchAsncError( async(req,res,next)=> {
    const {currentPage} = req.query || 1;
    const perPage = 10;
    let totalItems;
    let patients=  await Patient.find().countDocuments()
    .then(count => {
      totalItems = count;
      return Patient.find({},{__v:0,createdAt:0,updatedAt:0}).populate('user','name email Mobile Gender')
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    });
    res.json({message:'success',Patients:patients,status:200,totalPatient: totalItems})
      })
/////////////////////////////////////////////////////////////////////////////
export const viewAllRooms=catchAsncError(async(req,res,next)=>{
    let currentPage=req.query.currentPage;
    await Room.find().then(async(data)=>{
        let perPage=10;
        let totalRooms;
    let rooms=  await Room.find().countDocuments()
    .then(count => {
      totalRooms = count;
      return Room.find({},{__v:0,createdAt:0,updatedAt:0 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    });
    res.json({message:'success',Rooms:rooms,status:200,totalRooms: totalRooms}) ;
    })
});
//////////////////////////////////////////////////////////////////
export const updateRoom=catchAsncError(async(req,res)=>{
    let idRoom=req.query.idRoom;
    let {status,RoomType,price}=req.body;
    await Room.findOne({_id:idRoom}).then(async(data)=>{
        if(!data){
            next(new AppError('Room Not Found',406));
        }
        await Room.updateOne({_id:idRoom},{status,RoomType,price}).then((result)=>{
            res.json({message:'success',status:200})
        })
    })
    
});
/////////////////////////////////////////////////////////////////////
export const deleteRoom=catchAsncError(async(req,res,next)=>{
    let idRoom=req.query.idRoom;
    let currentPage=req.query.currentPage;
    await Room.findOne({_id:idRoom}).then(async(data)=>{
        if(!data){
            next(new AppError('Room Not Found',406));
        }
        await Room.deleteOne({_id:idRoom})
        let perPage=10;
        let totalRooms;
    let deleteRooms=  await Room.find().countDocuments()
    .then(count => {
      totalRooms = count;
      return Room.find({},{__v:0,createdAt:0,updatedAt:0 })
        .skip((currentPage - 1) * perPage)
        .limit(perPage);
    });
    res.json({message:'success',Rooms:deleteRooms,status:200,totalRooms: totalRooms}) ;
    })
});
/////////////////////////////////////////////////////////////////////////////
export const Dashboard=catchAsncError(async(req,res,next)=>{
    let dashBoard={};
    let patient=[];
    let numDoctors=await userModel.find({role:"doctor"}).countDocuments();
    let numPatients=await userModel.find({role:"user"}).countDocuments();
    let numPharmacist=await userModel.find({role:"pharmacist"}).countDocuments();
    let numLaboratoriests=await userModel.find({role:"Laboratoriest"}).countDocuments();
    let numRadiologists=await userModel.find({role:"Radiologist"}).countDocuments();
    let numAccountants=await userModel.find({role:"Accountant"}).countDocuments();
    let numNurses=await userModel.find({role:"Nurse"}).countDocuments();
    dashBoard.NumberOfTotalDoctors=numDoctors;
    dashBoard.NumberOfTotalPatients=numPatients;
    dashBoard.NumberOfTotalPharmacists=numPharmacist;
    dashBoard.NumberOfTotalLaboratoriests=numLaboratoriests;
    dashBoard.NumberOfTotalRadiologists=numRadiologists;
    dashBoard.NumberOfTotalAccountants=numAccountants;
    dashBoard.NumberOfTotalNurses=numNurses; 
    ///////////////////////////////////////////////////////////////// Take  number of doctor in every Specialization 
    let Doctors=await Doctor.aggregate([{$group:{_id:"$Specialization",count: { $sum: 1 }}}])
    dashBoard.Specialization=Doctors; 
    ///////////////////////////////////////////////////////////////// Take  number of patient in every Specialization in doctor
        await appointment.find().populate("Doctor","Specialization -_id").then((data)=>{
    for(let i=0;i<Doctors.length;i++){
        let countPatient=0
        
        for(let j=0;j<data.length;j++){
            if(data[j].Doctor.Specialization==Doctors[i]._id){
                countPatient++;
            }
        }
        patient.push({Specialization:Doctors[i]._id,countOfPatient:countPatient})
        dashBoard.PatientInSpecialization=patient
    }
        });
    ///////////////////////////////////////////////////////////////// Bills
    let billsPay=await Order.find({checkOut:true}).countDocuments();  
    dashBoard.BillsPaid=billsPay;
    let billsNotPay=await Order.find({checkOut:false}).countDocuments();  
    dashBoard.BillsNotPaid=billsNotPay;
    let Totalbills=await Order.find().countDocuments();  
    dashBoard.TotalNumberBills=Totalbills;
    let TotalCount=await Order.aggregate([{$group:{_id:null,count: { $sum: "$finalPrice" }}}])
    dashBoard.TotalSumOfBills=TotalCount; 
    res.json({message:'success',status:200,dashBoard}) ;
})