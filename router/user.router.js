import { Router } from 'express';
import { SingnUp, SingnIn ,verifiy, sendCode, restPassword} from '../controllers/user.controller.js';
import { signUpValidate, signInValidate } from '../validation/userSchema.validation.js';
import { validation } from '../Middleware/validation.js';
import { restPassword as vaildationPassword} from './../validation/userSchema.validation.js';
const userRouter=Router();
userRouter.post('/SingnUp',validation(signUpValidate),SingnUp);
userRouter.post('/signIn',validation(signInValidate),SingnIn);
userRouter.get('/verify/:token',verifiy);
userRouter.patch("/sendCode",sendCode);
userRouter.post('/restPassword',validation(vaildationPassword),restPassword)
export default userRouter;