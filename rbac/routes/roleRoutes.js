const express = require('express');
const router = express.Router();
const roleController = require('../controller/roleController');
const { requireApiKey, validatePermissionsBody } = require('../middlewear/auth');
const checkPermission = require('../middlewear/middle');

router.use(requireApiKey);
router.post('/', validatePermissionsBody, roleController.createRole);
router.use(checkPermission);

router.get('/', roleController.getRoles);
router.get('/:id', roleController.getRole);
router.put('/:id', validatePermissionsBody, roleController.updateRole);
router.delete('/:id', roleController.deleteRole);

module.exports = router;
