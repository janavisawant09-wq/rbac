const UserRole = require('../models/userRole');
const Permission = require('../models/permissionModels');

exports.createRole = async (req, res) => {
  try {
    // Accept permissions passed as a JSON string or an actual array
    if (req.body && typeof req.body.permissions === 'string') {
      try {
        req.body.permissions = JSON.parse(req.body.permissions);
      } catch (e) {
        req.body.permissions = req.body.permissions
          .replace(/^[\[\]]+/g, '')
          .split(',')
          .map(s => s.trim().replace(/^\"|\"$/g, ''))
          .filter(Boolean);
      }
    }

    const role = await UserRole.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getRoles = async (req, res) => {
  try {
    const roles = await UserRole.find().populate('permissions');
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRole = async (req, res) => {
  try {
    const role = await UserRole.findById(req.params.id).populate('permissions');
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRole = async (req, res) => {
  try {
    // Coerce permissions if provided as string
    if (req.body && typeof req.body.permissions === 'string') {
      try {
        req.body.permissions = JSON.parse(req.body.permissions);
      } catch (e) {
        req.body.permissions = req.body.permissions
          .replace(/^[\[\]]+/g, '')
          .split(',')
          .map(s => s.trim().replace(/^\"|\"$/g, ''))
          .filter(Boolean);
      }
    }

    const role = await UserRole.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteRole = async (req, res) => {
  try {
    const role = await UserRole.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
