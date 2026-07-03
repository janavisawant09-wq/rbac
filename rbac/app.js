require('dotenv').config();
const express = require('express');
const roleRoutes = require('./routes/roleRoutes');
const permissionRoutes = require('./routes/permissionRoutes');
const connectDB = require('./config/db');
const UserRole = require('./models/userRole');
const Permission = require('./models/permissionModels');

const app = express();
app.use(express.json());

connectDB();

app.use('/api/roles', roleRoutes);
app.use('/api/permissions', permissionRoutes);

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
