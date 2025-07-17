// src/routes/proxyRoutes.js
import express from 'express';
import { handleProxy } from '../controllers/proxyController.js';
import { authenticateToken } from '../middleware/authMiddleWare.js';

const router = express.Router();

router.post('/', authenticateToken, handleProxy);

export default router;
