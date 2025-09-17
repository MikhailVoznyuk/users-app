import { Prisma } from "@prisma/client";
import { Router } from "express";
import { prisma } from "../db";
import { z } from "zod";

export const users = Router();

const createUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  phone: z.string().optional(),
  groupId: z.number().int().nullable().optional()
});

const updateUserSchema = createUserSchema.partial();

users.get("/", async (req, res) => {
  const {
    q = "",
    sort = "createdAt",
    order = "desc",
    page = "1",
    pageSize = "20",
    groupId
  } = req.query as Record<string, string>;

  const take = Math.min(Math.max(parseInt(pageSize) || 20, 1), 100);
  const skip = Math.max(((parseInt(page) || 1) - 1) * take, 0);

  const where: Prisma.UserWhereInput = {
    AND: [
      q
        ? {
            OR: [
              { firstName: { contains: q, mode: "insensitive" } },
              { lastName:  { contains: q, mode: "insensitive" } },
              { email:     { contains: q, mode: "insensitive" } },
            ]
          }
        : {},
      groupId === "null"
        ? { groupId: null }
        : groupId
        ? { groupId: Number(groupId) }
        : {}
    ]
  };

  const allowedSorts = ["id","createdAt","lastName","firstName","email"];
  const sortField = allowedSorts.includes(sort) ? sort : "createdAt";

  const orderBy: Prisma.UserOrderByWithRelationInput[] = [
    { [sortField]: order === "asc" ? "asc" : "desc" }
  ];

  const [total, items] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({ where, orderBy, skip, take, include: { group: true } })
  ]);

  res.json({ total, items, page: Number(page), pageSize: take });
});

users.get("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const user = await prisma.user.findUnique({ where: { id }, include: { group: true } });
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

users.post("/", async (req, res) => {
  const parsed = createUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  const user = await prisma.user.create({ data: parsed.data });
  res.status(201).json(user);
});

users.patch("/:id", async (req, res) => {
  const id = Number(req.params.id);
  const parsed = updateUserSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json(parsed.error);
  try {
    const user = await prisma.user.update({ where: { id }, data: parsed.data });
    res.json(user);
  } catch {
    res.status(404).json({ message: "User not found" });
  }
});

export default users;
