const repo = require('./products.repository');
const HttpError = require('../../shared/httpError');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient(); 

exports.list = async () => repo.findAll();

exports.getById = async (id) => {
  if (!Number.isInteger(id)) throw new HttpError(400, 'Invalid ID');

  const product = await repo.findById(id);
  if (!product) throw new HttpError(404, 'Product not found');
  return product;
};

exports.create = async (data) => {
  if (!data.name || !data.slug)
    throw new HttpError(400, 'Missing fields');

  // validar tipos
  if (data.price && isNaN(Number(data.price)))
    throw new HttpError(400, 'Price must be a number');

  if (data.stock && isNaN(Number(data.stock)))
    throw new HttpError(400, 'Stock must be a number');

  // sanitizar
  data.price = Number(data.price);
  data.stock = Number(data.stock || 0);

  const exists = await repo.findBySlug(data.slug);
  if (exists)
    throw new HttpError(400, 'Slug already exists');

  return repo.create(data);
};

exports.update = async (id, data) => {
  if (!Number.isInteger(id)) throw new HttpError(400, 'Invalid ID');

  const exists = await repo.findById(id);
  if (!exists) throw new HttpError(404, 'Product not found');

  if (data.price && isNaN(Number(data.price)))
    throw new HttpError(400, 'Price must be a number');

  if (data.stock && isNaN(Number(data.stock)))
    throw new HttpError(400, 'Stock must be a number');

  if (data.price) data.price = Number(data.price);
  if (data.stock) data.stock = Number(data.stock);

  return repo.update(id, data);
};

exports.remove = async (id) => {
  if (!Number.isInteger(id)) throw new HttpError(400, 'Invalid ID');

  const deleted = await repo.remove(id);
  if (!deleted)
    throw new HttpError(404, 'Product not found');
  return deleted;
};

exports.recordView = async (id, meta) => {
  const exists = await repo.findById(id);
  if (!exists) return; 

  await repo.incrementView(id);

  await prisma.productView.create({
    data: {
      productId: id,
      meta
    }
  });
};
