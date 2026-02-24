const jwt = require('jsonwebtoken');
const prisma = require('../prisma/prisma'); // usa client global

module.exports = async function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader)
      return res.status(401).json({ error: 'Token not provided' });

    const parts = authHeader.split(' ');

    if (parts.length !== 2)
      return res.status(401).json({ error: 'Token format invalid' });

    const [scheme, token] = parts;

    if (!/^Bearer$/i.test(scheme))
      return res.status(401).json({ error: 'Token malformatted' });

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        error: error.name === "TokenExpiredError"
          ? "Token expired"
          : "Token invalid"
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.sub },
      select: { id: true, email: true, role: true }
    });

    if (!user)
      return res.status(401).json({ error: 'User does not exist' });

    req.user = user;

    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    return res.status(500).json({ error: "Authentication internal error" });
  }
};
