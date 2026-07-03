const User = require("../models/user");

const checkPermission = async (req, res, next) => {
    try {

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

        const permissions = user.role.permissions;

        const isAllowed = permissions.some(permission => {

            return (
                permission.method.toUpperCase() === req.method &&
                permission.baseUrl === req.baseUrl &&
                permission.path === req.route.path &&
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