const prisma = require('../../prisma/prisma');

exports.findAll = async () =>
  prisma.product.findMany({ orderBy: { createdAt: 'desc' } });

exports.findById = async (id) =>
  prisma.product.findUnique({ where: { id: Number(id) } });

exports.findBySlug = async (slug) =>
  prisma.product.findUnique({ where: { slug } });

exports.create = async (data) =>
  prisma.product.create({ data });

exports.update = async (id, data) =>
  prisma.product.update({ where: { id: Number(id) }, data });

exports.remove = async (id) => {
  id = Number(id);

  const exists = await prisma.product.findUnique({ where: { id } });
  if (!exists) return null;

  return prisma.product.delete({ where: { id } });
};

exports.incrementView = async (id) =>
  prisma.$executeRaw`UPDATE "Product" SET views = views + 1 WHERE id = ${id}`;
