const service = require('./products.service');

exports.list = async (req, res, next) => {
  try {
    const products = await service.list();
    res.json(products);
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new HttpError(400, 'Invalid ID');

    const p = await service.getById(id);

    service.recordView(id, { ip: req.ip }).catch(() => {});

    res.json(p);
  } catch (err) { next(err); }
};

exports.create = async (req, res, next) => {
  try {
    const newP = await service.create(req.body);
    res.status(201).json(newP);
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new HttpError(400, 'Invalid ID');

    const updated = await service.update(id, req.body);
    res.json(updated);
  } catch (err) { next(err); }
};

exports.remove = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) throw new HttpError(400, 'Invalid ID');

    await service.remove(id);
    res.status(200).json({ message: "Produto removido" });

  } catch (err) { next(err); }
};
