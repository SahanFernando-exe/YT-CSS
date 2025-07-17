export async function getPresetData(name) {
  try {
    const data = await browser.storage.local.get("presets");
    return data.presets[name];
  } catch (err) {
    console.error(`Error loading preset "${name}":`, err);
    return null;
  }
}