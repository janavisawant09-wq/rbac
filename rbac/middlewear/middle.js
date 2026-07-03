const mongoose = require("mongoose");
const User = require("../models/user");

const checkPermission = async (req, res, next) => {
    try {

        if (!req.user || !req.user.id) {
            return res.status(401).json({
                success: false,
                message: "Unauthorized - user not found"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user id"
            });
        }

        const user = await User.findById(req.user.id)
            .populate({
                path: "role",
                populate: {
                    path: "permissions"
                }
            });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found"
            });
        }

        if (!user.role) {
            return res.status(403).json({
                success: false,
                message: "Role not assigned"
            });
        }

        const permissions = Array.isArray(user.role.permissions) ? user.role.permissions : [];

        const requestPath = req.route?.path || req.path;
        const isAllowed = permissions.some(permission => {

            return (
                permission.method.toUpperCase() === req.method &&
                permission.baseUrl === req.baseUrl &&
                permission.path === requestPath &&
                !permission.deletedAt
            );

        });

        if (!isAllowed) {
            return res.status(403).json({
                success: false,
                message: "Permission denied"
            });
        }

        next();

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        });

    }
};

module.exports = checkPermission;