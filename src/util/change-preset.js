import { applyPreset } from "./apply-preset.js";
import { getPresetData } from "./get-preset-data.js";

export async function changePreset(name) {
  try {
		// Get preset
		const presetData = getPresetData(name);

    // Validate structure
    if (!presetData || typeof presetData !== "object") {
      throw new Error(`Preset "${name}" is not valid JSON.`);
    }

		// Apply preset
		await applyPreset(presetData);

    // Save as active preset
    await browser.storage.local.set({ enabled: name });

		// Log success
    console.log(`Preset "${name}" applied successfully.`);
    return presetData;

  } catch (error) {
    console.error(`Failed to load preset "${name}":`, error);
  }
}