const mongoose = require("mongoose");

const userRoles = new mongoose.Schema({
    roleName: {
        type: String,
        unique: true,
        required: true,
    },
    permissions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "permission",
    }],
},{
    timestamps: true,
    strict: true,
    collection: "UserRoles",
});

const userRole = mongoose.model("UserRole", userRoles);

module.exports = userRole;

    