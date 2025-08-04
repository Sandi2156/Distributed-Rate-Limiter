// src/routes/apiRegistrationRoutes.js
import express from 'express';
import { registerApi, getUserRegistrations, deleteRegistration, updateRegistration, getRegistrationById } from '../services/apiRegistrationService.js';
import { authenticateToken } from '../middleware/authMiddleWare.js';

const router = express.Router();

router.post('/register', authenticateToken, registerApi);
router.get('/registrations', authenticateToken, getUserRegistrations);
router.get('/registrations/:id', authenticateToken, getRegistrationById);
router.delete('/registrations/:id', authenticateToken, deleteRegistration);
router.put('/registrations/:id', authenticateToken, updateRegistration);

export default router;
