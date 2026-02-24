const service = require('./auth.service');
const { registerSchema, loginSchema } = require('../../shared/validators');
const HttpError = require('../../shared/httpError');

exports.register = async (req, res, next) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    try {
      const result = await service.register(req.body);
      res.status(201).json(result);
    } catch (err) {

      // Prisma error unique constraint
      if (err.code === 'P2002') {
        return res.status(409).json({ error: 'Email already registered' });
      }

      throw err;
    }

  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const result = await service.login(req.body);
    res.json(result);

  } catch (err) { next(err); }
};
