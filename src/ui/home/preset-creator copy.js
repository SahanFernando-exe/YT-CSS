import presetConfig from '../../system/creator-index.js';

// Current preset data
let currentPreset = presetConfig;

// Initialize the form
document.addEventListener('DOMContentLoaded', function() {
    console.log("presetConfig", presetConfig);
    generateForm(presetConfig, 'formContainer');
    updatePreview();
    
    // Add event listeners to buttons
    document.getElementById('saveBtn').addEventListener('click', savePreset);
    document.getElementById('resetBtn').addEventListener('click', resetForm);
    document.getElementById('exportBtn').addEventListener('click', exportJSON);
});

// Generate the form from the configuration
function generateForm(config, containerId, path = '') {
    console.log("generateForm", config, containerId, path);
    const container = document.getElementById(containerId);
    
    for (const [key, value] of Object.entries(config)) {
        if (value.hasOwnProperty('sub')) {
            // This is a section with subsections
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'section';
            
            const sectionTitle = document.createElement('h3');
            sectionTitle.className = 'section-title';
            sectionTitle.textContent = key.split('-').map(word => 
                word.charAt(0).toUpperCase() + word.slice(1)
            ).join(' ');
            
            sectionDiv.appendChild(sectionTitle);
            
            const settingGroup = document.createElement('div');
            settingGroup.className = 'setting-group';
            
            // Process subsections
            generateForm(value.sub, settingGroup, path ? `${path}.${key}.sub` : `${key}.sub`);
            
            // Process regular settings in this section
            for (const [settingKey, settingValue] of Object.entries(value)) {
                if (settingKey !== 'sub' && settingValue instanceof Setting) {
                    const settingElement = createSettingElement(settingKey, settingValue, path ? `${path}.${key}` : key);
                    settingGroup.appendChild(settingElement);
                }
            }
            
            sectionDiv.appendChild(settingGroup);
            container.appendChild(sectionDiv);
        } else if (value instanceof Setting) {
            // This is a regular setting
            const settingElement = createSettingElement(key, value, path);
            container.appendChild(settingElement);
        }
    }
}

// Create a form element for a setting
function createSettingElement(key, setting, path) {
    const fullPath = path ? `${path}.${key}` : key;
    
    const settingItem = document.createElement('div');
    settingItem.className = 'setting-item';
    settingItem.dataset.path = fullPath;
    
    const settingHeader = document.createElement('div');
    settingHeader.className = 'setting-header';
    
    const label = document.createElement('span');
    label.className = 'setting-label';
    label.textContent = setting.label;
    
    const tooltip = document.createElement('span');
    tooltip.className = 'tooltip';
    tooltip.textContent = '?';
    
    const tooltipText = document.createElement('span');
    tooltipText.className = 'tooltip-text';
    tooltipText.textContent = setting.tooltip;
    
    tooltip.appendChild(tooltipText);
    settingHeader.appendChild(label);
    settingHeader.appendChild(tooltip);
    
    const controlGroup = document.createElement('div');
    controlGroup.className = 'control-group';
    
    // Create the appropriate control based on setting type
    switch (setting.type) {
        case 'toggle':
            controlGroup.appendChild(createToggleControl(setting, fullPath));
            break;
        case 'sliderInt':
        case 'sliderFloat':
            controlGroup.appendChild(createSliderControl(setting, fullPath));
            break;
        case 'dropSelect':
            controlGroup.appendChild(createDropSelectControl(setting, fullPath));
            break;
    }
    
    settingItem.appendChild(settingHeader);
    settingItem.appendChild(controlGroup);
    
    return settingItem;
}

// Create a toggle control
function createToggleControl(setting, path) {
    const toggleContainer = document.createElement('div');
    toggleContainer.className = 'toggle-container';
    
    const label = document.createElement('label');
    label.className = 'switch';
    
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.checked = setting.enabled;
    input.dataset.path = path;
    
    input.addEventListener('change', function() {
        updatePresetData(path, this.checked);
        updatePreview();
    });
    
    const slider = document.createElement('span');
    slider.className = 'slider';
    
    label.appendChild(input);
    label.appendChild(slider);
    toggleContainer.appendChild(label);
    
    const status = document.createElement('span');
    status.textContent = input.checked ? ' Enabled' : ' Disabled';
    status.style.marginLeft = '10px';
    status.dataset.statusPath = path;
    toggleContainer.appendChild(status);
    
    return toggleContainer;
}

// Create a slider control
function createSliderControl(setting, path) {
    const container = document.createElement('div');
    container.className = 'slider-control';
    
    const input = document.createElement('input');
    input.type = 'range';
    input.min = setting.min;
    input.max = setting.max;
    input.value = setting.selected;
    input.dataset.path = path;
    input.style.width = '100%';
    
    input.addEventListener('input', function() {
        const value = setting.type === 'sliderInt' ? 
            parseInt(this.value) : parseFloat(this.value);
        
        updatePresetData(path, value);
        
        const valueDisplay = document.querySelector(`[data-value-path="${path}"]`);
        if (valueDisplay) {
            valueDisplay.textContent = this.value;
        }
        
        updatePreview();
    });
    
    const valueDisplay = document.createElement('span');
    valueDisplay.className = 'slider-value';
    valueDisplay.textContent = input.value;
    valueDisplay.dataset.valuePath = path;
    
    container.appendChild(input);
    container.appendChild(valueDisplay);
    
    return container;
}

// Create a dropdown select control
function createDropSelectControl(setting, path) {
    const select = document.createElement('select');
    select.dataset.path = path;
    
    setting.options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option;
        optionElement.textContent = option;
        select.appendChild(optionElement);
    });
    
    select.addEventListener('change', function() {
        updatePresetData(path, this.value);
        updatePreview();
    });
    
    return select;
}

// Update the preset data structure
function updatePresetData(path, value) {
    const pathParts = path.split('.');
    let current = currentPreset;
    
    for (let i = 0; i < pathParts.length; i++) {
        const part = pathParts[i];
        
        if (i === pathParts.length - 1) {
            current[part] = value;
        } else {
            if (!current[part]) {
                current[part] = {};
            }
            current = current[part];
        }
    }
}

// Update the JSON preview
function updatePreview() {
    const previewElement = document.getElementById('jsonPreview');
    previewElement.textContent = JSON.stringify({ features: currentPreset }, null, 2);
}

// Save the preset
function savePreset() {
    const presetName = document.getElementById('presetName').value.trim();
    
    if (!presetName) {
        alert('Please enter a name for your preset');
        return;
    }
    
    // In a real extension, you would save to browser.storage.local
    console.log('Saving preset:', presetName, currentPreset);
    alert(`Preset "${presetName}" saved successfully!`);
}

// Reset the form
function resetForm() {
    if (confirm('Are you sure you want to reset all settings?')) {
        currentPreset = {};
        document.getElementById('formContainer').innerHTML = '';
        generateForm(presetConfig, 'formContainer');
        document.getElementById('presetName').value = '';
        updatePreview();
    }
}

// Export the JSON
function exportJSON() {
    const dataStr = JSON.stringify({ features: currentPreset }, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'preset.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}