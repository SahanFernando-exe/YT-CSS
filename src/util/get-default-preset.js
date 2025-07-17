export async function getDefaultPreset() {
  const url = browser.runtime.getURL(`presets/default.json`);
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Default preset not found.`);
    return await res.json();
  } catch (err) {
    console.error(`Error loading default preset:`, err);
    return null;
  }
}