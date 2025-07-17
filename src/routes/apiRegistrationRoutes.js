// src/routes/apiRegistrationRoutes.js
import express from 'express';
import { registerApi, getUserRegistrations, deleteRegistration } from '../services/apiRegistrationService.js';
import { authenticateToken } from '../middleware/authMiddleWare.js';

const router = express.Router();

router.post('/register', authenticateToken, registerApi);
router.get('/registrations', authenticateToken, getUserRegistrations);
router.delete('/registration/:id', authenticateToken, deleteRegistration);

export default router;
