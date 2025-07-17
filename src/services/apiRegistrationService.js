// src/controllers/apiRegistrationController.js
import { Api } from '../models/apiModel.js';
import { RateLimitAlgorithm } from '../models/algorithmModel.js';

export async function registerApi(req, res) {
  try {
    const { apiUrl, name, algorithmId, config } = req.body;
    console.log(req.user._id);

    if (!apiUrl || !name || !algorithmId) {
      return res.status(400).json({ message: 'apiUrl, name, and algorithmId are required' });
    }

    // Validate algorithm
    const algorithm = await RateLimitAlgorithm.findById(algorithmId);
    if (!algorithm) {
      return res.status(404).json({ message: 'Invalid algorithmId: Rate limiting algorithm not found' });
    }

    // Check if API already registered by this user
    const existing = await Api.findOne({
      user: req.user._id,
      endpointUrl: apiUrl
    });

    if (existing) {
      return res.status(409).json({ message: 'API already registered by this user' });
    }


    // Register the API
    const api = new Api({
      user: req.user._id,
      name,
      endpointUrl: apiUrl,
      rateLimitAlgorithm: algorithm._id,
      config: config || {}
    });

    await api.save();

    return res.status(201).json({ message: 'API registered successfully', api });

  } catch (err) {
    console.error('Register API error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getUserRegistrations(req, res) {
  try {
    const registrations = await Api.find({ user: req.user._id })
      .populate('rateLimitAlgorithm', 'name description') // populate algorithm info
      .lean();

    return res.status(200).json({ registrations });
  } catch (err) {
    console.error('Get Registrations error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}


export async function deleteRegistration(req, res) {
  try {
    const { id } = req.params;

    const deleted = await Api.findOneAndDelete({
      _id: id,
      user: req.user._id
    });

    if (!deleted) {
      return res.status(404).json({ message: 'API not found or not owned by user' });
    }

    return res.status(200).json({ message: 'API deleted successfully' });
  } catch (err) {
    console.error('Delete Registration error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
