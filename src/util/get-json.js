import { getURL } from "./get-runtime-url.js";

export function getJSON(path) {
    return fetch(getURL(path))
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        });
}