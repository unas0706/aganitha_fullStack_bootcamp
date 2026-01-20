const buf = Buffer.from("hello");
console.log("Buffer:", buf);

console.log("String:", buf.toString("utf8"));

const base64 = buf.toString("base64");
console.log("Base64:", base64);

const filled = Buffer.alloc(2, 0xee);
console.log("Allocated:", filled);

const emoji = "😀";
console.log("String length:", emoji.length);
console.log("Buffer length:", Buffer.from(emoji).length);
