// Creative Team daily tasks & bookings — loads data/data.json (with cache-busting)
// and renders it. Refresh button = reload the page, which re-fetches data.json.
// No Monday.com or Google credentials are in this repo or in the browser.
fetch('./data/data.json?v=' + Date.now(), { cache: 'no-store' })
  .then(function (r) { if (!r.ok) throw new Error('data.json not found: ' + r.status); return r.json(); })
  .then(function (data) {
    document.getElementById('dashboard').innerHTML = data.html;
    var el = document.getElementById('updated');
    if (el) el.textContent = 'Last updated: ' + (data.generated_at || '') + ' · Week: ' + (data.week || '');
  })
  .catch(function (err) {
    var el = document.getElementById('status');
    if (el) el.textContent = 'Could not load the latest data. Try Refresh. (' + err.message + ')';
  });
