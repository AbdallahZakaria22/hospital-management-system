import { Router } from 'express';
import { auth as _auth } from '../Middleware/user.auth.js';
import { authorLaboratoriest } from '../Middleware/author.js';
import { addLapReport, deleteReport, viewLabReport, viewPatient, viewReportDetails } from '../controllers/cender Lab&X-ray/Laboratoriest.controllers.js';
import { uploud } from './../util/fileUpload.js';
const LabratoriestRouter =Router();
LabratoriestRouter.post('/addLapReport',uploud.single('file'),_auth,authorLaboratoriest,addLapReport);
LabratoriestRouter.get('/viewLabReport',_auth,authorLaboratoriest,viewLabReport);
LabratoriestRouter.get('/viewReportDetails',_auth,authorLaboratoriest,viewReportDetails);
LabratoriestRouter.delete('/deleteReport',_auth,authorLaboratoriest,deleteReport);
LabratoriestRouter.get('/viewPatient',_auth,authorLaboratoriest,viewPatient)
export default LabratoriestRouter;  