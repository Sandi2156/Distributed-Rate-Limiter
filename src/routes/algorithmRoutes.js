// src/routes/algorithmRoutes.js
import express from 'express';
import { listAlgorithms } from '../controllers/algorithmController.js';

const router = express.Router();

router.get('/algorithms', listAlgorithms);

export default router;
