type Status = "loading" | "success" | "error";

function handle(status: Status): void {
  switch (status) {
    case "loading":
      console.log("Loading...");
      break;

    case "success":
      console.log("Operation successful");
      break;

    case "error":
      console.error("Something went wrong");
      break;

    default:
      const _exhaustive: never = status;
      throw new Error(`Unhandled status: ${_exhaustive}`);
  }
}

// type Status = "loading" | "success" | "error" | "idle";
