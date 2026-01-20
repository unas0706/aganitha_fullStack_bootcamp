const users = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "user" },
  { id: 3, name: "Charlie", role: "user" },
];

function findAdmin(list) {
  debugger;
  return list.find((user) => user.role === "admin");
}

console.table(users);

const admin = findAdmin(users);
console.log("Admin user:", admin);

// function crash() {
//   throw new Error("🔥 Uncaught exception for debugging");
// }
// crash();
