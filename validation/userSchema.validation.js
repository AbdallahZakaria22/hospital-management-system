import  joi from 'joi'
export const signUpValidate=joi.object({
    name:joi.string().required().min(3).max(20).messages({
        'string.base': '"name" must be a string',
        'string.empty': '"name" is not allowed to be empty',
        'string.max': '"name" length must be less than or equal to 20 characters long',
        'string.min': '"name" length must be at least 3 characters long',
        'any.required': `"name" is a required field`
    }),
    email:joi.string().email().messages({
        'string.base': `"email" should be a type of 'Email'`,
        'string.empty': `"email" is not allowed to be empty`,
        'any.required': `"email" is a required field`
    }),
    password:joi.string().pattern(new RegExp('^[A-Za-z0-9@$*#%-_]{3,10}$')).required().messages({
        'string.pattern.base': '"password" with value password must be at least 3 characters long contain a number and an uppercase letter  ',
        'string.empty': `"password" is not allowed to be empty`,
        'any.required': `"password" is a required field`
    }),
    repeat_password: joi.string().required().valid(joi.ref('password')).label('repeat_password')
    .messages({ 
    'string.pattern.base': '"password" with value password must be at least 3 characters long contain a number and an uppercase letter  ',
    'string.empty': `"password" is not allowed to be empty`,
    'any.required': `"password" is a required field`,
    'any.only': '"password" does not match' }),
    Mobile:joi.string().pattern(new RegExp('^01[0-2,5]{1}[0-9]{8}$')).required().messages({
        'string.base': '"Mobile" must be a string',
        'string.empty': '"Mobile" is not allowed to be empty',
        'string.pattern.base': '"Mobile" with value must be egyptian number ',
        'any.required': `"Mobile" is a required field`
    }),
    Gender:joi.string().required().messages({
        'string.base': '"Gender" must be a string',
        'string.empty': '"Gender" is not allowed to be empty',
        'any.required': `"Gender" is a required field`
    }),
    DOB:joi.date().required().messages({
        'string.base': '"DOB" must be a string',
        'string.empty': '"DOB" is not allowed to be empty',
        'string.pattern.base': '"DOB" with value invalid format ',
        'any.required': `"DOB" is a required field`
    }),
    Address:joi.string().required().messages({
        'string.base': '"Address" must be a string',
        'string.empty': '"Address" is not allowed to be empty',
        'any.required': `"Address" is a required field`
    }),
    role:joi.string()
});
//////////////////////////////////////
export const signInValidate=joi.object({
    email:joi.string().email().required().messages({
        'string.base': `"email" should be a type of 'Email'`,
        'string.empty': `"email" is not allowed to be empty`,
        'any.required': `"email" is a required field`
    }),
    password:joi.string().pattern(new RegExp('^[A-Za-z0-9@$*#%-_]{3,10}$')).required().messages({
        'string.pattern.base': '"password" with value password must be at least 3 characters long contain a number and an uppercase letter  ',
        'string.empty': `"password" is not allowed to be empty`,
        'any.required': `"password" is a required field`
    })
});
/////////////////////////////////////////////////
export const restPassword=joi.object({
    email:joi.string().email().messages({
        'string.base': `"email" should be a type of 'Email'`,
        'string.empty': `"email" is not allowed to be empty`,
        'any.required': `"email" is a required field`
    }),
    code:joi.number().required().messages({
        'string.base': `"code" should be a type of 'numbuer'`,
        'string.empty': `"code" is not allowed to be empty`,
        'any.required': `"code" is a required field`
    }),
    newPassword:joi.string().pattern(new RegExp('^[A-Za-z0-9@$*#%-_]{3,10}$')).required().messages({
        'string.pattern.base': '"password" with value password must be at least 3 characters long contain a number and an uppercase letter  ',
        'string.empty': `"password" is not allowed to be empty`,
        'any.required': `"password" is a required field`
    }),
    confirmPassword: joi.string().required().valid(joi.ref('newPassword')).label('confirmPassword')
    .messages({ 
    'string.pattern.base': '"password" with value password must be at least 3 characters long contain a number and an uppercase letter  ',
    'string.empty': `"password" is not allowed to be empty`,
    'any.required': `"password" is a required field`,
    'any.only': '"password" does not match' }),
})