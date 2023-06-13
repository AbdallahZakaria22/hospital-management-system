import Stripe from "stripe";
import { Doctor } from "../../models/Doctors/Doctors.models.js";
import { bookingTime } from "../../models/Doctors/bookingTime.models.js";
import { prescription } from "../../models/Doctors/prescription.models.js";
import { Patient } from "../../models/Patient/Patient.models.js";
import { appointment } from "../../models/Patient/appointment.models.js";
import { Disease } from "../../models/Patient/disease.models.js";
import { medicalHistory } from "../../models/Patient/medicalHistory.models.js";
import { Order } from "../../models/Patient/order.models.js";
import { Medicine } from "../../models/Pharmancy/medicine.models.js";
import { Room } from "../../models/rooms/room.model.js";
import { userModel } from "../../models/user.model.js";
import { AppError } from "../../util/AppError.js";
import payment from "../../util/Payment.js";
import { catchAsncError } from "../../util/catchAsncError.js";
import { bookRoom } from './../../models/rooms/bookRoom.models.js';
import { LabReport } from "../../models/CenterLab&radio/lab/LabReport.models.js";
import { X_RayReport } from "../../models/CenterLab&radio/X-ray/X_RayReport.models.js";
import { reportForPatient } from "../../models/Nurse/reportForPatient.models.js";

export const searchDoctor=catchAsncError( async(req,res,next)=> {
     await  Doctor.find({confirmTiming:"true"},{__v:0,createdAt:0,updatedAt:0,Salary:0}).populate('userId','name email Gender').populate({path:'Times'  }).then((response=>{
      res.json({message:'success',Doctors:response,status:200});
  }))

    })
  ////////////////////////////////////////////////////////////////////////
  export const ViewDoctors=catchAsncError( async(req,res,next)=> {
  let currentPage = req.query.currentPage || 1;
  let perPage = 10;
  let totalDoctors=0;
  let Doctors=  await await Doctor.find({confirmTiming:"true"}).countDocuments()
  .then(count => {
    totalDoctors = count;
    return Doctor.find({confirmTiming:"true"},{__v:0,createdAt:0,updatedAt:0,Salary:0}).populate('userId','name email Gender _id').populate({ path: 'Times', select: 'Days Time ' })
    .skip((currentPage - 1) * perPage)  
    .limit(perPage)
    .then((response)=>{
              res.json({message:'success',Doctors:response,totalDoctors: totalDoctors,status:200});
      });
  });
      })
