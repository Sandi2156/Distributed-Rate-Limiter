// src/controllers/apiRegistrationController.js
import { Api } from "../models/apiModel.js";
import { RateLimitAlgorithm } from "../models/algorithmModel.js";

export async function registerApi(req, res) {
  try {
    const { apiUrl, name, algorithmId, config, method } = req.body;

    const validMethods = [
      "GET",
      "POST",
      "PUT",
      "DELETE",
      "PATCH",
      "HEAD",
      "OPTIONS",
    ];
    if (!apiUrl || !name || !algorithmId || !method) {
      return res.status(400).json({
        message: "apiUrl, name, algorithmId, and method are required",
      });
    }

    if (!validMethods.includes(method.toUpperCase())) {
      return res.status(400).json({
        message: `Invalid method. Allowed methods: ${validMethods.join(", ")}`,
      });
    }

    // Validate algorithm
    const algorithm = await RateLimitAlgorithm.findById(algorithmId);
    if (!algorithm) {
      return res.status(404).json({
        message: "Invalid algorithmId: Rate limiting algorithm not found",
      });
    }

    // Check if API already registered by this user
    const existing = await Api.findOne({
      user: req.user._id,
      endpointUrl: apiUrl,
      method: method.toUpperCase(),
    });

    if (existing) {
      return res.status(409).json({
        message: "API with this method already registered by this user",
      });
    }

    // Register the API
    const api = new Api({
      user: req.user._id,
      name,
      endpointUrl: apiUrl,
      rateLimitAlgorithm: algorithm._id,
      config: config || {},
      method: method.toUpperCase(),
    });

    await api.save();

    return res.status(201).json({ message: "API registered successfully" });
  } catch (err) {
    console.error("Register API error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getUserRegistrations(req, res) {
  try {
    const registrations = await Api.find({ user: req.user._id })
      .select("_id name endpointUrl rateLimitAlgorithm")
      .populate("rateLimitAlgorithm", "name description")
      .lean();

    return res.status(200).json({ registrations });
  } catch (err) {
    console.error("Get Registrations error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getRegistrationById(req, res) {
  try {
    const { id } = req.params;

    const registration = await Api.findOne({
      _id: id,
      user: req.user._id,
    })
      .populate("rateLimitAlgorithm", "name description")
      .lean();

    if (!registration) {
      return res
        .status(404)
        .json({ message: "API registration not found or not owned by user" });
    }

    return res.status(200).json({ registration });
  } catch (err) {
    console.error("Get Registration By ID error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function deleteRegistration(req, res) {
  try {
    const { id } = req.params;

    const deleted = await Api.findOneAndDelete({
      _id: id,
      user: req.user._id,
    });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "API not found or not owned by user" });
    }

    return res.status(200).json({ message: "API deleted successfully" });
  } catch (err) {
    console.error("Delete Registration error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateRegistration(req, res) {
  try {
    const { id } = req.params;
    const { apiUrl, name, algorithmId, config } = req.body;

    // Check if API exists and belongs to user
    const existingApi = await Api.findOne({
      _id: id,
      user: req.user._id,
    });

    if (!existingApi) {
      return res
        .status(404)
        .json({ message: "API not found or not owned by user" });
    }

    // Validate algorithm if algorithmId is provided
    if (algorithmId) {
      const algorithm = await RateLimitAlgorithm.findById(algorithmId);
      if (!algorithm) {
        return res.status(404).json({
          message: "Invalid algorithmId: Rate limiting algorithm not found",
        });
      }
    }

    // Check if new apiUrl conflicts with another API by the same user
    if (apiUrl && apiUrl !== existingApi.endpointUrl) {
      const conflictingApi = await Api.findOne({
        user: req.user._id,
        endpointUrl: apiUrl,
        _id: { $ne: id }, // Exclude current API from check
      });

      if (conflictingApi) {
        return res
          .status(409)
          .json({ message: "API URL already registered by this user" });
      }
    }

    // Update the API
    const updateData = {};
    if (apiUrl) updateData.endpointUrl = apiUrl;
    if (name) updateData.name = name;
    if (algorithmId) updateData.rateLimitAlgorithm = algorithmId;
    if (config !== undefined) updateData.config = config;

    const updatedApi = await Api.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    }).populate("rateLimitAlgorithm", "name description");

    return res.status(200).json({
      message: "API updated successfully",
    });
  } catch (err) {
    console.error("Update Registration error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
