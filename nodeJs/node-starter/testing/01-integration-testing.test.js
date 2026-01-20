// Drill Set 1 — Integration Testing Basics
// Run with: npm run test  OR  npm run test:watch

import express from "express";
import request from "supertest";
import { describe, it, expect } from "vitest";

/* -------------------------
   Express App (in-process)
-------------------------- */
function createApp() {
  const app = express();

  app.get("/ping", (req, res) => {
    res.json({ ok: true });
  });

  return app;
}

// describe("Integration Testing Basics", () => {
//   it("GET /ping → { ok: true }", async () => {
//     const app = createApp();

//     const res = await request(app).get("/ping");

//     expect(res.status).toBe(200);
//     expect(res.body).toEqual({ ok: true });
//   });

//   it("failing test example (intentional)", async () => {
//     const app = createApp();

//     const res = await request(app).get("/ping");

//     // This is intentionally wrong to confirm Vitest failure output
//     expect(res.body.ok).toBe(false);
//   });
// });

it("GET /ping → { ok: true }", async () => {
  const app = createApp();

  const res = await request(app).get("/ping");

  expect(res.status).toBe(200);
  expect(res.body).toEqual({ ok: true });
});
