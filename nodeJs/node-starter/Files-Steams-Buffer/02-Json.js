import fs from "fs/promises";

const data = { name: "Node", version: 20 };
await fs.writeFile("data.json", JSON.stringify(data));

const raw = await fs.readFile("data.json", "utf8");
const parsed = JSON.parse(raw);

async function loadJSON(file, defaults = {}) {
  try {
    const raw = await fs.readFile(file, "utf8");
    return JSON.parse(raw);
  } catch {
    return defaults;
  }
}
const config = await loadJSON("data.json", { debug: true });
console.log("Config:", config);
