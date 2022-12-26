import { PrismaClient } from '@prisma/client';

// initialize Prisma Client
const prisma = new PrismaClient();

async function main() {
  // create dummy data
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {
      activated: true,
      roles: 'admin',
    },
    create: {
      name: 'Admin',
      email: 'admin@test.com',
      password: '123456',
    },
  });

  /* const user2 = await prisma.user.upsert({
    where: { email: 'test@test.com' },
    update: {},
    create: {
      name: 'Test',
      email: 'test@test.com',
      password: '123456',
      activated: false,
      roles: 'user',
    },
  }); */
  console.log({ user1 });
}

// execute the main function
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    // close Prisma Client at the end
    await prisma.$disconnect();
  });
