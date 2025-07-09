// popup.js for JSON Formatter
const toggle = document.getElementById('toggleFormatter');
chrome.storage.sync.get(['jsonFormatterEnabled'], function(result) {
  toggle.checked = result.jsonFormatterEnabled !== false;
});
toggle.addEventListener('change', function() {
  chrome.storage.sync.set({ jsonFormatterEnabled: toggle.checked });
}); 