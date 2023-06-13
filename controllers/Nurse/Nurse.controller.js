import { reportForPatient } from "../../models/Nurse/reportForPatient.models.js";
import { Patient } from "../../models/Patient/Patient.models.js";
import { bookRoom } from "../../models/rooms/bookRoom.models.js";
import { userModel } from "../../models/user.model.js";
import { AppError } from "../../util/AppError.js";
import { catchAsncError } from "../../util/catchAsncError.js";
import { prescription } from './../../models/Doctors/prescription.models.js';

export const viewPatients=catchAsncError(async(req,res,next)=>{
    let arrayOfPatient=[];
    await bookRoom.find({},{Room:0,__v:0,createdAt:0,updatedAt:0}).populate('Patient').then(async(response)=>{
        for(let i=0;i<response.length;i++){
            await userModel.findById(response[i].Patient.user).then(async(data)=>{
                let birthdate = new Date(data.DOB);
                let today=new Date();
                    let age = today.getFullYear() - birthdate.getFullYear() - 
                    (today.getMonth() < birthdate.getMonth() || 
                    (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate()));
                    await reportForPatient.findOne({Patient:response[i].Patient._id}).then((reportData)=>{
                        if(reportData){
                            arrayOfPatient.push({id:response[i].Patient._id,name:data.name,
                                email:data.email,
                            Gender:data.Gender,
                        Age:age,
                    HasReport:true})
                        }
                        else{
                            arrayOfPatient.push({id:response[i].Patient._id,name:data.name,
                                email:data.email,
                            Gender:data.Gender,
                        Age:age,
                    HasReport:false})
                        }
                    })
                
            })
            
        } 

    })

    res.json({message:'success',Patient:arrayOfPatient,status:200}) ;
});
//////////////////////////////////////////////////////////////////
export const addReportForPatient=catchAsncError(async(req,res,next)=>{
    let patientID=req.query.patientID;
    let {bodyTemperature,pulseRate,respirationRate,bloodPressure}=req.body;
    await Patient.findById(patientID).then(async(data)=>{
        if(!data){
            return next(new AppError('Patient is Not Found',426))
        }
        await reportForPatient.findOne({Patient:data._id}).then(async(result)=>{
            if(result){
                return next(new AppError('You Add report For this Patient you can update',426))
            }
            await reportForPatient.insertMany({Nurse:req.userid,Patient:data._id,bodyTemperature,pulseRate,respirationRate,bloodPressure}).then(()=>{
                res.json({message:'success',status:200}) ;
            })
        })
        
    })
});
///////////////////////////////////////////////////////////////
export const updateReportForPatient=catchAsncError(async(req,res,next)=>{
    let patientID=req.query.patientID;
    let {bodyTemperature,pulseRate,respirationRate,bloodPressure}=req.body;
    await Patient.findById(patientID).then(async(data)=>{
        if(!data){
            return next(new AppError('Patient is Not Found',426))
        }
        await reportForPatient.findOne({Patient:data._id}).then(async(result)=>{
            if(!result){
                return next(new AppError('You can Add report For this Patient',426))
            }
            await reportForPatient.updateMany({Patient:data._id},{Nurse:req.userid,bodyTemperature,pulseRate,respirationRate,bloodPressure}).then(()=>{
                res.json({message:'success',status:200}) ;
            })
        })
        
    })
});
///////////////////////////////////////////////////////////////
export const viewReportForPatient=catchAsncError(async(req,res,next)=>{
    let patientID=req.query.patientID;
    await Patient.findById(patientID).populate('user','name Gender DOB').then(async(data)=>{
        if(!data){
            return next(new AppError('Patient is Not Found',426))
        }
        let birthdate = new Date(data.user.DOB);
                let today=new Date();
                    let age = today.getFullYear() - birthdate.getFullYear() - 
                    (today.getMonth() < birthdate.getMonth() || 
                    (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate()));
                data.user.DOB=age;
        await reportForPatient.findOne({Patient:data._id},{__v:0,Patient:0}).populate('Nurse','name Gender ').then(async(result)=>{
            if(!result){
                return next(new AppError('You can Add report For this Patient',426))
            }
                res.json({message:'success',result,user:data.user,status:200}) ;
        })
        
    })
});
///////////////////////////////////////////////////////////////
export const viewMedication=catchAsncError(async(req,res,next)=>{
    let patientID=req.query.patientID;
    let medication=[];
    await prescription.find({Patient:patientID}).populate('Patient').populate('doctor').then(async(data)=>{
        if(!data){
            return next(new AppError('this patient Not have prescription',426))
        }
        for(let i=0;i<data.length;i++){
            let user=await userModel.findById(data[i].Patient.user,{name:1});
            let doctorc=await userModel.findById(data[i].doctor.userId,{name:1})
            data[i].Patient=user
            data[i].doctor=doctorc
            medication.push(data[i])
        }
        res.json({message:'success',medication,status:200}) ;
    })
})
