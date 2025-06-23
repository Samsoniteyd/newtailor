const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data: {
      email: 'test@example.com',
      name: 'Test User',
    },
  });
  console.log(user);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
