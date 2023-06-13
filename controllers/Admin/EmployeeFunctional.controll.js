import { catchAsncError } from '../../util/catchAsncError.js';
import { AppError } from '../../util/AppError.js';
import { Employee } from '../../models/Employee/Employee.models.js';
import { Timing } from '../../models/Timing/Timing.models.js';
import { Payment } from '../../models/Payment/Payment.models.js';
export const addEmployee=catchAsncError(async(req,res,next)=>{
    const {name,Mobile,Gender,DOB,Address,Days,Time,salary,role}=req.body;
    let mobile=await Employee.findOne({Mobile:Mobile});
    if(!mobile){
      let idTime,idSalary;
      await Timing.insertMany({Days,Time}).then((data)=>{
        idTime=data[0]._id;
      })
      await Payment.insertMany({Salary:salary}).then((data)=>{
        idSalary=data[0]._id;
      });
        await Employee.insertMany({name,Mobile,Gender,DOB,Address,Times:idTime,Salary:idSalary,role})
        
        res.json({message:'success',status:200})
    }
    else{
        next(new AppError('Employee Already in Use',422))
    }
})
////////////////////////////////////////
export const findAllEmployee=catchAsncError( async(req,res,next)=> {
  const {currentPage} = req.query || 1;
  const perPage = 10;
  let totalEmployee;
  let Employees=  await Employee.find().countDocuments()
  .then(count => {
    totalEmployee = count;
    return Employee.find({},{__v:0,createdAt:0,updatedAt:0,role:0,Mobile:0,Gender:0,DOB:0,Address:0,Salary:0}).populate('Times','-user -__v -createdAt -updatedAt')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  });
  res.json({message:'success',Employee:Employees,status:200,totalEmployee: totalEmployee})
    })
// ///////////////////////////////////////
export const  findOneEmployee=catchAsncError( async(req,res,next)=>{
  let id=req.query.EmployeeID;
  let Employees=await Employee.findById(id,{__v:0}).populate('Times','-user -__v -createdAt -updatedAt -_id').populate(
    'Salary','-user -__v -createdAt -updatedAt -_id'
  )
  if(Employees!=null){
    res.json({message:'success',Employee:Employees,status:200});
  }else{
    next(new AppError('Employee Not Found',422))
  }


})
// //////////////////////////////////////
export const UpdateEmployee= catchAsncError(async(req,res,next)=>{
  const id=req.query.EmployeeID;
  const {name,Mobile,Address,Days,Time,salary}=req.body;
  // this new for find after update without new return before update
  const findEmployee=await Employee.findById(id);
  if(findEmployee){
    await Timing.updateMany({_id:findEmployee.Times},{Days,Time})
    await Payment.updateOne({_id:findEmployee.Salary},{Salary:salary})
    let Employees= await Employee.findByIdAndUpdate(id,{name,Mobile,Address} ,{new:true}).populate('Times','-user -__v -createdAt -updatedAt -_id').populate(
      'Salary','-user -__v -createdAt -updatedAt -_id'
    )
  
    res.json({message:'success',Employee:Employees,status:200});
  }
  else{
    next(new AppError('Employee is Not Found',422))
  }
  })
// /////////////////////////////////////////////// 
export const DeleteEmployee= catchAsncError(async(req,res,next)=>{
  let id=req.query.EmployeeID;
  let currentPage=req.query.currentPage;
  const EmployeeOne=await Employee.findById(id);
  if(EmployeeOne){
    await Employee.deleteOne({_id:id},{new:true});
    const perPage = 10;
  let totalEmployee;
  let deleteEmployees=  await Employee.find().countDocuments()
  .then(count => {
    totalEmployee = count;
    return Employee.find({},{__v:0,createdAt:0,updatedAt:0,role:0,Mobile:0,Gender:0,DOB:0,Address:0}).populate('Times','-user -__v -createdAt -updatedAt -_id')
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
  });
  let deleteTiming=await Timing.deleteOne({_id:EmployeeOne.Times},{new:true});
  let deleteSalary=await Payment.deleteOne({_id:EmployeeOne.Salary},{new:true});
    if(deleteEmployees&&deleteTiming&&deleteSalary){
      res.json({message:'success',Employee:deleteEmployees,status:200,totalEmployee: totalEmployee}) ;
    }
    
  }
})