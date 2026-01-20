import { EventEmitter } from "events";

const emitter = new EventEmitter();

function listenerOne(data) {
  console.log("Listener One:", data);
}

function listenerTwo(data) {
  console.log("Listener Two:", data);
}

emitter.on("message", listenerOne);
emitter.on("message", listenerTwo);

emitter.emit("message", "Hello Events");

emitter.off("message", listenerOne);

emitter.emit("message", "After removal");
