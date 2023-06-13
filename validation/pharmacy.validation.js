import  joi from 'joi'
export const AddMedicineValidate=joi.object({
    Medicine_name:joi.string().required(),
    Medicine_quantity:joi.number().required(),
    Medicine_price:joi.number().required(),
});