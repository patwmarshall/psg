// src/worker/index.ts
import { Hono } from "hono";

type Game = { id: string; name: string; owner: string; holder: string };

const app = new Hono();

// In-memory store (NOT persistent across deploys). For production use KV or Durable Objects.
const games = new Map<string, Game>();

function makeId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

// Seed data
games.set("g1", { id: "g1", name: "Catan", owner: "Alice", holder: "Bob" });
games.set("g2", { id: "g2", name: "Pandemic", owner: "Carol", holder: "Carol" });

app.get("/api/games", (c) => {
  return c.json(Array.from(games.values()));
});

app.post("/api/games", async (c) => {
  const body = (await c.req.json()) as Partial<Game>;
  const id = makeId();
  const g: Game = { id, name: body.name || "", owner: body.owner || "", holder: body.holder || "" };
  games.set(id, g);
  return c.json(g, 201);
});

app.put("/api/games/:id", async (c) => {
  const id = c.req.param("id");
  if (!games.has(id)) return c.text("Not found", 404);
  const body = (await c.req.json()) as Partial<Game>;
  const existing = games.get(id)!;
  const updated: Game = {
    ...existing,
    name: body.name ?? existing.name,
    owner: body.owner ?? existing.owner,
    holder: body.holder ?? existing.holder,
  };
  games.set(id, updated);
  return c.json(updated);
});

app.delete("/api/games/:id", (c) => {
  const id = c.req.param("id");
  if (!games.has(id)) return c.text("Not found", 404);
  games.delete(id);
  return new Response(null, { status: 204 });
});

app.post("/api/games/:id/transfer", async (c) => {
  const id = c.req.param("id");
  if (!games.has(id)) return c.text("Not found", 404);
  const { holder } = (await c.req.json()) as { holder?: string };
  const existing = games.get(id)!;
  const updated = { ...existing, holder: holder ?? existing.holder };
  games.set(id, updated);
  return c.json(updated);
});

export default app;
