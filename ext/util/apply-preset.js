export async function applyPreset(preset) {
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

    console.log("PRESET", preset)

  } catch (error) {
    console.error("Error while applying preset logic:", error);
  }
}

function injectStyle(file) {
  const id = `YTK-style-${file}`;
  if (document.getElementById(id)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = browser.runtime.getURL(`src/css/${file}`);
  link.id = id;
  document.head.appendChild(link);
  console.log("styles applied");
}

function injectScript(file) {
  const id = `YTK-script-${file}`;
  if (document.getElementById(id)) return;

  const script = document.createElement("script");
  script.src = browser.runtime.getURL(`src/js/${file}`);
  script.setAttribute("data-extension-script", "true");
  script.id = id;
  script.defer = true; // optional: ensures it waits for DOM to be parsed
  document.head.appendChild(script);
  console.log("scripts applied");
}

function applyVariables(vars = {}) {
	console.log("variables applied", vars);
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
}