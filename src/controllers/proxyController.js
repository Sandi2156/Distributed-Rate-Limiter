// src/controllers/proxyController.js
import { Api } from '../models/apiModel.js';
import { rateLimitCheck } from '../services/rateLimiterService.js';
import axios from 'axios';

export async function handleProxy(req, res) {
  try {
    const { targetUrl, targetUrlBody, targetUrlHeaders } = req.body;

    if (!targetUrl) {
      return res.status(400).json({ message: 'targetUrl is required' });
    }

    const api = await Api.findOne({ user: req.user._id, endpointUrl: targetUrl }).populate('rateLimitAlgorithm');

    if (!api) {
      return res.status(404).json({ message: 'API not registered for this user' });
    }

    const allowed = await rateLimitCheck(req.user._id, api, api.config || {});
    if (!allowed) {
      return res.status(429).json({ message: 'Rate limit exceeded' });
    }

    // Forward the request
    const forwardRes = await axios.post(targetUrl, targetUrlBody, {
      headers: targetUrlHeaders || {},
    });

    return res.status(forwardRes.status).json(forwardRes.data);

  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
}
