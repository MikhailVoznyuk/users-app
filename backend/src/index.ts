import express from "express";
import cors from "cors";
import morgan from "morgan";
import users from "./routes/users";
import groups from "./routes/groups";
import { prisma } from "./db";

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => res.json({ ok: true }));
app.use("/api/users", users);
app.use("/api/groups", groups);

const port = Number(process.env.PORT || 4000);

async function start() {
  await prisma.$connect();
  app.listen(port, () => console.log(`API on :${port}`));
}

start().catch((e) => {
  console.error(e);
  process.exit(1);
});
