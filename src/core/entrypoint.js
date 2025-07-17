// entrypoint.js
console.log("YTK - ENTRY");

(async () => {
  // Import utils
  const { applyPreset } = await import(browser.runtime.getURL("util/apply-preset.js"));
  const { getPresetData } = await import(browser.runtime.getURL("util/get-preset-data.js"));

  const { enabled, preset } = await browser.storage.local.get(["enabled", "preset"]);
  if (enabled) {
    console.log("applying", preset);
    const presetData = await getPresetData(preset);
    await applyPreset(presetData);
  };
})();