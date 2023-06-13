import { Router } from 'express';
import {  addDoctor, addTiming, DeleteDoctor, findAll, findOne ,UpdateDoctor} from '../controllers/Admin/DoctorFunctions.controller.js';
import { auth as _auth } from '../Middleware/user.auth.js';
import { validation } from './../Middleware/validation.js';
import { Accountant, AddDoctorValidate, AddEmployeeValidate, AddLaboratoriestValidate, AddPharmacyValidate, AddRadiologistValidate, AddTimingValidate, NurseValidate, UpdateNurseValidate, UpdatePharmacyValidate } from './../validation/Admin.validation.js';
import { authorAdmin } from './../Middleware/author.js';
import { addPharmacist, DeletePharmacist, findAllPharmacist, findOnePharmacist, UpdatePharmacist } from '../controllers/Admin/PharmacistFunctional.controller.js';
import { addLaboratoriest, DeleteLaboratoriest, findAllLaboratoriest, findOneLaboratoriest, UpdateLaboratoriest } from '../controllers/Admin/LaboratoriestFunctional.controller.js';
import { addRadiologist, DeleteRadiologist, findAllRadiologist, findOneRadiologist, UpdateRadiologist } from '../controllers/Admin/radiologistFunctional.controller.js';
import { addEmployee, DeleteEmployee, findAllEmployee, findOneEmployee, UpdateEmployee } from '../controllers/Admin/EmployeeFunctional.controll.js';
import { addAccountant, DeleteAccountant, findAllAccountant, findOneAccountant, UpdateAccountant } from '../controllers/Admin/AccountantFunctional.controller.js';
import { addNurse, DeleteNurse, findAllNurse, findOneNurse, UpdateNurse } from '../controllers/Admin/NurseFunctional.controllers.js';
import { addRoom, Dashboard, deleteRoom, searchPatient, updateRoom, viewAllRooms, viewPatient } from '../controllers/Admin/adminFunctional.controller.js';
const AdminRouter =Router(); 
AdminRouter.post('/AddDoctor',_auth,validation(AddDoctorValidate),authorAdmin,addDoctor);
AdminRouter.get('/findAll',_auth,authorAdmin,findAll);
AdminRouter.get('/findOneDoctor',_auth,authorAdmin,findOne);
AdminRouter.put('/updateDoctor',_auth,authorAdmin,UpdateDoctor);
AdminRouter.delete('/DeleteDoctor',_auth,authorAdmin,DeleteDoctor);
//////////////////////////////////////////
AdminRouter.post('/AddPharmacist',_auth,validation(AddPharmacyValidate),authorAdmin,addPharmacist);
AdminRouter.get('/findAllPharmacist',_auth,authorAdmin,findAllPharmacist);
AdminRouter.get('/findOnePharmacist',_auth,authorAdmin,findOnePharmacist);
AdminRouter.put('/updatePharmacist',_auth,validation(UpdatePharmacyValidate),authorAdmin,UpdatePharmacist);
AdminRouter.delete('/DeletePharmacist',_auth,authorAdmin,DeletePharmacist);
/////////////////////////////////////////////////////////
AdminRouter.post('/AddLaboratoriest',_auth,validation(AddLaboratoriestValidate),authorAdmin,addLaboratoriest);
AdminRouter.get('/findAllLaboratoriest',_auth,authorAdmin,findAllLaboratoriest);
AdminRouter.get('/findOneLaboratoriest',_auth,authorAdmin,findOneLaboratoriest);
AdminRouter.put('/updateLaboratoriest',_auth,validation(UpdatePharmacyValidate),authorAdmin,UpdateLaboratoriest);
AdminRouter.delete('/DeleteLaboratoriest',_auth,authorAdmin,DeleteLaboratoriest);
///////////////////////////////////////////////
AdminRouter.post('/addRadiologist',_auth,validation(AddRadiologistValidate),authorAdmin,addRadiologist);
AdminRouter.get('/findAllRadiologist',_auth,authorAdmin,findAllRadiologist);
AdminRouter.get('/findOneRadiologist',_auth,authorAdmin,findOneRadiologist);
AdminRouter.put('/UpdateRadiologist',_auth,validation(UpdatePharmacyValidate),authorAdmin,UpdateRadiologist);
AdminRouter.delete('/DeleteRadiologist',_auth,authorAdmin,DeleteRadiologist);
//////////////////////////////////////////////////////////
AdminRouter.post('/addEmployee',_auth,validation(AddEmployeeValidate),authorAdmin,addEmployee);
AdminRouter.get('/findAllEmployee',_auth,authorAdmin,findAllEmployee);
AdminRouter.get('/findOneEmployee',_auth,authorAdmin,findOneEmployee);
AdminRouter.put('/UpdateEmployee',_auth,authorAdmin,UpdateEmployee);
AdminRouter.delete('/DeleteEmployee',_auth,authorAdmin,DeleteEmployee);
/////////////////////////////////////////////////////////////
AdminRouter.post('/addAccountant',_auth,validation(Accountant),authorAdmin,addAccountant);
AdminRouter.get('/findAllAccountant',_auth,authorAdmin,findAllAccountant);
AdminRouter.get('/findOneAccountant',_auth,authorAdmin,findOneAccountant);
AdminRouter.put('/UpdateAccountant',_auth,authorAdmin,UpdateAccountant);
AdminRouter.delete('/DeleteAccountant',_auth,authorAdmin,DeleteAccountant);
/////////////////////////////////////////////
AdminRouter.post('/addNurse',_auth,validation(NurseValidate),authorAdmin,addNurse);
AdminRouter.get('/findAllNurse',_auth,authorAdmin,findAllNurse);
AdminRouter.get('/findOneNurse',_auth,authorAdmin,findOneNurse);
AdminRouter.put('/UpdateNurse',_auth,validation(UpdateNurseValidate),authorAdmin,UpdateNurse);
AdminRouter.delete('/DeleteNurse',_auth,authorAdmin,DeleteNurse); 
///////////////////////////////////////////
AdminRouter.post('/AddTiming',_auth,validation(AddTimingValidate),authorAdmin,addTiming)
//////////////////////////////////////////////////////
AdminRouter.post('/addRoom',_auth,authorAdmin,addRoom);
/////////////////////////////////////////////////////
AdminRouter.get('/searchPatient',_auth,authorAdmin,searchPatient)
AdminRouter.get('/viewAllRooms',_auth,authorAdmin,viewAllRooms);
AdminRouter.put('/updateRoom',_auth,authorAdmin,updateRoom);
AdminRouter.delete('/deleteRoom',_auth,authorAdmin,deleteRoom);
////////////////////////////////////////////
AdminRouter.get('/Dashboard',_auth,authorAdmin,Dashboard)
AdminRouter.get('/viewPatient',_auth,authorAdmin,viewPatient)
export default AdminRouter;
