import { resetStorage } from "../util/init.js";

console.log("background js active");
globalThis.storage ??= globalThis?.chrome?.storage || globalThis?.browser?.storage;



resetStorage();