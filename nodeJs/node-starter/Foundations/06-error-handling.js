function divide(a, b) {
  if (b === 0) {
    throw new Error("Division by zero is not allowed");
  }
  return a / b;
}

try {
  console.log("Result:", divide(10, 0));
} catch (err) {
  console.error("Caught sync error:", err.message);
}

function fetchData() {
  return new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error("Failed to fetch data"));
    }, 500);
  });
}

fetchData()
  .then((data) => {
    console.log("Data:", data);
  })
  .catch((err) => {
    console.error("Promise rejected:", err.message);
  });

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection:", reason);

  process.exit(1);
});

throw new Error("Boom! Uncaught sync error");

Promise.reject("Boom! Unhandled rejection");
