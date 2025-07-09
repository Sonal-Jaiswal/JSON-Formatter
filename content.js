// JSON Formatter Content Script
(function() {
  // Check if the extension is enabled
  chrome.storage.sync.get(['jsonFormatterEnabled'], function(result) {
    if (result.jsonFormatterEnabled === false) return;
    // Only run if the page looks like raw JSON
    const pre = document.querySelector('pre');
    if (pre) {
      try {
        const json = JSON.parse(pre.textContent);
        // Generate formatted HTML (this is a simple example)
        const formatted = `<pre>${JSON.stringify(json, null, 2)}</pre>`;
        document.querySelector('.json-formatter-container').innerHTML = formatted;
        pre.style.display = 'none'; // Hide the original
      } catch (e) {
        console.error('Invalid JSON:', e);
      }
    }
  });

  // Recursive function to render JSON with collapsible sections
  function renderJSON(value, key) {
    const type = typeof value;
    if (value === null) {
      return createSpan('null', 'json-null');
    } else if (Array.isArray(value)) {
      const container = document.createElement('div');
      container.className = 'json-array';
      const toggle = createToggle();
      const summary = document.createElement('span');
      summary.textContent = `[Array(${value.length})]`;
      summary.className = 'json-key';
      container.appendChild(toggle);
      container.appendChild(summary);
      const content = document.createElement('div');
      content.className = 'json-collapsible';
      value.forEach((item, i) => {
        const itemDiv = document.createElement('div');
        itemDiv.appendChild(renderJSON(item));
        content.appendChild(itemDiv);
      });
      container.appendChild(content);
      toggle.addEventListener('click', () => {
        content.classList.toggle('collapsed');
      });
      return container;
    } else if (type === 'object') {
      const container = document.createElement('div');
      container.className = 'json-object';
      const toggle = createToggle();
      const summary = document.createElement('span');
      summary.textContent = '{Object}';
      summary.className = 'json-key';
      container.appendChild(toggle);
      container.appendChild(summary);
      const content = document.createElement('div');
      content.className = 'json-collapsible';
      Object.keys(value).forEach(k => {
        const row = document.createElement('div');
        row.appendChild(createSpan(k + ': ', 'json-key'));
        row.appendChild(renderJSON(value[k], k));
        content.appendChild(row);
      });
      container.appendChild(content);
      toggle.addEventListener('click', () => {
        content.classList.toggle('collapsed');
      });
      return container;
    } else if (type === 'string') {
      return createSpan('"' + value + '"', 'json-string');
    } else if (type === 'number') {
      return createSpan(value, 'json-number');
    } else if (type === 'boolean') {
      return createSpan(value, 'json-boolean');
    }
  }

  function createSpan(text, className) {
    const span = document.createElement('span');
    span.textContent = text;
    span.className = className;
    return span;
  }

  function createToggle() {
    const btn = document.createElement('span');
    btn.textContent = '▶';
    btn.className = 'json-toggle';
    return btn;
  }
})(); 