import { getJSON } from "../../util/get-json.js";
import settingsConfig from '/system/creator-index.js';

// Function to generate the form based on the configuration and preset values
async function generateSettingsForm() {
    const presetValues = await getJSON('/presets/default.json');
    console.log("Preset Values:", presetValues);
    const formContainer = document.getElementById('formContainer');
    if (!formContainer) {
        console.error('Form container not found');
        return;
    }

    // Clear existing content
    formContainer.innerHTML = settingsConfig.render(presetValues.features);
}

// Initialize the form when the page loads
document.addEventListener('DOMContentLoaded', () => {
    // Your configuration and preset values would be imported here
    // For this example, I'm using the ones you provided
    
    // Generate the form
    generateSettingsForm();
});