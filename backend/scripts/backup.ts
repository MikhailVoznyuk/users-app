import { createWriteStream } from "node:fs";
import { prisma } from "../src/db";

const path = process.argv[2] || "./backup.jsonl";

async function run() {
  const ws = createWriteStream(path, { encoding: "utf-8" });
  const groups = await prisma.group.findMany();
  const users = await prisma.user.findMany();

  for (const g of groups) ws.write(JSON.stringify({ type: "group", data: g }) + "\n");
  for (const u of users) ws.write(JSON.stringify({ type: "user", data: u }) + "\n");
  ws.end();
  console.log(`Backup written to ${path}`);
}

run().finally(() => prisma.$disconnect());
