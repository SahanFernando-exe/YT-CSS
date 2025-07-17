import { getPresetNames } from "../../util/get-preset-names.js";


const enableToggle = document.getElementById("enableToggle");
const searchInput = document.getElementById("searchInput");
const container = document.getElementById("presetContainer");

let allPresets = [];

async function initPopup() {
  const { enabled = true, preset = "default" } = await browser.storage.local.get(["enabled", "preset"]);
  enableToggle.checked = enabled;

  allPresets = await getPresetNames();
  renderPresets(allPresets, preset);

  if (allPresets.length > 6) {
    searchInput.style.visibility = "visible";
  }
}

initPopup();

// Toggle enable/disable
enableToggle.addEventListener("change", () => {
  browser.storage.local.set({ enabled: enableToggle.checked });
  reloadYT();
});

// Render preset cards
function renderPresets(list, selectedPreset) {
  container.innerHTML = "";
  list.forEach(name => {
    const card = document.createElement("div");
    card.className = "preset-card" + (name === selectedPreset ? " selected" : "");
    card.textContent = name;
    card.dataset.name = name;

    //card click
    card.addEventListener("click", async () => {
      await browser.storage.local.set({ preset: name });
      highlightActiveCard(name);
      reloadYT();
    });

    container.appendChild(card);
  });
}

// Highlight selected card
function highlightActiveCard(name) {
  document.querySelectorAll(".preset-card").forEach(c => {
    c.classList.toggle("selected", c.dataset.name === name);
  });
}

// Search filter
searchInput.addEventListener("input", async () => {
  const query = searchInput.value.toLowerCase();
  const filtered = allPresets.filter(p => p.toLowerCase().includes(query));
  const { preset: current } = await browser.storage.local.get("preset");
  renderPresets(filtered, current);
});


async function reloadYT() {
  const tabs = await browser.tabs.query({ active: true, currentWindow: true });
  const ytTab = tabs.find(tab => tab.url.includes("youtube.com"));
  if (ytTab?.id) {
    await browser.tabs.reload(ytTab.id);
  }
}