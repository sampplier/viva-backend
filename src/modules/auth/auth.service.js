const prisma = require('../../prisma/prisma');
const hashUtil = require('../../utils/hash');
const jwt = require('jsonwebtoken');

async function register({ email, password, name }) {
  // Verifica se já existe
  const exists = await prisma.user.findUnique({
    where: { email }
  });

  if (exists) {
    throw { status: 400, message: 'Email already registered' };
  }

  // Criptografa senha
  const hashed = await hashUtil.hash(password);

  // Cria usuário
  const user = await prisma.user.create({
    data: {
      email,
      password: hashed,
      name,
      role: 'USER' 
    },
    select: { id: true, email: true, name: true }
  });

  return user;
}

async function login({ email, password }) {
  // Busca usuário
  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw { status: 400, message: 'Invalid credentials' };
  }

  // Compara senhas
  const passwordMatch = await hashUtil.compare(password, user.password);

  if (!passwordMatch) {
    throw { status: 400, message: 'Invalid credentials' };
  }

  // Gera token
  const token = jwt.sign(
    {
      sub: user.id,
      role: user.role
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN || '7d'
    }
  );

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
}

module.exports = { register, login };
