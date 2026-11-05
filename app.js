// Creative Team daily tasks & bookings — loads data/data.json (with cache-busting)
// and renders it. Refresh button = reload the page, which re-fetches data.json.
// No Monday.com or Google credentials are in this repo or in the browser.
fetch('./data/data.json?v=' + Date.now(), { cache: 'no-store' })
  .then(function (r) { if (!r.ok) throw new Error('data.json not found: ' + r.status); return r.json(); })
  .then(function (data) {
    document.getElementById('dashboard').innerHTML = data.html;
    // Time-of-day greeting, Singapore time: morning / afternoon / evening
    var hour = Number(new Intl.DateTimeFormat('en-SG', { timeZone: 'Asia/Singapore', hour: 'numeric', hour12: false }).format(new Date()));
    var part = hour < 12 ? 'morning' : (hour < 18 ? 'afternoon' : 'evening');
    var greet = document.getElementById('creative-greet');
    if (greet) greet.textContent = 'Good ' + part + ', creative team!';
    var el = document.getElementById('updated');
    if (el) el.textContent = 'Last updated: ' + (data.generated_at || '') + ' · Week: ' + (data.week || '');
  })
  .catch(function (err) {
    var el = document.getElementById('status');
    if (el) el.textContent = 'Could not load the latest data. Try Refresh. (' + err.message + ')';
  });
