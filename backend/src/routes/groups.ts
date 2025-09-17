import { Router } from "express";
import { prisma } from "../db";

export const groups = Router();

groups.get("/", async (_req, res) => {
  const items = await prisma.group.findMany({ orderBy: { name: "asc" } });
  res.json(items);
});

export default groups;
