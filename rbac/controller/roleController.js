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

    // Sanitize and validate permission ids
    if (req.body && Array.isArray(req.body.permissions)) {
      const sanitized = req.body.permissions.map(p => {
        if (typeof p !== 'string') return p;
        // remove surrounding angle brackets and quotes and whitespace
        return p.replace(/^\s*<|>\s*$/g, '').replace(/^\"|\"$/g, '').trim();
      });

      const invalid = sanitized.filter(id => typeof id === 'string' && !/^[a-fA-F0-9]{24}$/.test(id));
      if (invalid.length) {
        return res.status(400).json({ message: 'Invalid permission id(s)', invalid });
      }
      req.body.permissions = sanitized;
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

    // Sanitize and validate permission ids before update
    if (req.body && Array.isArray(req.body.permissions)) {
      const sanitized = req.body.permissions.map(p => {
        if (typeof p !== 'string') return p;
        return p.replace(/^\s*<|>\s*$/g, '').replace(/^\"|\"$/g, '').trim();
      });

      const invalid = sanitized.filter(id => typeof id === 'string' && !/^[a-fA-F0-9]{24}$/.test(id));
      if (invalid.length) {
        return res.status(400).json({ message: 'Invalid permission id(s)', invalid });
      }
      req.body.permissions = sanitized;
    }

      // If client tries to change roleName, ensure it's not used by another role
      if (req.body && req.body.roleName) {
        const existing = await UserRole.findOne({ roleName: req.body.roleName });
        if (existing && existing._id.toString() !== req.params.id) {
          return res.status(409).json({ message: 'Role name already in use' });
        }
      }

      const role = await UserRole.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!role) return res.status(404).json({ message: 'Role not found' });
    res.json(role);
  } catch (error) {
      // Handle duplicate key error more clearly
      if (error && error.code === 11000) {
        return res.status(409).json({ message: 'Duplicate key error', error: error.message });
      }
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
