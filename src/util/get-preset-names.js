export async function getPresetNames() {
  const url = browser.runtime.getURL("src/system/preset-index.json");

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Could not load preset list.");
    return await res.json();
  } catch (err) {
    console.error("Error loading preset names:", err);
    return [];
  }
}