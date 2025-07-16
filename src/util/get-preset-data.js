export async function getPresetData(name) {
  const url = browser.runtime.getURL(`presets/${name}.json`);

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Preset "${name}" not found.`);
    return await res.json();
  } catch (err) {
    console.error(`Error loading preset "${name}":`, err);
    return null;
  }
}