import { createReadStream } from "node:fs";
import readline from "node:readline";
import { prisma } from "../src/db";

const path = process.argv[2] || "./backup.jsonl";

async function run() {
  const rl = readline.createInterface({ input: createReadStream(path, { encoding: "utf-8" }) });

  const groups: any[] = [];
  const users: any[] = [];
  for await (const line of rl) {
    if (!line.trim()) continue;
    const rec = JSON.parse(line);
    if (rec.type === "group") groups.push(rec.data);
    if (rec.type === "user") users.push(rec.data);
  }

  await prisma.$transaction([
    prisma.user.deleteMany(),
    prisma.group.deleteMany()
  ]);

  await prisma.group.createMany({ data: groups.map(({ id, name }) => ({ id, name })) });
  await prisma.user.createMany({
    data: users.map(({ id, email, firstName, lastName, phone, groupId, createdAt }) => ({
      id,
      email,
      firstName,
      lastName,
      phone,
      groupId,
      createdAt: new Date(createdAt)
    }))
  });

  console.log(`Restored ${groups.length} groups and ${users.length} users`);
}

run().finally(() => prisma.$disconnect());
