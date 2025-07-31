export async function getElements(elements) {

    const DOMelement = {}

    for (const [element, selector] of Object.entries(elements)) {
        DOMelement[element] = await waitForElement(selector);
    }

    return DOMelement
}

function waitForElement(selector, timeout = 10000) {
  return new Promise((resolve, reject) => {
    const element = document.querySelector(selector);
    if (element) return resolve(element);

    const observer = new MutationObserver(() => {
      const el = document.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(document.documentElement, {
      childList: true,
      subtree: true,
    });

    if (timeout) {
      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timeout: Element "${selector}" not found`));
      }, timeout);
    }
  });
}