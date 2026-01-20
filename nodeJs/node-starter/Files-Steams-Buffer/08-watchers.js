import fs from "fs";

let debounceTimer;

const watcher = fs.watch("watch.txt", (event, filename) => {
  if (event === "rename") {
    console.log("File renamed");
    return;
  }

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    console.log("File modified");
  }, 200);
});

setTimeout(() => {
  watcher.close();
  console.log("Stopped watching");
}, 30_000);
