import { resetStorage } from "../util/init.js";
//import pres from "/system/creator-index.js";

console.log("background js active");
//console.log(pres);

globalThis.storage ??= globalThis?.chrome?.storage || globalThis?.browser?.storage;

resetStorage();