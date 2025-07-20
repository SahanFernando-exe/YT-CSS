globalThis.storage ??= globalThis?.chrome?.storage || globalThis?.browser?.storage;

export async function getPresetData(name) {
  try {
    const data = await storage.local.get("presets");
    return data.presets[name];
  } catch (err) {
    console.error(`Error loading preset "${name}":`, err);
    return null;
  }
}