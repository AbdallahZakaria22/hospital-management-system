import { hash as _hash } from 'bcrypt';
import { sendMail as _sendMail } from '../../emails/HMS.email.js';
import { userModel } from '../../models/user.model.js';
import { catchAsncError } from '../../util/catchAsncError.js';
import { AppError } from '../../util/AppError.js';
import { Accountant } from '../../models/Accountant/Accountant.models.js';
import { Payment } from '../../models/Payment/Payment.models.js';
import { Timing } from '../../models/Timing/Timing.models.js';
export const addAccountant=catchAsncError(async(req,res,next)=>{
    let {name,email,password,Mobile,Gender,DOB,Address,Days,Time,salary,role}=req.body;
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
        await Accountant.insertMany({userId:idUser,Times:idTime,Salary:idSalary});
          _sendMail(email,role,password); 
        res.json({message:'success',status:200})
    }) 
    }
    else{
        next(new AppError('Email Already in Use',422))
    }
})
////////////////////////////////////////
export const findAllAccountant=catchAsncError( async(req,res,next)=> {
  const {currentPage} = req.query || 1;
  const perPage = 10;
  let totalItems;
  let Accountants=  await Accountant.find().countDocuments()
  .then(count => {
    totalItems = count;
    return Accountant.find({},{__v:0,createdAt:0,updatedAt:0,Salary:0}).populate('userId','name email _id').populate('Times','-user -__v -createdAt -updatedAt')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  });
  res.json({message:'success',Accountants:Accountants,status:200,totalItems: totalItems})
    })
// ///////////////////////////////////////
export const  findOneAccountant=catchAsncError( async(req,res,next)=>{
  let id=req.query.AccountantID;
  let Accountants=await Accountant.findById(id,{__v:0}).populate('userId',' -confirmEmail -role -password -__v').populate('Times','-user -__v -createdAt -updatedAt -_id').populate(
    'Salary','-user -__v -createdAt -updatedAt -_id'
  )
  if(Accountants!=null){
    res.json({message:'success',Accountant:Accountants,status:200});
  }else{
    next(new AppError('Accountant Not Found',422))
  }

})
// //////////////////////////////////////
export const UpdateAccountant= catchAsncError(async(req,res,next)=>{
  const id=req.query.AccountantID;
  const {name,Mobile,Address,Days,Time,salary}=req.body;
  // this new for find after update without new return before update
  const findAccountant=await Accountant.findById(id);
  if(findAccountant){
    await Timing.updateMany({_id:findAccountant.Times},{Days,Time})
    await Payment.updateOne({user:findAccountant.Salary},{Salary:salary})
    await userModel.findByIdAndUpdate(findAccountant.userId,{name,Mobile,Address},{new:true})
    let Accountants= await Accountant.findByIdAndUpdate(id,{userId:findAccountant.userId},{new:true}).populate('userId','-_id -confirmEmail -role -password -__v').populate('Times','-user -__v -createdAt -updatedAt -_id').populate(
      'Salary','-user -__v -createdAt -updatedAt -_id'
    )

    res.json({message:'success',Accountant:Accountants,status:200});
  }
  else{
    next(new AppError('Accountant is Not Found',422))
  }
  })
// /////////////////////////////////////////////// 
export const DeleteAccountant= catchAsncError(async(req,res,next)=>{
    const currentPage=req.query.currentPage;
    let id=req.query.AccountantID;;
  let AccountantOne=await Accountant.findById(id).populate('userId',' -confirmEmail -role -password -__v');
  if(AccountantOne){
    await Accountant.deleteOne({_id:id},{new:true}).populate('userId');
    const perPage = 10;
  let totalItems;
  let deleteAccountants=  await Accountant.find().countDocuments()
  .then(count => {
    totalItems = count;
    return Accountant.find({},{__v:0,createdAt:0,updatedAt:0 ,Salary:0}).populate('userId','name email -_id').populate('Times','-user -__v -createdAt -updatedAt -_id')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  });
  let deleteUser=await userModel.deleteOne({_id:AccountantOne.userId},{new:true});
  let deleteTiming=await Timing.deleteOne({_id:AccountantOne.Times},{new:true});
  let deleteSalary=await Payment.deleteOne({_id:AccountantOne.Salary},{new:true});
  
  if(deleteAccountants&&deleteUser&&deleteTiming&&deleteSalary){
      res.json({message:'success',Accountant:deleteAccountants,status:200,TotalAccountants: totalItems}) ;
    }
    
  }else{
    next(new AppError('Accountant is Not Found',422))
  }
})