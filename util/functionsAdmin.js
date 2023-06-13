import { hash as _hash } from 'bcrypt';
import { userModel } from '../models/user.model.js';
export const add=async(name,email,password,Mobile,Gender,DOB,Address,role)=>{
    let Email=await userModel.findOne({email});

    if(Email==null){
    _hash(password, Number(process.env.ROUND), async function(err, hash){
        await userModel.insertMany({name , email ,password:hash , Mobile,Gender,DOB,Address,role});
    }) 
}
    return  Email;
}