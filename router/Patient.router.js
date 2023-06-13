import { Router } from 'express';
import express from 'express';
import { auth as _auth } from '../Middleware/user.auth.js';
import {  authorPatient } from '../Middleware/author.js';
import { BookDoctor, BookRoom, ViewAppointment, ViewDoctors, cancelBookDoctor, cancelRoom, createOrder, patientInformation, payPatientBill, searchDoctor, timeDetails, viewBookRoom, viewDisease, viewLabReport, viewMedicalHistory, viewPrescription, viewReport, viewRoom, viewX_RayReport } from '../controllers/Patient/Patient.controllers.js';
const PatientRouter =Router();
PatientRouter.get('/ViewDoctors',_auth,authorPatient,ViewDoctors)
PatientRouter.get('/searchDoctor',_auth,authorPatient,searchDoctor)
PatientRouter.post('/BookDoctor',_auth,authorPatient,BookDoctor)
PatientRouter.get('/ViewAppointment',_auth,authorPatient,ViewAppointment)
PatientRouter.get('/timeDetails',_auth,authorPatient,timeDetails)
PatientRouter.get('/viewMedicalHistory',_auth,authorPatient,viewMedicalHistory);
PatientRouter.get('/viewPrescription',_auth,authorPatient,viewPrescription);
PatientRouter.delete('/cancelBookDoctor',_auth,authorPatient,cancelBookDoctor);
PatientRouter.get('/viewRoom',_auth,authorPatient,viewRoom);
PatientRouter.get('/BookRoom',_auth,authorPatient,BookRoom);
PatientRouter.delete('/cancelRoom',_auth,authorPatient,cancelRoom);
PatientRouter.get('/viewBookRoom',_auth,authorPatient,viewBookRoom);
PatientRouter.get('/patientInformation',_auth,authorPatient,patientInformation);
PatientRouter.get('/viewDisease',_auth,authorPatient,viewDisease);
PatientRouter.get('/createOrder',_auth,authorPatient,createOrder);
PatientRouter.get('/viewLabReport',_auth,authorPatient,viewLabReport);
PatientRouter.get('/viewX_RayReport',_auth,authorPatient,viewX_RayReport);
PatientRouter.post('/webhook', express.raw({type: 'application/json'}), payPatientBill);
PatientRouter.get('/viewReport',_auth,authorPatient,viewReport)
export default PatientRouter;   
