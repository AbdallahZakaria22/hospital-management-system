import { hash as _hash } from 'bcrypt';
import { catchAsncError } from '../../util/catchAsncError.js';
import { AppError } from '../../util/AppError.js';
import { Pharmacy } from '../../models/Pharmancy/Pharmacy.models.js';
import { Medicine } from './../../models/Pharmancy/medicine.models.js';
import { prescription } from './../../models/Doctors/prescription.models.js';
import { Patient } from './../../models/Patient/Patient.models.js';
import { PatientBuyMedicine } from '../../models/Pharmancy/PatientBuyMedicine.models.js';
import { Doctor } from './../../models/Doctors/Doctors.models.js';
import { userModel } from '../../models/user.model.js';
import { Order } from '../../models/Patient/order.models.js';
export const addMedicine=catchAsncError(async(req,res,next)=>{
    const {Medicine_name,Medicine_quantity,Medicine_price}=req.body;
    let Medicines=await Medicine.findOne({Medicine_name:Medicine_name});
    if(!Medicines){

        await Medicine.insertMany({Medicine_name,Medicine_quantity,Medicine_price,});
        res.json({message:'success',status:200})
    }
    else{
        next(new AppError('Medicine is alreay Found You Can Update',422))
    }
})
////////////////////////////////////////
export const findAll=catchAsncError( async(req,res,next)=> {
  const {currentPage} = req.query || 1;
  const perPage = 10;
  let totalItems;
  let Medicines=  await Medicine.find().countDocuments()
  .then(count => {
    totalItems = count;
    return Medicine.find({},{__v:0,createdAt:0,updatedAt:0})
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  });
  res.json({message:'success',Medicines:Medicines,status:200,totalItems: totalItems})
    })
// //////////////////////////////////////
export const UpdateMedicine= catchAsncError(async(req,res,next)=>{
  const id=req.query.MedicineID; 
  const {Medicine_name,Medicine_quantityMedicine_price}=req.body;
  // this new for find after update without new return before update
  const findMedicine=await Medicine.findById(id);
  if(findMedicine){
    let Medicines= await Medicine.findByIdAndUpdate(id,{Medicine_name,Medicine_quantityMedicine_price} ,{new:true})
    res.json({message:'success',Medicine:Medicines,status:200});
  }
  else{
    next(new AppError('Medicine is Not Found',422))
  }
  })
// /////////////////////////////////////////////// 
export const DeleteMedicine= catchAsncError(async(req,res,next)=>{
  let currentPage=req.query.currentPage;
    let id=req.query.MedicineID;
  const MedicineOne=await Medicine.findById(id);
  if(MedicineOne){
    let deleteMedicine=await Medicine.deleteOne({_id:id},{new:true});
    const perPage = 10;
  let totalItems;
  let Medicines=  await Medicine.find().countDocuments()
  .then(count => {
    totalItems = count;
    return Medicine.find({},{__v:0,Medicine_quantity:0,exp_date:0,createdAt:0,updatedAt:0}).populate('Pharmacy','-_id')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  });
    if(deleteMedicine){
      res.json({message:'success',Medicines:Medicines,status:200,totalItems: totalItems}) ;
    }
    
  }
  
  else{
    next(new AppError('Medicine is Not Found',422))
  }
})
////////////////////////////////////////////////////////////////////
export const searchMedicine=catchAsncError(async(req,res,next)=>{
  await Medicine.find({},{__v:0,createdAt:0,updatedAt:0}).then((data)=>{
    res.json({message:'success',Medicines:data,status:200}) ;
  })
});
/////////////////////////////////////////////////////////////////
export const viewPatient=catchAsncError(async(req,res,next)=>{
  let arrayOfPatient=[];
  await prescription.find().populate('doctor','userId Specialization').then(async(data)=>{
    for(let i=0;i<data.length;i++){
      if(data[i].Medication.length>0){
        await PatientBuyMedicine.findOne({Prescription:data[i]._id}).then(async(result)=>{
          if(!result){
            let doctor=await userModel.findById(data[i].doctor.userId)
            await Patient.findById(data[i].Patient).populate('user','-password -role -Address -confirmEmail -__v -forgetCode').then(async(result)=>{
              await Order.findOne({user:result.user._id,checkOut:false}).then((orderData)=>{
                if(orderData){
              arrayOfPatient.push({NameOfDoctor:doctor.name,SpecializationDoctor:data[i].doctor.Specialization,prescriptionId:data[i]._id,user:result.user,Medication:data[i].Medication,PatientId:data[i].Patient})
                }
              })
            })
          }
        })
      }
    }
  })
  res.json({message:'success',Patients:arrayOfPatient,status:200}) ;
});
////////////////////////////////////////////////////////////////////
export const buyMedicine=catchAsncError(async(req,res,next)=>{
  let patientId=req.query.patientId;
  let {nameMedicine,quantity}=req.body;
  let medicine=await Medicine.findOne({Medicine_name:nameMedicine});
  let user=await Patient.findById(patientId);
  await Order.findOne({user:user.user,checkOut:false}).then(async(result)=>{
    let arrayOfproduct=[];
    let finalprice=0;
    if(!result){
      arrayOfproduct.push({name:'Buy medicine '+nameMedicine,
      Price:medicine.Medicine_price,
      quantity:Number(quantity)
    })
      await Order.insertMany({user:user.user,products:arrayOfproduct,finalPrice:medicine.Medicine_price*Number(quantity)})
    }
    else{
      arrayOfproduct=result.products;
      arrayOfproduct.push({name:'Buy medicine '+nameMedicine,
      Price:medicine.Medicine_price,
      quantity:Number(quantity)
    })
      finalprice=result.finalPrice+medicine.Medicine_price*quantity;
      await Order.updateOne({user:user.user,checkOut:false},{products:arrayOfproduct,finalPrice:finalprice})
    }
    
  })
  await Medicine.updateOne({Medicine_name:nameMedicine},{$inc: { Medicine_quantity: -Number(quantity) }}).then(()=>{
    res.json({message:'success',status:200}) ;
  })
});
/////////////////////////////////////////////////////////////////////
export const finishBuy=catchAsncError(async(req,res,next)=>{
  let PrescriptionId=req.query.PrescriptionId;
  await PatientBuyMedicine.insertMany({user:req.userid,Prescription:PrescriptionId}).then(()=>{
    res.json({message:'success',status:200}) ;
  })
})