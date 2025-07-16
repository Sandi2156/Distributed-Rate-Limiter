// src/controllers/apiRegistrationController.js
import { ApiRegistration } from '../models/apiRegistrationModel.js';
import { Rule } from '../models/ruleModel.js';

export async function registerApi(req, res) {
  try {
    const { apiUrl, ruleId } = req.body;

    if (!apiUrl || !ruleId) {
      return res.status(400).json({ message: 'apiUrl and ruleId are required' });
    }

    // Check if rule exists
    const rule = await Rule.findById(ruleId);
    if (!rule) {
      return res.status(404).json({ message: 'Invalid ruleId: Rule not found' });
    }

    // Check for duplicate registration
    const existing = await ApiRegistration.findOne({
      userId: req.user._id,
      apiUrl
    });

    if (existing) {
      return res.status(409).json({ message: 'API already registered with this user' });
    }

    const registration = new ApiRegistration({
      userId: req.user._id,
      apiUrl,
      ruleId
    });

    await registration.save();

    return res.status(201).json({ message: 'API registered successfully', registration });
  } catch (err) {
    console.error('Register API error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}

export async function getUserRegistrations(req, res) {
  try {
    const registrations = await ApiRegistration.find({ userId: req.user._id })
      .populate('ruleId', 'name algorithmId') // populate rule details
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

    const deleted = await ApiRegistration.findOneAndDelete({
      _id: id,
      userId: req.user._id
    });

    if (!deleted) {
      return res.status(404).json({ message: 'Registration not found or not owned by user' });
    }

    return res.status(200).json({ message: 'Registration deleted successfully' });
  } catch (err) {
    console.error('Delete Registration error:', err);
    return res.status(500).json({ message: 'Server error' });
  }
}
