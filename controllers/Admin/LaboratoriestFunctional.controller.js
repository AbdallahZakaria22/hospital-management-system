import { hash as _hash } from 'bcrypt';
import { sendMail as _sendMail } from '../../emails/HMS.email.js';
import { userModel } from '../../models/user.model.js';
import { catchAsncError } from '../../util/catchAsncError.js';
import { AppError } from '../../util/AppError.js';
import { Laboratory } from '../../models/CenterLab&radio/lab/Laboratory.models.js';
import { Laboratoriest } from '../../models/CenterLab&radio/lab/Laboratoriest.models.js';
import { Timing } from '../../models/Timing/Timing.models.js';
import { Payment } from '../../models/Payment/Payment.models.js';
export const addLaboratoriest=catchAsncError(async(req,res,next)=>{
  const {name,email,password,Mobile,Gender,DOB,Address,nameLaboratory,Days,Time,salary,role}=req.body;
  let Email=await userModel.findOne({email:email});
  if(!Email){
    let idTime,idSalary,idUser;
    _hash(password, Number(process.env.ROUND), async function(err, hash){
      await userModel.insertMany({name , email ,password:hash , Mobile,Gender,DOB,Address,role}).then((data)=>{
        idUser=data[0]._id;
      });
      await Timing.insertMany({Days,Time}).then((data)=>{
        idTime=data[0]._id;
      })
      await Payment.insertMany({Salary:salary}).then((data)=>{
        idSalary=data[0]._id;
      });
      let {id}=await Laboratory.findOne({name:nameLaboratory});
      await Laboratoriest.insertMany({userId:idUser,Laboratory:id,Salary:idSalary,Times:idTime})
      _sendMail(email,role,password); 
      res.json({message:'success',status:200})
    }) 
  }
  else{
    next(new AppError('Email Already in Use',422))
  }
  
})
////////////////////////////////////////
export const findAllLaboratoriest=catchAsncError( async(req,res,next)=> {
  const currentPage = req.query.currentPage || 1;
  const perPage = 10;
  let totalLaboratoriest;
  let Laboratoriests=  await Laboratoriest.find().countDocuments()
  .then(count => {
    totalLaboratoriest = count;
    return Laboratoriest.find({},{__v:0,createdAt:0,updatedAt:0,Salary:0}).populate('userId','name email _id').populate('Times','-user -__v -createdAt -updatedAt')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  });
  res.json({message:'success',Laboratoriest:Laboratoriests,status:200,totalLaboratoriest: totalLaboratoriest})
    })
// ///////////////////////////////////////
export const  findOneLaboratoriest=catchAsncError( async(req,res,next)=>{
  let id=req.query.LaboratoriestID;
  let Laboratoriests=await Laboratoriest.findById(id,{__v:0}).populate('userId',' -confirmEmail -role -password -__v').populate('Times','-user -__v -createdAt -updatedAt -_id').populate(
    'Salary','-user -__v -createdAt -updatedAt -_id'
  )
  if(Laboratoriests!=null){
    res.json({message:'success',Laboratoriest:Laboratoriests,status:200});
  }else{
    next(new AppError('Laboratoriest Not Found',422))
  }
})
// //////////////////////////////////////
export const UpdateLaboratoriest= catchAsncError(async(req,res,next)=>{
  const id=req.query.LaboratoriestID;
  const {name,Mobile,Address,Days,Time,salary}=req.body;
  // this new for find after update without new return before update
  const findLaboratoriest=await Laboratoriest.findById(id);
  if(findLaboratoriest){
    await Timing.updateMany({_id:findLaboratoriest.Times},{Days,Time})
  await Payment.updateOne({_id:findLaboratoriest.Salary},{Salary:salary})
    await userModel.findByIdAndUpdate(findLaboratoriest.userId,{name,Mobile,Address,Days,Time,salary},{new:true})
    let Laboratoriests= await Laboratoriest.findByIdAndUpdate(id,{userId:findLaboratoriest.userId} ,{new:true}).populate('userId','-_id -confirmEmail -role -password -__v').populate('Times','-user -__v -createdAt -updatedAt -_id').populate(
      'Salary','-user -__v -createdAt -updatedAt -_id'
    )
    res.json({message:'success',Laboratoriest:Laboratoriests,status:200});
  }
  else{
    next(new AppError('Laboratoriest is Not Found',422))
  }
  })
// /////////////////////////////////////////////// 
export const DeleteLaboratoriest= catchAsncError(async(req,res,next)=>{
  const id=req.query.LaboratoriestID;
  const currentPage=req.query.currentPage;
  let LaboratoriestOne=await Laboratoriest.findById(id).populate('userId',' -confirmEmail -role -password -__v');
  if(LaboratoriestOne){
    await Laboratoriest.deleteOne({_id:id},{new:true}).populate('userId');
    const perPage = 10;
  let totalLaboratoriests;
  let deleteLaboratoriests=  await Laboratoriest.find().countDocuments()
  .then(count => {
    totalLaboratoriests = count;
    return Laboratoriest.find({},{__v:0,createdAt:0,updatedAt:0 ,Salary:0}).populate('userId','name email -_id').populate('Times','-user -__v -createdAt -updatedAt -_id')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  });
  let deleteUser=await userModel.deleteOne({_id:LaboratoriestOne.userId},{new:true});
  let deleteTiming=await Timing.deleteOne({_id:LaboratoriestOne.Times},{new:true});
  let deleteSalary=await Payment.deleteOne({_id:LaboratoriestOne.Salary},{new:true});
  
  if(deleteLaboratoriests&&deleteUser&&deleteTiming&&deleteSalary){
      res.json({message:'success',Laboratoriest:deleteLaboratoriests,status:200,TotalLaboratoriests: totalLaboratoriests}) ;
    }
    
  }else{
    next(new AppError('Laboratoriest is Not Found',422))
  }
})