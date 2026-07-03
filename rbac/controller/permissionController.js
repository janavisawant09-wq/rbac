const Permission = require('../models/permissionModels');

exports.createPermission = async (req, res) => {
  try {
    const permission = await Permission.create(req.body);
    res.status(201).json(permission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPermissions = async (req, res) => {
  try {
    const permissions = await Permission.find();
    res.json(permissions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getPermission = async (req, res) => {
  try {
    const permission = await Permission.findById(req.params.id);
    if (!permission) return res.status(404).json({ message: 'Permission not found' });
    res.json(permission);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updatePermission = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!permission) return res.status(404).json({ message: 'Permission not found' });
    res.json(permission);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deletePermission = async (req, res) => {
  try {
    const permission = await Permission.findByIdAndDelete(req.params.id);
    if (!permission) return res.status(404).json({ message: 'Permission not found' });
    res.json({ message: 'Permission deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
