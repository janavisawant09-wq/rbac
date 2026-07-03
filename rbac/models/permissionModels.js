const mongoose = require('mongoose');
const { Schema } = mongoose;

const PermissionSchema = new Schema(
  {
    actionName: String,
    description: String,
    method: String,
    baseUrl: String,
    path: String,
    deletedAt: Date,
  },
  { timestamps: true },
);

const permission = mongoose.model('permission', PermissionSchema);
module.exports = permission;
