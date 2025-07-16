export async function applyPreset(preset) {
  // This function assumes the preset is already active

  try {
    // adds preset to the window context
    injectPreset(preset.features);


    // apply features
    await applyFeatures(preset.features);


    injectStyle("modules/source/YT");
    injectScript("modules/source/YT");
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

async function applyFeatures(features, dir = "modules") {
  for (const [key, value] of Object.entries(features)) {
    const path = `${dir}/${key}`;

    // if feature exists and not set to false
    if (value) {
      if (key == "enabled" && value == false) continue;
      // if feature has subfeatures recurse
      if(typeof value === "object" && value.enabled) {
        applyFeatures(value, path)
      }
      // skip if null
      if (value === null || value === undefined) continue;
      
      // apply feature
      injectStyle(`${path}/${key}`);
      injectScript(`${path}/${key}`);
    }
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
  link.href = browser.runtime.getURL(`${file}.css`);
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
    console.log("aborted JS inject:", id);
    return;
  }

  const script = document.createElement("script");
  script.src = browser.runtime.getURL(`${file}.js`);
  script.setAttribute("data-extension-script", "true");
  script.id = id;
  script.defer = true;
  script.onload = () => {
    console.log("loaded JS:", id);
  };
  document.head.appendChild(script);
  console.log("created script:", id);
}

function applyVariables(vars = {}) {
  const root = document.documentElement;
  for (const [key, value] of Object.entries(vars)) {
    root.style.setProperty(key, value);
  }
  console.log("variables applied");
}