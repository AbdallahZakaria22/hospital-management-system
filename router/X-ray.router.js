import { Router } from 'express';
import { auth as _auth } from '../Middleware/user.auth.js';
import {  uploud } from './../util/fileUpload.js';
import {  authorRadiologist } from '../Middleware/author.js';
import { addX_RayReport, deleteX_RayReport, viewPatient, viewX_RayReport, viewX_RayReportDetails } from '../controllers/cender Lab&X-ray/Radiologist.controller.js';
const RadiologistRouter =Router();
RadiologistRouter.post('/addX_RayReport',uploud.single('file'),_auth,authorRadiologist,addX_RayReport);
RadiologistRouter.get('/viewX_RayReport',_auth,authorRadiologist,viewX_RayReport);
RadiologistRouter.get('/viewX_RayReportDetails',_auth,authorRadiologist,viewX_RayReportDetails);
RadiologistRouter.delete('/deleteX_RayReport',_auth,authorRadiologist,deleteX_RayReport);
RadiologistRouter.get('/viewPatient',_auth,authorRadiologist,viewPatient)
export default RadiologistRouter;   