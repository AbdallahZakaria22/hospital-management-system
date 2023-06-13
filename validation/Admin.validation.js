import  joi from 'joi'
export const AddDoctorValidate=joi.object({
    name:joi.string().required().min(3).max(20),
    email:joi.string().email(),
    password:joi.string().pattern(new RegExp('^[A-Za-z0-9@$*#%-_]{3,10}$')).required(),
    repeat_password: joi.string().required().valid(joi.ref('password')),
    Mobile:joi.string().pattern(new RegExp('^01[0-2,5]{1}[0-9]{8}$')).required(),
    Gender:joi.string().required(),
    DOB:joi.date().required(),
    Address:joi.string().required(),
    Specialization:joi.string().required(),
    Experience:joi.string().required(),
    Language:joi.string().required(),
    salary:joi.number().required(),
    Days:joi.array().required(),
    Time:joi.array().required(),
    role:joi.string().required()
});
export const AddTimingValidate=joi.object({
    Days:joi.array().required(),
    Time:joi.array().required(),
});
export const AddPharmacyValidate=joi.object({
    name:joi.string().required().min(3).max(20),
    email:joi.string().email(),
    password:joi.string().pattern(new RegExp('^[A-Za-z0-9@$*#%-_]{3,10}$')).required(),
    repeat_password: joi.string().required().valid(joi.ref('password')),
    Mobile:joi.string().pattern(new RegExp('^01[0-2,5]{1}[0-9]{8}$')).required(),
    Gender:joi.string().required(),
    DOB:joi.date().required(),
    Address:joi.string().required(),
    namePharmacy:joi.string().required(),
    salary:joi.number().required(),
    Days:joi.array().required(),
    Time:joi.array().required(),
    role:joi.string().required()
});
export const AddLaboratoriestValidate=joi.object({
    name:joi.string().required().min(3).max(20),
    email:joi.string().email(),
    password:joi.string().pattern(new RegExp('^[A-Za-z0-9@$*#%-_]{3,10}$')).required(),
    repeat_password: joi.string().required().valid(joi.ref('password')),
    Mobile:joi.string().pattern(new RegExp('^01[0-2,5]{1}[0-9]{8}$')).required(),
    Gender:joi.string().required(),
    DOB:joi.date().required(),
    Address:joi.string().required(),
    nameLaboratory:joi.string().required(),
    salary:joi.number().required(),
    Days:joi.array().required(),
    Time:joi.array().required(),
    role:joi.string().required()
});
export const AddRadiologistValidate=joi.object({
    name:joi.string().required().min(3).max(20),
    email:joi.string().email(),
    password:joi.string().pattern(new RegExp('^[A-Za-z0-9@$*#%-_]{3,10}$')).required(),
    repeat_password: joi.string().required().valid(joi.ref('password')),
    Mobile:joi.string().pattern(new RegExp('^01[0-2,5]{1}[0-9]{8}$')).required(),
    Gender:joi.string().required(),
    DOB:joi.date().required(),
    Address:joi.string().required(),
    nameX_RayCenter:joi.string().required(),
    salary:joi.number().required(),
    Days:joi.array().required(),
    Time:joi.array().required(),
    role:joi.string().required()
});
export const UpdatePharmacyValidate=joi.object({
    name:joi.string().required().min(3).max(20),
    Mobile:joi.string().pattern(new RegExp('^01[0-2,5]{1}[0-9]{8}$')).required(),
    Address:joi.string().required(),
    salary:joi.number().required(),
    Days:joi.array().required(),
    Time:joi.array().required(), 
});
export const AddEmployeeValidate=joi.object({
    name:joi.string().required().min(3).max(20),
    Mobile:joi.string().pattern(new RegExp('^01[0-2,5]{1}[0-9]{8}$')).required(),
    Gender:joi.string().required(),
    DOB:joi.date().required(),
    Address:joi.string().required(),
    salary:joi.number().required(),
    Days:joi.array().required(),
    Time:joi.array().required(),
    role:joi.string().required()
});
export const Accountant=joi.object({
    name:joi.string().required().min(3).max(20),
    email:joi.string().email(),
    password:joi.string().pattern(new RegExp('^[A-Za-z0-9@$*#%-_]{3,10}$')).required(),
    repeat_password: joi.string().required().valid(joi.ref('password')),
    Mobile:joi.string().pattern(new RegExp('^01[0-2,5]{1}[0-9]{8}$')).required(),
    Gender:joi.string().required(),
    DOB:joi.date().required(),
    Address:joi.string().required(),
    salary:joi.number().required(),
    Days:joi.array().required(),
    Time:joi.array().required(),
    role:joi.string().required()
});
export const NurseValidate=joi.object({
    name:joi.string().required().min(3).max(20),
    email:joi.string().email(),
    password:joi.string().pattern(new RegExp('^[A-Za-z0-9@$*#%-_]{3,10}$')).required(),
    repeat_password: joi.string().required().valid(joi.ref('password')),
    Mobile:joi.string().pattern(new RegExp('^01[0-2,5]{1}[0-9]{8}$')).required(),
    Gender:joi.string().required(),
    DOB:joi.date().required(),
    Address:joi.string().required(),
    salary:joi.number().required(),
    Days:joi.array().required(),
    Time:joi.array().required(),
    role:joi.string().required()
});
export const UpdateNurseValidate=joi.object({
    name:joi.string().required().min(3).max(20),
    Mobile:joi.string().pattern(new RegExp('^01[0-2,5]{1}[0-9]{8}$')).required(),
    Address:joi.string().required(),
    salary:joi.number().required(),
    Days:joi.array().required(),
    Time:joi.array().required(),
});
