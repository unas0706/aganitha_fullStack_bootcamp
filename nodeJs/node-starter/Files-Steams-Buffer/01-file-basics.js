import fs from "fs/promises";
import path from "path";

const file = path.join(process.cwd(), "hello.txt");
console.log("File path:", file);

await fs.writeFile(file, "Hello, Node.js\n");

await fs.appendFile(file, "Appended line\n");

const content = await fs.readFile(file, "utf8");
console.log(content);

try {
  await fs.access(file);
  console.log("File exists");
} catch {
  console.log("File missing");
}

await fs.unlink(file);
