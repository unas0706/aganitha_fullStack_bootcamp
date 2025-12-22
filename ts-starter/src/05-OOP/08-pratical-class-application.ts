class Logger {
  info(msg: string) {
    console.log("INFO:", msg);
  }
  warn(msg: string) {
    console.warn("WARN:", msg);
  }
  error(msg: string) {
    console.error("ERROR:", msg);
  }
}

class Timer {
  private startTime: number | null = null;
  private elapsed = 0;

  start() {
    this.startTime = Date.now();
  }

  stop() {
    if (this.startTime) {
      this.elapsed += Date.now() - this.startTime;
      this.startTime = null;
    }
  }

  reset() {
    this.elapsed = 0;
    this.startTime = null;
  }

  getElapsed() {
    return this.elapsed;
  }
}

class ValidationResult {
  constructor(public success: boolean, public errors: string[] = []) {}

  static ok() {
    return new ValidationResult(true);
  }

  static fail(...errors: string[]) {
    return new ValidationResult(false, errors);
  }
}
