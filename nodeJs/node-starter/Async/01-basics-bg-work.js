import express from "express";

const app = express();
app.use(express.json());

const emailQueue = [];
let isProcessing = false;
let shuttingDown = false;

function sendFakeEmail(job) {
  return new Promise((resolve) => {
    console.log(`📧 Sending email to ${job.to}`);
    setTimeout(() => {
      console.log(`✅ Email sent to ${job.to}`);
      resolve();
    }, 500);
  });
}

async function worker() {
  if (isProcessing || shuttingDown) return;
  if (emailQueue.length === 0) return;

  const job = emailQueue.shift();
  isProcessing = true;

  console.log(`▶️ Job started: ${job.id}`);

  await sendFakeEmail(job);

  console.log(`🏁 Job completed: ${job.id}`);

  isProcessing = false;
}
const workerInterval = setInterval(worker, 1000);

app.post("/email", (req, res) => {
  if (shuttingDown) {
    return res.status(503).json({
      message: "Server is shutting down, try again later",
    });
  }

  const { to, subject } = req.body;

  const job = {
    id: Date.now(),
    to,
    subject,
  };

  emailQueue.push(job);

  console.log(`📥 Job queued: ${job.id}`);

  res.status(202).json({
    message: "Email job queued",
    jobId: job.id,
  });
});

async function shutdown(signal) {
  console.log(`\nReceived ${signal}. Shutting down gracefully...`);
  shuttingDown = true;

  clearInterval(workerInterval);

  const check = setInterval(() => {
    if (!isProcessing) {
      console.log("🛑 All jobs finished. Exiting.");
      clearInterval(check);
      process.exit(0);
    }
  }, 100);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

const server = app.listen(3000, () => {
  console.log(" Server running on http://localhost:3000");
});
