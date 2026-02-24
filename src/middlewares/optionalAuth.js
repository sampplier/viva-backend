const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth) return next();
    const parts = auth.split(' ');
    if (parts.length !== 2) return next();
    const [scheme, token] = parts;
    if (!/^Bearer$/i.test(scheme)) return next();
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.sub } });
    if (!user) return next();
    req.user = { id: user.id, email: user.email, role: user.role };
    next();
  } catch (err) {
    return next();
  }
};