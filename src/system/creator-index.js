import { DropSelect } from "./controllers/DropSelect.js";
import { SliderFloat } from "./controllers/SliderFloat.js";
import { SliderInt } from "./controllers/SliderInt.js";
import { Toggle } from "./controllers/Toggler.js";


class Setting {
  constructor({ label, disableable = false, tooltip = null, setting = null, subsettings = {} }) {
    this.label = label;
    this.disableable = disableable;
    this.tooltip = tooltip;
    this.setting = setting;
    this.subsettings = subsettings;
  }

  map() {
    var key = this.label
    let data = {}
    if (this.setting) {
      if (this.setting.constructor.name === "OptionableSetting") {
        data["options"] = this.setting.map()
      }
      data["_value"] = this.setting.constructor.name
    }
    if (this.disableable) {
      data["enabled"] = "UNSET"
    }
    Object.keys(this.subsettings).forEach(key => {
      data[key] = this.subsettings[key].map()
    });
    return data
  }

  render(data) {
    console.log("Render data:", data);
    let subsettingsHTML = '';

    if (this.setting && typeof this.setting === OptionableSetting) {
      console.log("Rendering OptionableSetting:", this.setting);
      subsettingsHTML += this.setting.getSettings().array.forEach(element => {
        element.render();
      });;
    }

    try {
      return `
        <div class="setting">
          <div class="setting-header">

            <div class="setting-disable">
              ${this.disableable ? `<input type="checkbox" ${data.enabled ? `checked` : '' } class="setting-disable"}>`: ''}
            </div>

            <div class="setting-info">
              ${this.tooltip ? `<span class="tooltip">${this.tooltip}</span>` : ''}
            </div>

            <span class="setting-label">${this.label}</span>

            <div class="setting-control">
              ${this.setting ? this.setting.render(data.value) : ''}
            </div>
          </div>

          <div class="subsettings">
            ${subsettingsHTML}
            ${Object.entries(this.subsettings).map(([key, subset]) => {
              console.log("Rendering subset:", key, data.subsettings[key]);
              // Get the data for this specific subsetting
              const subData = data.subsettings[key];
              return subset.render(subData);
            }).join('')}
          </div>
        </div>
      `;
    } catch (error) {
      console.error("Error rendering setting:", error);
    }
  }
}

class OptionableSetting {
  constructor(settings) {
    this.type = "OPTIONABLE";
    this.settings = settings;
  }

  map() {
    let data = {}
    Object.keys(this.settings).forEach(key => {
      data[key] = {}
      Object.keys(this.settings[key]).forEach(key2 => {
        data[key][key2] = this.settings[key][key2].map()
      });
    });
    return data
  }

  render(value) {
    console.log("Rendering OptionableSetting with settings:", this.settings);
    return `
      <select class="option-select">
        ${Object.keys(this.settings).map(option => `<option value="${option}">${option}</option>`).join('')}
      </select>
    `;
  }

  getSettings() {
    return Object.values(this.settings).map(setting => Object.values(setting).map(sub => sub.render()).join('')).join('');
  }
}

// class Toggle {
//   constructor() {
//     this.set; // bool
//   }

//   render() {
//     return `
//       <label class="toggle-switch">
//         <input type="checkbox" ${this.set ? 'checked' : ''}>
//         <span class="toggle-slider"></span>
//       </label>
//     `;
//   }
// }

// class SliderInt {
//   constructor({ min = 0, max = 10 }) {
//     this.set; // int
//     this.min = min;
//     this.max = max;
//   }

//   render() {
//     return `
//       <div class="slider-container">
//         <input type="range" min="${this.min}" max="${this.max}" value="${this.set || this.min}" class="slider">
//         <span class="slider-value">${this.set || this.min}</span>
//       </div>
//     `;
//   }
// }

// class SliderFloat {
//   constructor({ min = 0, max = 10 }) {
//     this.set; // float
//     this.min = min;
//     this.max = max;
//   }

//   render() {
//     return `
//       <input type="range" min="${this.min}" max="${this.max}" value="${this.set || this.min}" step="0.01" class="slider">
//       <span class="slider-value">${this.set || this.min}</span>
//     `;
//   }
// }

// class DropSelect {
//   constructor({ options = ["unselected"] }) {
//     this.set; // string or maybe index?
//     this.options = options;
//   }

//   render() {
//     return `
//       <select class="drop-select">
//         ${this.options.map(option => `<option value="${option}" ${this.set === option ? 'selected' : ''}>${option}</option>`).join('')}
//       </select>
//     `;
//   }
// }

// Configuration with explicit parameter names
export default new Setting({
  label: "Settings",
  subsettings: {
    hide_ads: new Setting({
      label: "Hide Ads",
      tooltip: "hides banner ads",
      setting: new Toggle()
    }),

    related_section: new Setting({
      label: "Related Section",

      subsettings: {
        width_type: new Setting({
          label: "Width",
          tooltip: "sets the width of the related section",
          
          setting: new OptionableSetting({
						constant: {
							width: new Setting({
								label: "width",
								tooltip: "width of the related section",
								setting: new SliderInt({ min: 200, max: 600 })
							})
						},
						dynamic: {
							min_width: new Setting({
								label: "min-width",
								tooltip: "minimum width of the related section",
								setting: new SliderInt({ min: 200, max: 600 })
							}),
							max_width: new Setting({
								label: "max-width",
								tooltip: "maximum width of the related section",
								setting: new SliderInt({ min: 200, max: 600 })
							})
						}
          })
        }),

        remove_extras: new Setting({
          label: "Remove Extras",
          disableable: true,
          subsettings: {
            keep_shorts: new Setting({
              label: "keep-shorts",
              setting: new Toggle()
            })
          }
        })
      }
    }),

    dynamic_player: new Setting({
      label: "Dynamic Player",
      setting: new Toggle(),
      subsettings: {
        min_height: new Setting({
          label: "Min Height",
          setting: new SliderInt({ min: 0, max: 1000 })
        }),
        sticky: new Setting({
          label: "Sticky",
          setting: new Toggle()
        })
      }
    })
  }
});