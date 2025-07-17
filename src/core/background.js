console.log("background js active");

(async () => {
  // Import utils
    const { resetStorage } = await import(browser.runtime.getURL("util/init.js"));

    resetStorage();

})();