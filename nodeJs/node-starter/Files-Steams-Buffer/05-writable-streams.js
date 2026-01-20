import fs from "fs";

const stream = fs.createWriteStream("output.log");

let i = 0;

function write() {
  while (i < 1000) {
    stream.write(`Line ${i}\n`);
    i++;
  }
  stream.end();
}

stream.on("finish", () => {
  console.log("All data written");
});

write();
