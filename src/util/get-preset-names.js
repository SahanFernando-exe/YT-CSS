globalThis.storage ??= globalThis?.chrome?.storage || globalThis?.browser?.storage;

export async function getPresetNames() {
  try {
    const data = await storage.local.get("presets");
    const names = [];
    for (const [key, value] of Object.entries(data.presets)) {
      names.push(key);
    }
    return names;
  } catch (err) {
    console.error("Error loading preset names:", err);
    return [];
  }
}