import { Router } from 'express';
import { auth as _auth } from '../Middleware/user.auth.js';
import { authorDoctor } from '../Middleware/author.js';
import { ViewAppointment, ViewTiming, addLimitRange, addMedicalHistory, addPatientDisease, addPrescription, checkMedicalHistory, confirmTiming, deletePatientDisease, getAllTests, searchPatient, updateMedicalHistory, updatePrescription, viewAllPatient, viewMedicalHistory, viewPatientDetails, viewPrescription } from '../controllers/Doctor/Doctor.controllers.js';
import { viewReportForPatient } from '../controllers/Nurse/Nurse.controller.js';
import { searchMedicine } from '../controllers/Pharmacy/Medicine.controller.js';
const DoctorRouter =Router();
DoctorRouter.post('/confirmTiming',_auth,authorDoctor,confirmTiming)
DoctorRouter.get('/ViewTiming',_auth,authorDoctor,ViewTiming)
DoctorRouter.post('/addLimitRange',_auth,authorDoctor,addLimitRange)
DoctorRouter.get('/ViewAppointment',_auth,authorDoctor,ViewAppointment)
DoctorRouter.post('/addPrescription',_auth,authorDoctor,addPrescription)
DoctorRouter.get('/viewPrescription',_auth,authorDoctor,viewPrescription)
DoctorRouter.put('/updatePrescription',_auth,authorDoctor,updatePrescription);
DoctorRouter.post('/addPatientDisease',_auth,authorDoctor,addPatientDisease);
DoctorRouter.delete('/deletePatientDisease',_auth,authorDoctor,deletePatientDisease);
DoctorRouter.get('/viewMedicalHistory',_auth,authorDoctor,viewMedicalHistory);
DoctorRouter.get('/viewPatientDetails',_auth,authorDoctor,viewPatientDetails);
DoctorRouter.get('/viewAllPatient',_auth,authorDoctor,viewAllPatient);
DoctorRouter.get('/searchPatient',_auth,authorDoctor,searchPatient);
DoctorRouter.get('/checkMedicalHistory',_auth,authorDoctor,checkMedicalHistory);
DoctorRouter.post('/addMedicalHistory',_auth,authorDoctor,addMedicalHistory);
DoctorRouter.put('/updateMedicalHistory',_auth,authorDoctor,updateMedicalHistory);
DoctorRouter.get('/viewReportForPatient',_auth,authorDoctor,viewReportForPatient);
DoctorRouter.get('/getAllMedicines',_auth,authorDoctor,searchMedicine);
DoctorRouter.get('/getAllTests',_auth,authorDoctor,getAllTests);
export default DoctorRouter;    