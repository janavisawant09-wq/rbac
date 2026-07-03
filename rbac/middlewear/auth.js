const logger = (req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
};

const requireApiKey = (req, res, next) => {
  const apiKey = req.get('x-api-key') || req.get('X-API-KEY');
  const expectedKey = process.env.API_KEY || 'secret';

  if (!apiKey || apiKey !== expectedKey) {
    return res.status(401).json({ message: 'Unauthorized - invalid API key' });
  }

  next();
};

const validatePermissionsBody = (req, res, next) => {
  if (!req.body) {
    return res.status(400).json({ message: 'Empty body' });
  }

  if (req.body.permissions && !Array.isArray(req.body.permissions) && typeof req.body.permissions !== 'string') {
    return res.status(400).json({ message: 'permissions must be an array or JSON string' });
  }

  next();
};

const attachUser = (req, res, next) => {
  let userId = req.get('x-user-id') || req.get('X-User-Id');
  if (userId) {
    userId = userId.toString().trim();
    if ((userId.startsWith('"') && userId.endsWith('"')) || (userId.startsWith("'") && userId.endsWith("'"))) {
      userId = userId.slice(1, -1).trim();
    }
    req.user = { id: userId };
  }
  next();
};

module.exports = {
  logger,
  requireApiKey,
  validatePermissionsBody,
  attachUser,
};