//////////////////////////////////////////////////////////////////////////////////////
export const BookDoctor=catchAsncError( async(req,res,next)=> {
    let {doctorID,userID}=req.query;
    let {date}=req.body;
    let DateAPI=date.day+" "+date.selDate
  let findDoctor=await Doctor.findById(doctorID);
  if(!findDoctor){
    return next(new AppError('Doctor is Not Found',422))
  }
  let patient =await Patient.findOne({user:userID});
  await appointment.findOne({Patient:patient._id,Doctor:doctorID,Date:DateAPI}).then(async(appointmentData)=>{
    if(appointmentData){
      return next(new AppError('you Book doctor',422))
    }
    else{
      let num=await appointment.find({Doctor:doctorID,Date:DateAPI}).count();
      let limit=await bookingTime.findOne({doctor:doctorID});
      if(num===limit.limitRange){
        next(new AppError('Limit Range Completed Please Book another Time',422))
      }
      else{  
        
        await appointment.insertMany({Patient:patient._id,Doctor:doctorID,Date:DateAPI});
        await Order.findOne({user:userID,checkOut:false}).then(async(data)=>{
          let arrayOfproduct=[];
          let finalprice=0;
          if(!data){
            arrayOfproduct.push({name:'BookDoctor'+findDoctor.Specialization,
            Price:50
          })
            await Order.insertMany({user:userID,products:arrayOfproduct,finalPrice:50})
          }
          else{
            arrayOfproduct=data.products;
            arrayOfproduct.push({name:'BookDoctor'+findDoctor.Specialization,
            Price:50})
            finalprice=data.finalPrice+50;
            await Order.updateOne({user:userID,checkOut:false},{products:arrayOfproduct,finalPrice:finalprice})
          }
          
        })
        res.json({message:'success',status:200});
      }
    }
  })
  
}) 
///////////////////////////////////////////////////////
export const cancelBookDoctor=catchAsncError(async(req,res,next)=>{  
  let {idAppointment}=req.query;
  await appointment.findOneAndDelete(({_id:idAppointment})).then(async(data)=>{
    if(data){
      let findDoctor=await Doctor.findById(data.Doctor);
      await Order.findOne({user:req.userid,checkOut:false}).then(async(result)=>{
        let finalprice=result.finalPrice-50;
        let arrayOfproduct=result.products;
        for(let i=0;i<arrayOfproduct.length;i++){
          if(arrayOfproduct[i].name==='BookDoctor'+findDoctor.Specialization){
            arrayOfproduct.splice(i,1)
          }
        }
      await Order.updateOne({user:req.userid,checkOut:false},{products:arrayOfproduct,finalPrice:finalprice}) 
      })
        
      res.json({message:'success',status:200})
    }
    else{
      res.json({message:'appointment is canceled',status:200})
    }

  })
})
export const ViewAppointment=catchAsncError( async(req,res,next)=> {
  let userID=req.query.userID;
  let doctor=[];
  let patient =await Patient.findOne({user:userID});
  if(!patient){
    return next(new AppError('Patient is Not Found',422))
  }
  let time=await appointment.find({Patient:patient._id},{__v:0,createdAt:0,updatedAt:0,Patient:0}).then(async(data)=>{
    for(let i=0;i<data.length;i++){
      let result=await Doctor.findById(data[i].Doctor,{Experience:0,Language:0,Times:0,Salary:0,__v:0,createdAt:0,updatedAt:0}).populate('userId','name Specialization -_id');
      let findPrescription=await prescription.findOne({Patient:patient._id,datePatient:data[i].Date});
      if(result){
        if(findPrescription){
          doctor.push({user:result,Time:data[i],findPrescription:true});
        }else{
          doctor.push({user:result,Time:data[i],findPrescription:false});
        }
        
      }
    }
  })
  res.json({message:'success',Doctor:doctor,status:200})
  }) 
    /////////////////////////////////////////////////////////////////////////
export const timeDetails =catchAsncError(async(req,res,next)=>{
  let doctorID=req.query.doctorID;
  await Doctor.findById(doctorID).populate('Times').then((data)=>{
    if(data.confirmTiming=="true"){
      res.json({message:'success',Data:data.Times,status:200})
    }else{
      return next(new AppError('No Time',422))
    }
  })
})
////////////////////////////////////////////////////////////////////////////
export const viewMedicalHistory =catchAsncError(async(req,res,next)=>{
  let userID=req.query.userID;
  let patient =await Patient.findOne({user:userID});
    if(!patient){
      return next(new AppError('Patient Not Add Medical History',422))
    }
    await medicalHistory.findOne({Patient:patient._id},{_id:0,Patient:0,__v:0,createdAt:0,updatedAt:0}).then(async(data)=>{
      res.json({message:'success',data,status:200})
    })
})

