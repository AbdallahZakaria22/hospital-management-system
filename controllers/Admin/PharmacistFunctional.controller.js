import { hash as _hash } from 'bcrypt';
import { sendMail as _sendMail } from '../../emails/HMS.email.js';
import { userModel } from '../../models/user.model.js';
import { catchAsncError } from '../../util/catchAsncError.js';
import { AppError } from '../../util/AppError.js';
import { pharmacist } from '../../models/Pharmancy/Pharmacist.models.js';
import { Pharmacy } from '../../models/Pharmancy/Pharmacy.models.js';
import { Timing } from '../../models/Timing/Timing.models.js';
import { Payment } from '../../models/Payment/Payment.models.js';
export const addPharmacist=catchAsncError(async(req,res,next)=>{
  const {name,email,password,Mobile,Gender,DOB,Address,namePharmacy,Days,Time,salary,role}=req.body;
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
      let {id}=await Pharmacy.findOne({name:namePharmacy});
      await pharmacist.insertMany({userId:idUser,PharmacyId:id,Salary:idSalary,Times:idTime})
      _sendMail(email,role,password); 
      res.json({message:'success',status:200})
    }) 
  }
  else{
    next(new AppError('Email Already in Use',422))
  }
  
})
////////////////////////////////////////
export const findAllPharmacist=catchAsncError( async(req,res,next)=> {
  const {currentPage} = req.query || 1;
  const perPage = 10;
  let totalpharmacists;
  let pharmacists=  await pharmacist.find().countDocuments()
  .then(count => {
    totalpharmacists = count;
    return pharmacist.find({},{__v:0,createdAt:0,updatedAt:0,Salary:0}).populate('userId','name email _id').populate('Times','-user -__v -createdAt -updatedAt')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  });
  res.json({message:'success',pharmacists:pharmacists,status:200,totalpharmacists: totalpharmacists})
    })
// ///////////////////////////////////////
export const  findOnePharmacist=catchAsncError( async(req,res,next)=>{
  let id=req.query.pharmacistID;
  let pharmacists=await pharmacist.findById(id,{__v:0}).populate('userId',' -confirmEmail -role -password -__v').populate('Times','-user -__v -createdAt -updatedAt -_id').populate(
    'Salary','-user -__v -createdAt -updatedAt -_id'
  )
  if(pharmacists!=null){
    res.json({message:'success',pharmacist:pharmacists,status:200});
  }else{
    next(new AppError('pharmacist Not Found',422))
  }

})
// //////////////////////////////////////
export const UpdatePharmacist= catchAsncError(async(req,res,next)=>{
  const id=req.query.pharmacistID;
  const {name,Mobile,Address,Days,Time,salary}=req.body;
  // this new for find after update without new return before update
  const findpharmacist=await pharmacist.findById(id);
  if(findpharmacist){
    await Timing.updateMany({_id:findpharmacist.Times},{Days,Time})
  await Payment.updateOne({_id:findpharmacist.Salary},{Salary:salary})
    await userModel.findByIdAndUpdate(findpharmacist.userId,{name,Mobile,Address},{new:true})
    let pharmacists= await pharmacist.findById(id ,{new:true}).populate('userId','-_id -confirmEmail -role -password -__v').populate('Times','-user -__v -createdAt -updatedAt -_id').populate(
      'Salary','-user -__v -createdAt -updatedAt -_id'
    )
    res.json({message:'success',pharmacist:pharmacists,status:200});
  }
  else{
    next(new AppError('Pharmacist is Not Found',422))
  }
  })
// /////////////////////////////////////////////// 
export const DeletePharmacist= catchAsncError(async(req,res,next)=>{
  let id=req.query.pharmacistID;
  const currentPage=req.query.currentPage;
  let pharmacistOne=await pharmacist.findById(id).populate('userId',' -confirmEmail -role -password -__v');
  if(pharmacistOne){
    await pharmacist.deleteOne({_id:id},{new:true}).populate('userId');
    const perPage = 10;
  let totalpharmacists;
  let deletepharmacists=  await pharmacist.find().countDocuments()
  .then(count => {
    totalpharmacists = count;
    return pharmacist.find({},{__v:0,createdAt:0,updatedAt:0 ,Salary:0}).populate('userId','name email -_id').populate('Times','-user -__v -createdAt -updatedAt -_id')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  });
  let deleteUser=await userModel.deleteOne({_id:pharmacistOne.userId},{new:true});
  let deleteTiming=await Timing.deleteOne({_id:pharmacistOne.Times},{new:true});
  let deleteSalary=await Payment.deleteOne({_id:pharmacistOne.Salary},{new:true});
  
  if(deletepharmacists&&deleteUser&&deleteTiming&&deleteSalary){
      res.json({message:'success',pharmacist:deletepharmacists,status:200,Totalpharmacists: totalpharmacists}) ;
    }
    
  }else{
    next(new AppError('pharmacist is Not Found',422))
  }
})