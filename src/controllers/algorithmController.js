// src/controllers/algorithmController.js
import { getAllAlgorithms } from '../services/algorithmService.js';

export async function listAlgorithms(req, res) {
  try {
    const algorithms = await getAllAlgorithms();
    return res.status(200).json({ algorithms });
  } catch (err) {
    return res.status(500).json({ message: 'Unable to retrieve algorithms' });
  }
}
