import fs from "fs";

const FILE = "big.txt";
let chunkCount = 0;

const stream = fs.createReadStream(FILE, { highWaterMark: 1 * 1024 });

stream.on("data", (chunk) => {
  chunkCount++;
  console.log("Chunk size:", chunk.length);
});

stream.on("end", () => {
  console.log("done");
  console.log("Total chunks:", chunkCount);
});

stream.on("error", (err) => {
  console.error("Stream error:", err.message);
});
