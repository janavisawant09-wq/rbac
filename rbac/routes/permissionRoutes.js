const express = require('express');
const router = express.Router();
const permissionController = require('../controller/permissionController');
const { requireApiKey, validatePermissionsBody } = require('../middlewear/auth');
const checkPermission = require('../middlewear/middle');

router.post('/', requireApiKey, validatePermissionsBody, permissionController.createPermission);
router.use(requireApiKey);
router.use(checkPermission);

router.get('/', permissionController.getPermissions);
router.get('/:id', permissionController.getPermission);
router.put('/:id', validatePermissionsBody, permissionController.updatePermission);
router.delete('/:id', permissionController.deletePermission);

module.exports = router;
