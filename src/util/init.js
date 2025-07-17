import { getPresetData } from "./get-preset-data.js";

export async function resetStorage() {
  	console.log("checking storage");
  	const data = await browser.storage.local.get(["enabled", "presets", "preset"]);

	if (data.presets === undefined) {
    	console.log("reseting presets")
    	const presets = {};
    	const presetNames = ["default", "custom"]
    	for (const name of presetNames) {
    		const url = browser.runtime.getURL(`presets/${name}.json`);
    		const res = await fetch(url);
    		presets[name] = await res.json();
    	}
    	console.log(presets);
    	await browser.storage.local.set({presets});
  	}

	if (data.enabled === undefined || data.preset === undefined) {
    	console.log("set preset")
		if (await getPresetData("default")) {
			await browser.storage.local.set({enabled: true});
			await browser.storage.local.set({preset: "default"});
		} else {
    		await browser.storage.local.set({enabled: false});
		}
	}
}