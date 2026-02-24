const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash('password123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@vivamoveis.com' },
    update: {},
    create: {
      email: 'admin@vivamoveis.com',
      name: 'Admin Viva',
      password,
      role: 'ADMIN'
    }
  });

  await prisma.product.createMany({
    data: [
      { name: 'Sofá Viva 2 lugares', slug: 'sofa-viva-2', description: 'Sofá confortável', price: 899.9, stock: 5 },
      { name: 'Cadeira Moderna', slug: 'cadeira-moderna', description: 'Cadeira em madeira', price: 199.9, stock: 12 },
      { name: 'Mesa de Jantar', slug: 'mesa-jantar', description: 'Mesa 4 lugares', price: 499.9, stock: 3 }
    ],
    skipDuplicates: true
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });