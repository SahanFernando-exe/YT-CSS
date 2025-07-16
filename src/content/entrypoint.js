// entrypoint.js
console.log("YTK - ENTRY");

async function ensureStorageDefaults() {
  console.log("checking storage");
  const data = await browser.storage.local.get(["enabled", "preset"]);
  if (data.enabled === undefined || data.preset === undefined) {
    console.log("reseting storage")
    const defaultConfigUrl = browser.runtime.getURL("src/system/config.json");
    const res = await fetch(defaultConfigUrl);
    const defaults = await res.json();
    await browser.storage.local.set(defaults);
  }
}

(async () => {
  // Import utils
  const { applyPreset } = await import(browser.runtime.getURL("src/util/apply-preset.js"));
  const { getPresetData } = await import(browser.runtime.getURL("src/util/get-preset-data.js"));

  // Create browser storage config if not exist.
  await ensureStorageDefaults();

  const { enabled, preset } = await browser.storage.local.get(["enabled", "preset"]);
  if (enabled) {
    console.log("applying", preset);
    const presetData = await getPresetData(preset);
    console.log(presetData);
    await applyPreset(presetData);
  };

})();