///////////////////////////////////////////////////
export const viewPrescription=catchAsncError(async(req,res,next)=>{
  let userID=req.query.userID;
  let arrayOfPrescription=[];
  let patient=await Patient.findOne({user:userID});
  await prescription.find({Patient:patient._id}).then(async(data)=>{
      if(!data){
          return next(new AppError('prescriptions is Not Found',422))
      }
      for(let i=0;i<data.length;i++){
        let doc=await Doctor.findById(data[i].doctor);
        await userModel.findOne({_id:doc.userId},{name:1,_id:0}).then((result)=>{
          arrayOfPrescription.push(result)
        })
      }
      res.json({message:'success',data,DoctorName:arrayOfPrescription,status:200})
  });
})
/////////////////////////////////////////////////////////
export const viewRoom=catchAsncError(async(req,res,next)=>{
  await Room.find({status:"false"}).then((data)=>{
    if(data.length){
      res.json({message:'success',data,status:200})
    }
    else{
      next(new AppError('No Available Room',422))
    }
  })
})
export const BookRoom=catchAsncError(async(req,res,next)=>{
  let {userID,roomID}=req.query;
  let patient=await Patient.findOne({user:userID});
  if(!patient){
    return next(new AppError('Patient Not Found',422))
  }
  bookRoom.findOne({Patient:patient._id}).then(async(data)=>{
      if(data){
        return next(new AppError('Patient have room',406))
      }else{
        await bookRoom.insertMany({Patient:patient._id,Room:roomID}).then(async()=>{
          await Room.findByIdAndUpdate(roomID,{status:"true"}).then(async(data)=>{
            await Order.findOne({user:userID,checkOut:false}).then(async(result)=>{
              let arrayOfproduct=[];
              let finalprice=0;
              if(!result){
                arrayOfproduct.push({name:'Book Room',
                Price:Number(data.price)
              })
                await Order.insertMany({user:userID,products:arrayOfproduct,finalPrice:Number(data.price)})
              }
              else{
                arrayOfproduct=result.products;
                arrayOfproduct.push({name:'Book Room',
                Price:data.price})
                finalprice=result.finalPrice+Number(data.price);
                await Order.updateOne({user:userID,checkOut:false},{products:arrayOfproduct,finalPrice:finalprice})
              }
              
            })
          });
          res.json({message:'success',status:200})
        })
      }
  });


})
export const cancelRoom=catchAsncError(async(req,res,next)=>{
  let {userID,roomID}=req.query;
  let patient=await Patient.findOne({user:userID});
  if(!patient){
    return next(new AppError('Patient Not Found',422))
  }
  await bookRoom.findOne({Room:roomID}).then(async(dataRoom)=>{
    if(!dataRoom){
      return next(new AppError('You cancel room',422))
    }
    else{
      await bookRoom.deleteOne({Patient:patient._id,Room:roomID})
      
      await Room.findByIdAndUpdate(dataRoom.Room,{status:"false"}).then(async(data)=>{
        await Order.findOne({user:userID,checkOut:false}).then(async(result)=>{
          let finalprice=Math.abs(result.finalPrice-Number(data.price));
          let arrayOfproduct=result.products;
          for(let i=0;i<arrayOfproduct.length;i++){
            if(arrayOfproduct[i].name==='Book Room'){
              arrayOfproduct.splice(i,1)
            }
          }
        await Order.updateOne({user:userID,checkOut:false},{products:arrayOfproduct,finalPrice:finalprice}) 
      });
      res.json({message:'success',status:200})
    })
    }
  })
  
})
///////////////////////////////////////////////////////////////
export const viewBookRoom=catchAsncError(async(req,res,next)=>{
  let userID=req.query.userID;
  await Patient.findOne({user:userID}).then(async(data)=>{
    if(!data){
      return next(new AppError('Patient Not Found',422))
    }
    await bookRoom.findOne({Patient:data._id}).populate('Room').then((result)=>{
      res.json({message:'success',Room:result,status:200})
    })
  })
  
})
//////////////////////////////////////////////////////////////
export const patientInformation=catchAsncError(async(req,res,next)=>{
  let userID=req.query.userID;
  await userModel.findById(userID,{name:1 , Gender:1 , _id:0 , Mobile:1, DOB:1}).then((data)=>{
    let birthdate = new Date(data.DOB);
      let today=new Date();
          let age = today.getFullYear() - birthdate.getFullYear() - 
          (today.getMonth() < birthdate.getMonth() || 
          (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate()));
    data.DOB=age;
    res.json({message:'success',info:data,status:200})
  })
})
/////////////////////////////////////////////////////////////////
export const viewDisease=catchAsncError(async(req,res,next)=>{
  let userID=req.query.userID;
  await Patient.findOne({user:userID}).then(async(data)=>{
    if(!data){
      return next(new AppError('Patient Not Found',422))
    }
    await Disease.findOne({Patient:data._id}).then((result)=>{
      if(!result||!result.Disease.length){
        return next(new AppError('No Disease for this patient',406))
      }
      res.json({message:'success',Disease:result.Disease,status:200})
    })
  })
})
//////////////////////////////////////////////////////////////////////
export const createOrder=catchAsncError(async(req,res,next)=>{
  let stripe = new Stripe(process.env.STRIP_KEY);
  let order=await Order.findOne({user:req.userid,checkOut:false});
  if(!order){
    return next(new AppError('you Not have oder yet',406))
  }
  let session =await payment({
    stripe,
    customer_email:req.userEmail,
    metadata:{
      orderId:order._id.toString()
    },
    line_items:order.products.map(product=>{
      return {
        price_data:{
          currency:'EGP',
          product_data:{
            name:product.name
          },
          unit_amount:product.Price*100
        },
        quantity:product.quantity
      }
    })
  })
  res.json({message:'success',order,session,URL:session.url,status:200})
});
////////////////////////////////////////////////////////////////////////////
export const viewLabReport=catchAsncError(async(req,res,next)=>{
  await Patient.findOne({user:req.userid}).then(async(data)=>{
    await LabReport.find({Patient:data._id},{Patient:0,__v:0}).populate('createdBy','name Gender email')
    .populate('prescription','doctor').then(async(result)=>{
      for(let i=0;i<result.length;i++){
        await Doctor.findById(result[i].prescription.doctor,{Specialization:1,userId:1}).populate('userId','name email Gender DOB').then((doctorData)=>{
            result[i].prescription.doctor=doctorData
        })
      }
      
      res.json({message:'success',LabReport:result,status:200})
    })
  })
})
////////////////////////////////////////////////////////////////////////////
export const viewX_RayReport=catchAsncError(async(req,res,next)=>{
  await Patient.findOne({user:req.userid}).then(async(data)=>{
    await X_RayReport.find({Patient:data._id},{Patient:0,__v:0}).populate('createdBy','name Gender email')
    .populate('prescription','doctor').then(async(result)=>{
      for(let i=0;i<result.length;i++){
        await Doctor.findById(result[i].prescription.doctor,{Specialization:1,userId:1}).populate('userId','name email Gender DOB').then((doctorData)=>{
            result[i].prescription.doctor=doctorData
        })
      }
    res.json({message:'success',X_RayReport:result,status:200})
  })
})
});
/////////////////////////////////////////////////////////////////////////
export const payPatientBill=catchAsncError(async(req,res,next)=>{
  let stripe = new Stripe(process.env.STRIP_KEY);
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.ENDPOINTSECRET);
  } catch (err) {
    res.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  let orderId=event.data.object.metadata.orderId
  if (event.type =='checkout.session.completed') {
    let order=await Order.findByIdAndUpdate(orderId,{checkOut:true,paymentType:"card"});
    let patientData=await Patient.findOne({user:order.user});
    let BookRoomData=await bookRoom.findOneAndDelete({Patient:patientData._id});
    let roomData=await Room.findByIdAndUpdate(BookRoomData.Room,{status:"false"});
    res.json({message:'success',roomData,status:200});
  }
  else{
    res.json({message:'Rejected',status:400})
  }
})
//////////////////////////////////////////////////////////////////////////
export const viewReport=catchAsncError(async(req,res,next)=>{
  await Patient.findOne({user:req.userid}).populate('user','name Gender DOB').then(async(data)=>{
    if(!data){
        return next(new AppError('Patient is Not Found',426))
    }
    await reportForPatient.findOne({Patient:data._id},{__v:0,Patient:0}).populate('Nurse','name Gender ').then(async(result)=>{
        if(!result){
            return next(new AppError('You can Add report For this Patient',426))
        }
            res.json({message:'success',result,status:200}) ;
    })
    
})
})