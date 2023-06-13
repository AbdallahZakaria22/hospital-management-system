import { hash as _hash } from 'bcrypt';
import { sendMail as _sendMail } from '../../emails/HMS.email.js';
import { userModel } from '../../models/user.model.js';
import { catchAsncError } from '../../util/catchAsncError.js';
import { AppError } from '../../util/AppError.js';
import { X_RAY } from '../../models/CenterLab&radio/X-ray/X_RAY.models.js';
import { Timing } from './../../models/Timing/Timing.models.js';
import { Payment } from './../../models/Payment/Payment.models.js';
import { radiologist } from './../../models/CenterLab&radio/X-ray/radiologist.models.js';

export const addRadiologist=catchAsncError(async(req,res,next)=>{
  const {name,email,password,Mobile,Gender,DOB,Address,nameX_RayCenter,Days,Time,salary,role}=req.body;
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
      let {id}=await X_RAY.findOne({name:nameX_RayCenter});
      await radiologist.insertMany({userId:idUser,X_RayCenter:id,Salary:idSalary,Times:idTime})
      _sendMail(email,role,password); 
      res.json({message:'success',status:200})
    }) 
  }
  else{
    next(new AppError('Email Already in Use',422))
  }
})
////////////////////////////////////////
export const findAllRadiologist=catchAsncError( async(req,res,next)=> {
  const {currentPage} = req.query || 1;
  const perPage = 10;
  let totalradiologists;
  let radiologists=  await radiologist.find().countDocuments()
  .then(count => {
    totalradiologists = count;
    return radiologist.find({},{__v:0,createdAt:0,updatedAt:0,Salary:0}).populate('userId','name email _id').populate('Times','-user -__v -createdAt -updatedAt')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  });
  res.json({message:'success',radiologists:radiologists,status:200,totalradiologists: totalradiologists})
    })
// ///////////////////////////////////////
export const  findOneRadiologist=catchAsncError( async(req,res,next)=>{
  let id=req.query.RadiologistID;
  let radiologists=await radiologist.findById(id,{__v:0}).populate('userId',' -confirmEmail -role -password -__v').populate('Times','-user -__v -createdAt -updatedAt -_id').populate(
    'Salary','-user -__v -createdAt -updatedAt -_id'
  )
  if(radiologists!=null){
    res.json({message:'success',radiologist:radiologists,status:200});
  }else{
    next(new AppError('radiologist Not Found',422))
  }

})
// //////////////////////////////////////
export const UpdateRadiologist= catchAsncError(async(req,res,next)=>{
  const id=req.query.RadiologistID;
  const {name,Mobile,Address,Days,Time,salary}=req.body;
  // this new for find after update without new return before update
  const findRadiologist=await radiologist.findById(id);
  if(findRadiologist){
    await Timing.updateMany({_id:findRadiologist.Times},{Days,Time})
    await Payment.updateOne({_id:findRadiologist.Salary},{Salary:salary})
    await userModel.findByIdAndUpdate(findRadiologist.userId,{name,Mobile,Address},{new:true})
    let Radiologists= await radiologist.findById(id ,{new:true}).populate('userId','-_id -confirmEmail -role -password -__v').populate('Times','-user -__v -createdAt -updatedAt -_id').populate(
      'Salary','-user -__v -createdAt -updatedAt -_id'
    )

    res.json({message:'success',Radiologist:Radiologists,status:200});
  }
  else{
    next(new AppError('Radiologist is Not Found',422))
  }
  })
// /////////////////////////////////////////////// 
export const DeleteRadiologist= catchAsncError(async(req,res,next)=>{
  let id=req.query.RadiologistID;
  const currentPage=req.query.currentPage;
  let radiologistOne=await radiologist.findById(id).populate('userId',' -confirmEmail -role -password -__v');
  if(radiologistOne){
    await radiologist.deleteOne({_id:id},{new:true}).populate('userId');
    const perPage = 10;
  let totalradiologists;
  let deleteradiologists=  await radiologist.find().countDocuments()
  .then(count => {
    totalradiologists = count;
    return radiologist.find({},{__v:0,createdAt:0,updatedAt:0 ,Salary:0}).populate('userId','name email -_id').populate('Times','-user -__v -createdAt -updatedAt -_id')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  });
  let deleteUser=await userModel.deleteOne({_id:radiologistOne.userId},{new:true});
  let deleteTiming=await Timing.deleteOne({_id:radiologistOne.Times},{new:true});
  let deleteSalary=await Payment.deleteOne({_id:radiologistOne.Salary},{new:true});
  
  if(deleteradiologists&&deleteUser&&deleteTiming&&deleteSalary){
      res.json({message:'success',radiologist:deleteradiologists,status:200,Totalradiologists: totalradiologists}) ;
    }
    
  }else{
    next(new AppError('radiologist is Not Found',422))
  }
})