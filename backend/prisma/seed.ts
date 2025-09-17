import { PrismaClient } from "@prisma/client";
import { faker } from "@faker-js/faker";

const prisma = new PrismaClient();
const GROUPS = ["Руководство", "Бухгалтерия", "Отдел кадров", "Разработка", "Продажи"];

async function main() {
  await prisma.user.deleteMany();
  await prisma.group.deleteMany();

  const groups = await Promise.all(
    GROUPS.map((name) => prisma.group.upsert({ where: { name }, update: {}, create: { name } }))
  );

  const users = Array.from({ length: 320 }).map(() => {
    const hasGroup = Math.random() < 0.85;
    const g = hasGroup ? groups[Math.floor(Math.random() * groups.length)] : null;
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    return {
      email: faker.internet.email({ firstName, lastName }).toLowerCase(),
      firstName,
      lastName,
      phone: `+7 ${faker.string.numeric(3)} ${faker.string.numeric(3)}-${faker.string.numeric(2)}-${faker.string.numeric(2)}`,
      groupId: g?.id ?? null
    };
  });

  await prisma.user.createMany({ data: users });
  console.log("Seeded:", users.length, "users and", groups.length, "groups");
}

main().finally(() => prisma.$disconnect());
