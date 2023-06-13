import { hash as _hash } from 'bcrypt';
import { sendMail as _sendMail } from '../../emails/HMS.email.js';
import { userModel } from '../../models/user.model.js';
import { catchAsncError } from '../../util/catchAsncError.js';
import { AppError } from '../../util/AppError.js';
import { Timing } from './../../models/Timing/Timing.models.js';
import { Payment } from './../../models/Payment/Payment.models.js';
import { Nurse } from '../../models/Nurse/Nurse.models.js';
export const addNurse=catchAsncError(async(req,res,next)=>{
  const {name,email,password,Mobile,Gender,DOB,Address,Days,Time,salary,role}=req.body;
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
      await Nurse.insertMany({userId:idUser,Salary:idSalary,Times:idTime})
      _sendMail(email,role,password); 
      res.json({message:'success',status:200})
    }) 
  }
  else{
    next(new AppError('Email Already in Use',422))
  }
  
})
////////////////////////////////////////
export const findAllNurse=catchAsncError( async(req,res,next)=> {
  const {currentPage} = req.query || 1;
  const perPage = 10;
  let totalNurses;
  let Nurses=  await Nurse.find().countDocuments()
  .then(count => {
    totalNurses = count;
    return Nurse.find({},{__v:0,createdAt:0,updatedAt:0,Salary:0}).populate('userId','name email _id').populate('Times','-user -__v -createdAt -updatedAt')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  });
  res.json({message:'success',Nurses:Nurses,status:200,totalNurses: totalNurses})
    })
// ///////////////////////////////////////
export const  findOneNurse=catchAsncError( async(req,res,next)=>{
  let id=req.query.NurseID;
  let Nurses=await Nurse.findById(id,{__v:0}).populate('userId',' -confirmEmail -role -password -__v').populate('Times','-user -__v -createdAt -updatedAt -_id').populate(
    'Salary','-user -__v -createdAt -updatedAt -_id'
  )
  if(Nurses!=null){
    res.json({message:'success',Nurse:Nurses,status:200});
  }else{
    next(new AppError('Nurse Not Found',422))
  }


})
// //////////////////////////////////////
export const UpdateNurse= catchAsncError(async(req,res,next)=>{
  const id=req.query.NurseID;
  const {name,Mobile,Address,Days,Time,salary}=req.body;
  // this new for find after update without new return before update
  const findNurse=await Nurse.findById(id);
  if(findNurse){
    await Timing.updateMany({_id:findNurse.Times},{Days,Time})
  await Payment.updateOne({_id:findNurse.Salary},{Salary:salary})
    await userModel.findByIdAndUpdate(findNurse.userId,{name,Mobile,Address},{new:true})
    let Nurses= await Nurse.findById(id).populate('userId','-_id -confirmEmail -role -password -__v').populate('Times','-user -__v -createdAt -updatedAt -_id').populate(
      'Salary','-user -__v -createdAt -updatedAt -_id'
    )
  
    res.json({message:'success',Nurse:Nurses,status:200});
  }
  else{
    next(new AppError('Nurse is Not Found',422))
  }
  })
// /////////////////////////////////////////////// 
export const DeleteNurse= catchAsncError(async(req,res,next)=>{
  let id=req.query.NurseID
  let currentPage=req.query.currentPage;
  let NurseOne=await Nurse.findById(id).populate('userId',' -confirmEmail -role -password -__v');
  if(NurseOne){
    await Nurse.deleteOne({_id:id},{new:true}).populate('userId');
    const perPage = 10;
  let totalNurses;
  let deleteNurses=  await Nurse.find().countDocuments()
  .then(count => {
    totalNurses = count;
    return Nurse.find({},{__v:0,createdAt:0,updatedAt:0 ,Salary:0}).populate('userId','name email -_id').populate('Times','-user -__v -createdAt -updatedAt -_id')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  });
  let deleteUser=await userModel.deleteOne({_id:NurseOne.userId},{new:true});
  let deleteTiming=await Timing.deleteOne({_id:NurseOne.Times},{new:true});
  let deleteSalary=await Payment.deleteOne({_id:NurseOne.Salary},{new:true});
  
  if(deleteNurses&&deleteUser&&deleteTiming&&deleteSalary){
      res.json({message:'success',Nurse:deleteNurses,status:200,TotalNurses: totalNurses}) ;
    }
    
  }else{
    next(new AppError('Nurse is Not Found',422))
  }
})