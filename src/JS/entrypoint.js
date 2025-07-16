// entrypoint.js

async function ensureStorageDefaults() {
  const data = await browser.storage.local.get(["enabled", "preset"]);
  if (data.enabled === undefined || data.preset === undefined) {
    const defaultConfigUrl = browser.runtime.getURL("ext/system/config.json");
    const res = await fetch(defaultConfigUrl);
    const defaults = await res.json();
    await browser.storage.local.set(defaults);
  }
}

console.log("ENTRY");

(async () => {
  // ✅ Ensure defaults are set before using them
  await ensureStorageDefaults();

  const { enabled, preset } = await browser.storage.local.get(["enabled", "preset"]);
  if (!enabled) return;

  console.log(preset);

  // Load and apply preset logic (inject CSS modules)
  const url = browser.runtime.getURL(`presets/${preset}.json`);
  const res = await fetch(url);
  const presetData = await res.json();

  console.log(presetData);

  // Dynamically inject CSS based on preset
  await applyPreset(presetData);

  // Add more dynamic logic if needed
})();


// apply-preset.json
async function applyPreset(preset) {
  // 🚫 DO NOT call browser.storage.set() here
  // This function assumes the preset is already active

  try {
    // Example: conditionally inject styles
    if (preset.hide_ads) {
      injectStyle("hide-ads.css");
    }

    injectStyle("YT.css");
    injectScript("YT.js");
    applyVariables(preset.variables);

  } catch (error) {
    console.error("Error while applying preset logic:", error);
  }
}

function injectStyle(file) {
  const id = `YTK-style-${file}`;
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = browser.runtime.getURL(`src/CSS/${file}`);
  link.id = id;
  document.head.appendChild(link);
}

function injectScript(file) {
  const id = `YTK-script-${file}`;
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.src = browser.runtime.getURL(`src/JS/${file}`);
  script.setAttribute("data-extension-script", "true");
  script.id = id;
  script.defer = true; // optional: ensures it waits for DOM to be parsed
  document.head.appendChild(script);
}

function applyVariables(vars = {}) {
  console.log("var appplication in entry");
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}