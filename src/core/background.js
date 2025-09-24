import { resetStorage } from "../util/init.js";
import { presetmaker } from "../util/preset-factory.js";
//import pres from "/system/creator-index.js";
presetmaker();

console.log("background js active");
//console.log(pres);

globalThis.storage ??= globalThis?.chrome?.storage || globalThis?.browser?.storage;

resetStorage();