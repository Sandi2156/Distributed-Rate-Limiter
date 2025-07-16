import { ApiRegistration } from '../models/apiRegistrationModel.js';
import { Rule } from '../models/ruleModel.js';
import { FixedWindowConfig } from '../models/fixedWindowConfigModel.js';
import { checkRateLimit } from '../limiter.js';
import axios from 'axios';
import Redis from 'ioredis';
import config from '../config.js';

export async function proxyRequest(req, res) {
  try {
    const userId = req.user._id;
    const { targetUrl, method = 'GET', payload = null, headers = {} } = req.body;

    if (!targetUrl) {
      return res.status(400).json({ message: 'targetUrl is required' });
    }

    // Create Redis instance
    const redis = new Redis({
      host: config.redis.host,
      port: config.redis.port,
    });

    // 1️⃣ Check user has registered this API
    const registration = await ApiRegistration.findOne({ userId, apiUrl: targetUrl });
    if (!registration) {
      return res.status(403).json({ message: 'This API is not registered under your account.' });
    }

    // 2️⃣ Get the Rule details
    const rule = await Rule.findById(registration.ruleId);
    if (!rule) {
      return res.status(500).json({ message: 'Rate limiting rule configuration missing.' });
    }

    // 3️⃣ Get algorithm details
    let limit, windowInSeconds;
    const fixedRule = await FixedWindowConfig.findOne({ ruleId: rule._id });
    if (!fixedRule) {
      return res.status(500).json({ message: 'Fixed Window rule parameters not found.' });
    }
    limit = fixedRule.limit;
    windowInSeconds = fixedRule.windowSeconds;

    // 4️⃣ Rate limiting check
    const rateResult = await checkRateLimit(userId.toString(), limit, windowInSeconds);
    if (!rateResult.allowed) {
      return res.status(429).json({
        message: 'Rate limit exceeded. Try again later.',
        retryAfter: rateResult.retryAfter
      });
    }

    // 5️⃣ Proxy the request with user-provided headers
    const axiosResponse = await axios({
      method,
      url: targetUrl,
      headers,
      data: payload,
      timeout: 10000
    });

    // 6️⃣ Return response to client
    return res.status(axiosResponse.status).json({
      data: axiosResponse.data,
      headers: axiosResponse.headers,
      status: axiosResponse.status
    });

  } catch (err) {
    console.error('Proxy error:', err);

    if (err.response) {
      return res.status(err.response.status).json({
        message: 'Error from target API',
        details: err.response.data
      });
    }

    return res.status(500).json({ message: 'Server error' });
  }
}
