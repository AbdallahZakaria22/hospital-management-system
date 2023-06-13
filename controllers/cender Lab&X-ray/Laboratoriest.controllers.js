import { log } from "console";
import { LabReport } from "../../models/CenterLab&radio/lab/LabReport.models.js";
import { prescription } from "../../models/Doctors/prescription.models.js";
import { Patient } from "../../models/Patient/Patient.models.js";
import { userModel } from "../../models/user.model.js";
import { AppError } from "../../util/AppError.js";
import { catchAsncError } from "../../util/catchAsncError.js";
import fs from 'fs';
import { Order } from "../../models/Patient/order.models.js";
export const addLapReport=catchAsncError(async(req,res,next)=>{
    let patientID=req.query.patientID;
    let prescriptionID=req.query.prescriptionId;
    let {type, price}=req.body;
    if(!req.file){
        return next(new AppError('send report only'),406);
    }
    await Patient.findById(patientID).then(async(data)=>{
        if(!data){
            return next(new AppError('Patient Not Found',406))
        }
        else{
            await LabReport.insertMany({type , path:req.file.filename ,price ,Patient:patientID, createdBy:req.userid,prescription:prescriptionID},{new:true}).then(async(getData)=>{
                      await Order.findOne({user:data.user,checkOut:false}).then(async(result)=>{
                        let arrayOfproduct=[];
                        let finalprice=0;
                        if(!result){
                          arrayOfproduct.push({name:'Lab Report',
                          Price:Number(price)
                        })
                          await Order.insertMany({user:data.user,products:arrayOfproduct,finalPrice:Number(price)})
                        } 
                        else{
                          arrayOfproduct=result.products;
                          arrayOfproduct.push({name:'Lab Report',
                          Price:Number(price)})
                          finalprice=Number(result.finalPrice)+Number(price);
                          await Order.updateOne({user:data.user,checkOut:false},{products:arrayOfproduct,finalPrice:finalprice})
                        }
                        
                      })
                res.json({message:'Done'});
            }).catch((err)=>{
                return next(new AppError(err,406))
            })
            
        }
    })
})
//////////////////////////////////////////////////////////////////////
export const viewLabReport=catchAsncError(async(req,res,next)=>{
    let currentPage = req.query.currentPage || 1;
  const perPage = 10;
  let totalLapReport;
  let report=  await LabReport.find().countDocuments()
  .then(count => {
    totalLapReport = count;
    return LabReport.find({},{__v:0,createdAt:0,updatedAt:0,path:0,createdBy:0,Patient:0})
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  });
  res.json({message:'success',Reports:report,status:200,totalLapReport: totalLapReport})
})
///////////////////////////////////////////////////////////////////
export const viewReportDetails=catchAsncError(async(req,res,next)=>{
    let {reportID}=req.query;
    await LabReport.findById(reportID,{__v:0,createdAt:0,updatedAt:0}).populate('createdBy','name -_id').populate('Patient').then(async(data)=>{
        let patientID=data.Patient.user
        await userModel.findById(patientID,{name:1,email:1,Mobile:1,Gender:1,DOB:1,_id:1}).then(async(result)=>{
            data.Patient=result;
            await Order.findOne({user:result._id,checkOut:false}).then((orderData)=>{
              if(orderData){
                res.json({message:'success',Reports:data,checkOut:"false",status:200})
              }
              else{
                res.json({message:'success',Reports:data,checkOut:"true",status:200})
              }
            })   
        })        
        
        
    })
})
///////////////////////////////////////////////////////////////////
export const deleteReport=catchAsncError(async(req,res,next)=>{
    let reportID=req.query.reportID;
    let currentPage=req.query.currentPage;
    let reportOne=await LabReport.findById(reportID)
    if(reportOne){
        await Patient.findById({_id:reportOne.Patient}).then(async(data)=>{
            await Order.findOne({user:data.user,checkOut:false}).then(async(result)=>{
                let finalprice=result.finalPrice-reportOne.price;
                let arrayOfproduct=result.products;
                for(let i=0;i<arrayOfproduct.length;i++){
                  if(arrayOfproduct[i].name==='Lab Report'){
                    arrayOfproduct.splice(i,1)
                  }
                }
              await Order.updateOne({user:data.user,checkOut:false},{products:arrayOfproduct,finalPrice:finalprice}) 
            });
        }) 
      await LabReport.deleteOne({_id:reportID},{new:true})
      const perPage = 10;
    let totalLapReport;
    let report=  await LabReport.find().countDocuments()
  .then(count => {
    totalLapReport = count;
    return LabReport.find({},{__v:0,createdAt:0,updatedAt:0,path:0,createdBy:0,Patient:0})
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  });
    if(report){
        res.json({message:'success',Reports:report,status:200}) ;
      }
      
    }else{
      next(new AppError('Report is Not Found',422))
    }
})
///////////////////////////////////////////////////////////////////////
export const viewPatient=catchAsncError(async(req,res,next)=>{
  let arrayOfPatientHaveReport=[];
  await prescription.find().then(async(data)=>{
      for(let i=0;i<data.length;i++){
          if(data[i].Lab.length){
              await Patient.findById(data[i].Patient).populate('user',' name email Gender Mobile DOB').then(async(result)=>{
                await LabReport.findOne({Patient:data[i].Patient}).then(async(lapData)=>{
                  if(!lapData){
                    await Order.findOne({user:result.user._id,checkOut:false}).then((orderData)=>{
                      if(orderData){
                        let birthdate = new Date(result.user.DOB);
                        let today=new Date();
                            let age = today.getFullYear() - birthdate.getFullYear() - 
                            (today.getMonth() < birthdate.getMonth() || 
                            (today.getMonth() === birthdate.getMonth() && today.getDate() < birthdate.getDate()));
                            result.user.DOB=age;
                        arrayOfPatientHaveReport.push({result,Lab:data[i].Lab,prescriptionID:data[i]._id})
                      }
                    })
                  }
                })

              })
          }
      }
  })
  res.json({message:'success',Patient:arrayOfPatientHaveReport,status:200}) ;
})