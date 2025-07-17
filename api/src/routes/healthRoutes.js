import express from 'express';
import { checkHealth } from '../services/healthService';

const router = express.Router();

router.get("/", checkHealth);

export default router;