import { Router } from 'express';
import { auth as _auth } from '../Middleware/user.auth.js';
import { authorNurse } from '../Middleware/author.js';
import { addReportForPatient, updateReportForPatient, viewMedication, viewPatients, viewReportForPatient } from './../controllers/Nurse/Nurse.controller.js';
const NurseRouter =Router();
NurseRouter.get('/viewPatients',_auth,authorNurse,viewPatients);
NurseRouter.post('/addReportForPatient',_auth,authorNurse,addReportForPatient);
NurseRouter.put('/updateReportForPatient',_auth,authorNurse,updateReportForPatient);
NurseRouter.get('/viewReportForPatient',_auth,authorNurse,viewReportForPatient);
NurseRouter.get('/viewMedication',_auth,authorNurse,viewMedication)
export default NurseRouter;   