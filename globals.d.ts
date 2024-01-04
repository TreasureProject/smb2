// add godotEmitter to window
// import type { EventEmitter } from "eventemitter3";

interface Window {
  godotEmitter: import("eventemitter3").EventEmitter;
}
