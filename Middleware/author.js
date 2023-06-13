import { userModel } from "../models/user.model.js";
import  jwt  from 'jsonwebtoken';
import { AppError } from "../util/AppError.js";
export const authorAdmin=async(req,res,next)=>{
    let token=req.header('token');
    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {
        if(err){
            next(new AppError(err,400))
        }
        else{
            let id=decoded.id;
            const {role}=await userModel.findById(id)
            if(role=="admin"){
                next();
            }else{
                next(new AppError('Not authorized',403))
            }
            
        }
    });
};
export const authorPharmacy=async(req,res,next)=>{
    let token=req.header('token');
    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {
        if(err){
            next(new AppError(err,400))
        }
        else{
            let id=decoded.id;
            const user=await userModel.findById(id)
            if(user){
                if(user.role=="pharmacist"){
                    next();
                }else{
                    next(new AppError('Not authorized',403))
                }
            }else{
                next(new AppError('invalid token',404))
            }
            
        }
    });
};
export const authorDoctor=async(req,res,next)=>{
    let token=req.header('token');
    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {
        if(err){
            next(new AppError(err,400))
        }
        else{
            let id=decoded.id;
            const user=await userModel.findById(id)
            if(user){
                if(user.role=="doctor"){
                    next();
                }else{
                    next(new AppError('Not authorized',403))
                }
            }else{
                next(new AppError('invalid token',404))
            }
            
            
        }
    });
};
export const authorPatient=async(req,res,next)=>{
    let token=req.header('token');
    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {
        if(err){
            next(new AppError(err,400))
        }
        else{
            let id=decoded.id;
            const user=await userModel.findById(id)
            if(user){
                if(user.role=="user"){
                    next();
                }else{
                    next(new AppError('Not authorized',403))
                }
            }else{
                next(new AppError('invalid token',404))
            }
            
        }
    });
};
/////////////////////////////////////////////////////
export const authorNurse=async(req,res,next)=>{
    let token=req.header('token');
    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {
        if(err){
            next(new AppError(err,400))
        }
        else{
            let id=decoded.id;
            const user=await userModel.findById(id)
            if(user){
                if(user.role=="Nurse"){
                    next();
                }else{
                    next(new AppError('Not authorized',403))
                }
            }else{
                next(new AppError('invalid token',404))
            }
            
            
        }
    });
};
/////////////////////////////////////////////////////
export const authorLaboratoriest=async(req,res,next)=>{
    let token=req.header('token');
    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {
        if(err){
            next(new AppError(err,400))
        }
        else{
            let id=decoded.id;
            const user=await userModel.findById(id)
            if(user){
                if(user.role=="Laboratoriest"){
                    next();
                }else{
                    next(new AppError('Not authorized',403))
                }
            }else{
                next(new AppError('invalid token',404))
            }
            
            
        }
    });
};
/////////////////////////////////////////////////////
export const authorRadiologist=async(req,res,next)=>{
    let token=req.header('token');
    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {
        if(err){
            next(new AppError(err,400))
        }
        else{
            let id=decoded.id;
            const user=await userModel.findById(id)
            if(user){
                if(user.role=="Radiologist"){
                    next();
                }else{
                    next(new AppError('Not authorized',403))
                }
            }else{
                next(new AppError('invalid token',404))
            }
            
            
        }
    });
};
///////////////////////////////////////////////////////////
export const authorAccountant=async(req,res,next)=>{
    let token=req.header('token');
    jwt.verify(token, process.env.JWT_KEY, async function(err, decoded) {
        if(err){
            next(new AppError(err,400))
        }
        else{
            let id=decoded.id;
            const user=await userModel.findById(id)
            if(user){
                if(user.role=="Accountant"){
                    next();
                }else{
                    next(new AppError('Not authorized',403))
                }
            }else{
                next(new AppError('invalid token',404))
            }
            
            
        }
    });
};