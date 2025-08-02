// src/routes/apiRegistrationRoutes.js
import express from 'express';
import { registerApi, getUserRegistrations, deleteRegistration, updateRegistration } from '../services/apiRegistrationService.js';
import { authenticateToken } from '../middleware/authMiddleWare.js';

const router = express.Router();

router.post('/register', authenticateToken, registerApi);
router.get('/registrations', authenticateToken, getUserRegistrations);
router.delete('/registration/:id', authenticateToken, deleteRegistration);
router.put('/registration/:id', authenticateToken, updateRegistration);

export default router;
