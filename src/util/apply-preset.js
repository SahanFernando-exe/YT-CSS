import index from "../modules/index.js";


export async function applyPreset(preset) {
  // This function assumes the preset is already active

  try {
    // adds preset to the window context
    injectPreset(preset.features);


    injectStyle("source/YT.css");

    // apply features
    await applyFeatures(preset.features, index);

    //injectScript("source/YT.js");
    applyVariables(preset.variables);

    console.log("PRESET", preset)

  } catch (error) {
    console.error("Error while applying preset logic:", error);
  }
}


function injectPreset(config) {
  const script = document.createElement("script");
  script.textContent = `window.YTK_CONFIG = ${JSON.stringify(config)};`;
  script.setAttribute("data-extension-script", "true");
  document.documentElement.appendChild(script);
  script.remove();
}


async function applyFeatures(features, index) {
  console.log("apply:  ", features, index)
  try{
    for (const [featureKey, featureValue] of Object.entries(features)) {
      if (!featureValue.enabled) continue;

      const indexEntry = index[featureKey];
      if (!indexEntry) {
        console.error(`Feature "${featureKey}" not found in index`);
        continue;
      }

      // Inject top-level styles/scripts
      if (indexEntry.styles) {
        for (const style of indexEntry.styles) injectStyle(style);
      }

      if (indexEntry.scripts) {
        for (const script of indexEntry.scripts) loadScript(script);
      }

      // Recurse into subfeatures
      console.log("kshjabshjbdjkfdbscv", featureKey, features)
      if (features[featureKey].sub) {
        console.log("recurse", features[featureKey].sub, indexEntry)
        await applyFeatures(features[featureKey].sub, indexEntry);
      }
    }

  } catch {
    console.error("preset - index mismatch", featureKey, featureValue, indexEntry)
  }
}


function injectStyle(file) {
  const id = `YTK-style-${file}`;
  if (document.getElementById(id)) {
    console.log("aborted CSS inject", id);
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = browser.runtime.getURL(`modules/${file}`);
  link.id = id;
  link.onload = () => {
    console.log("loaded CSS:", id);
  };
  document.head.appendChild(link);
  console.log("created style:", id);
}


function injectScript(file) {
  const id = `YTK-script-${file}`;
  if (document.getElementById(id)) {
    console.warn("aborted JS inject:", id);
    return;
  }

  const script = document.createElement("script");
  script.src = browser.runtime.getURL(`modules/${file}`);
  script.setAttribute("data-extension-script", "true");
  script.id = id;
  script.defer = true;
  script.type = "module";
  script.onload = () => {
    console.log("loaded JS:", id);
  };
  document.head.appendChild(script);
  console.log("created script:", id);
}

async function loadScript(file) {
  try {
  const { script } = await import(browser.runtime.getURL(`modules/${file}`));
  console.log(`loaded script ${file}`);
  script();
  }
  catch (error) {
    console.error(`could not load script: ${file}, ran into error:`, error);
  }
}


function applyVariables(vars = {}) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
  console.log("variables applied");
}