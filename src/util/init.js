import { getPresetData } from "./get-preset-data.js";
import { getURL } from "./runtime.js";

globalThis.storage ??= globalThis?.chrome?.storage || globalThis?.browser?.storage;

export async function resetStorage() {
  	console.log("checking storage");
  	const data = await storage.local.get(["enabled", "presets", "preset"]);

	if (data.presets === undefined) {
    	console.log("reseting presets")
    	const presets = {};
    	const presetNames = ["default", "custom"]
    	for (const name of presetNames) {
    		const url = getURL(`presets/${name}.json`);
    		const res = await fetch(url);
    		presets[name] = await res.json();
    	}
    	console.log(presets);
    	await storage.local.set({presets});
  	}

	if (data.enabled === undefined || data.preset === undefined) {
    	console.log("set preset")
		if (await getPresetData("default")) {
			await storage.local.set({enabled: true});
			await storage.local.set({preset: "default"});
		} else {
    		await storage.local.set({enabled: false});
		}
	}
}