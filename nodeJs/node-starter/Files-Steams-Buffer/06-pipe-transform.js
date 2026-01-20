import fs from "fs";
import { Transform } from "stream";

const upperCaseTransform = new Transform({
  transform(chunk, encoding, callback) {
    callback(null, chunk.toString().toUpperCase());
  },
});

fs.createReadStream("big.txt")
  .pipe(upperCaseTransform)
  .pipe(fs.createWriteStream("output.txt"))
  .on("finish", () => {
    console.timeEnd("stream-copy");
    console.log("Pipeline finished");
  });
