// Creative Team daily tasks & bookings — loads data/data.json (with cache-busting)
// and renders it. Refresh button = reload the page, which re-fetches data.json.
// No Monday.com or Google credentials are in this repo or in the browser.
// Calendar + card pagination live here (scripts inside data.html would not run
// via innerHTML); the calendar data arrives as data.cal.
fetch('./data/data.json?v=' + Date.now(), { cache: 'no-store' })
  .then(function (r) { if (!r.ok) throw new Error('data.json not found: ' + r.status); return r.json(); })
  .then(function (data) {
    document.getElementById('dashboard').innerHTML = data.html;
    // Time-of-day greeting, Singapore time: morning / afternoon / evening
    var hour = Number(new Intl.DateTimeFormat('en-SG', { timeZone: 'Asia/Singapore', hour: 'numeric', hour12: false }).format(new Date()));
    var part = hour < 12 ? 'morning' : (hour < 18 ? 'afternoon' : 'evening');
    var greet = document.getElementById('creative-greet');
    if (greet) greet.textContent = 'Good ' + part + ', creative team!';
    // Live date & time (Singapore) — updates #datetime in the design html.
    function tick() {
      var now = new Date();
      var date = new Intl.DateTimeFormat('en-SG', { timeZone: 'Asia/Singapore', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(now);
      var time = new Intl.DateTimeFormat('en-SG', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit' }).format(now);
      var el = document.getElementById('datetime');
      if (el) el.textContent = date + ' · ' + time + ' SGT';
    }
    tick();
    setInterval(tick, 30000);
    // ---- v4 calendar + pagination (CAL from data.cal) ----
    var CAL = data.cal || {};


var MONTHS_FULL = ["January","February","March","April","May","June","July","August","September","October","November","December"];
var INITIALS = {"Renny":"R","Bernetta":"Be","Celine":"Ce","CJ":"CJ","Jolynn":"Jo","Tristan":"Tr","Riduwan":"Ri","Sherman":"Sh","Rachel":"Ra","Beverly":"Bev","Cher":"Ch","Sue":"Su"};
var BG = {"Renny":"#b8f0ff","Bernetta":"#f3c6e3","Celine":"#ffe14d","CJ":"#c8e8d8","Jolynn":"#e8e8e8","Tristan":"#ffb3b3","Riduwan":"#dccdf5","Sherman":"#fcc88a","Rachel":"#b7cbdb","Beverly":"#fecdbd","Cher":"#c6c09c","Sue":"#e6c8f5"};
var calState = {person: "Renny", month: "2026-11"};
var bridge = (window.hatchWidget && window.hatchWidget.getState) ? window.hatchWidget : null;
if (bridge) { try { var s = bridge.getState({person:"Renny", month:"2026-11"}); if (s && s.person) calState = s; } catch(e){} }
function saveCal(){ if (bridge) { try { bridge.setState(calState); } catch(e){} } }
function esc(s){ return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function avatarInner(p){
  if (CAL.photos && CAL.photos[p]) return '<img src="'+CAL.photos[p]+'" alt="'+esc(p)+'">';
  if (CAL.cats && CAL.cats[p]) return CAL.cats[p];
  return INITIALS[p];
}
function avatarBg(p){
  return (CAL.photos && CAL.photos[p]) ? "transparent" : BG[p];
}
function renderSide(){
  var html = "";
  Object.keys(CAL.groups).forEach(function(g){
    html += '<div style="font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#888;margin:12px 4px 4px">'+esc(g)+'</div>';
    CAL.groups[g].forEach(function(p){
      var s = CAL.side[p];
      html += '<div class="person'+(calState.person===p?" active":"")+'" data-p="'+esc(p)+'">'
        + '<div class="avatar" style="background:'+avatarBg(p)+'">'+avatarInner(p)+'</div>'
        + '<div><b>'+esc(p)+'</b><span>'+esc(CAL.roles[p])+'</span><span>'+s.load+'% this week</span></div>'
        + '<div class="meta"><div class="sm">'+s.smiley+' '+s.today_n+'</div>'
        + (s.overdue ? '<div class="ov">'+s.overdue+' overdue</div>' : '<div class="ov" style="color:#888">clear</div>')
        + '</div></div>';
    });
  });
  document.getElementById("calSide").innerHTML = html;
  document.querySelectorAll("#calSide .person").forEach(function(r){ r.onclick = function(){ calState.person = r.getAttribute("data-p"); saveCal(); renderSide(); renderCal(); }; });
}
function renderCal(){
  var p = calState.person;
  var parts = calState.month.split("-"); var y = parseInt(parts[0],10), m = parseInt(parts[1],10)-1;
  var dav = document.getElementById("dAvatar");
  if (CAL.photos && CAL.photos[p]) { dav.innerHTML = '<img src="'+CAL.photos[p]+'" alt="'+esc(p)+'">'; dav.style.background = "transparent"; }
  else if (CAL.cats && CAL.cats[p]) { dav.textContent = CAL.cats[p]; dav.style.background = BG[p]; }
  else { dav.textContent = INITIALS[p]; dav.style.background = BG[p]; }
  document.getElementById("dName").textContent = p;
  document.getElementById("dRole").textContent = CAL.roles[p];
  var key = m===9?"oct":m===10?"nov":"dec";
  var c = CAL.counts[p];
  document.getElementById("dSummary").textContent = c[key]+" Monday tasks due in "+MONTHS_FULL[m]+" "+y+" · "+(c[key+"_cleared"]||0)+" cleared that month · "+c[key+"_shoots"]+" shoot day(s) booked";
  document.getElementById("dMonth").textContent = MONTHS_FULL[m]+" "+y;
  var first = new Date(y,m,1); var days = new Date(y,m+1,0).getDate();
  var offset = (first.getDay()+6)%7;
  var cells = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(function(d){ return '<div class="dow">'+d+'</div>'; }).join("");
  for (var i=0;i<offset;i++) cells += '<div class="day empty"></div>';
  for (var day=1; day<=days; day++){
    var ds = y+"-"+String(m+1).padStart(2,"0")+"-"+String(day).padStart(2,"0");
    var tlist = (CAL.tasks[p] && CAL.tasks[p][ds]) || [];
    var slist = (CAL.shoots[p] && CAL.shoots[p][ds]) || [];
    var isWknd = [0,6].indexOf(new Date(y,m,day).getDay()) !== -1;
    var isToday = ds === "2026-11-13";
    var inner = '<span><b>'+day+'</b>'+(isWknd?' <span class="wknd">· weekend</span>':'')+'</span>';
    slist.forEach(function(s){ inner += '<div class="shoot">🎬 '+esc(s.title)+'<br><span style="font-weight:400">'+esc(s.time)+(s.note?" · "+esc(s.note):"")+'</span></div>'; });
    (CAL.leave[p]||[]).forEach(function(lv){ if (ds>=lv[0] && ds<=lv[1]) inner += '<div class="leave">🏖️ '+esc(lv[2])+' — leave / away, do not book</div>'; });
    if ((CAL.wfh[p]||[]).indexOf(ds) !== -1) inner += '<div class="wfh">🏠 WFH (abnormal — Tue/Thu are normal WFH days)</div>';
    (CAL.bookings[p] && CAL.bookings[p][ds] || []).forEach(function(b){ inner += '<div class="booking">'+esc(b)+'</div>'; });
    if (CAL.ph && CAL.ph[ds]) inner += '<div class="ph">🎉 '+esc(CAL.ph[ds])+' — public holiday</div>';
    tlist.forEach(function(t){
      var isOver = !t.done && ds < "2026-11-13";
      inner += '<div class="task'+(t.done?" done":"")+'">'+(t.done?"✓ ":"")+esc(t.board)+' — '+esc(t.sub)+'<br><span style="color:#555">'+esc(t.status)+(t.hrs?" · "+esc(t.hrs)+"h":"")+(isOver?' · <span class="ovtag">OVERDUE</span>':"")+'</span></div>';
    });
    (CAL.cleared[p] && CAL.cleared[p][ds] || []).forEach(function(cl){
      inner += '<div class="cleared">✓ Cleared — '+esc(cl.board)+' — '+esc(cl.sub)+'<br><span style="color:#555">'+(cl.deadline?("due "+esc(cl.deadline)):"no deadline")+(cl.hrs?" · "+esc(cl.hrs)+"h":"")+'</span></div>';
    });
    if (!tlist.length && !slist.length) inner += '<div class="noTask">No task due</div>';
    var onLeave = (CAL.leave[p]||[]).some(function(lv){ return ds>=lv[0] && ds<=lv[1]; });
    var isPh = !!(CAL.ph && CAL.ph[ds]);
    cells += '<div class="day'+(isToday?" today":"")+(onLeave?" leaveDay":"")+(isPh?" phDay":"")+'">'+inner+'</div>';
  }
  document.getElementById("calGrid").innerHTML = cells;
  document.getElementById("dFoot").textContent = CAL.foot[p] || "";
}
document.getElementById("dPrev").onclick = function(){
  var parts = calState.month.split("-"); var y = parseInt(parts[0],10), m = parseInt(parts[1],10)-1;
  var d = new Date(y, m-1, 1);
  if (d < new Date(2026,9,1)) return;
  calState.month = d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"); saveCal(); renderCal();
};
document.getElementById("dNext").onclick = function(){
  var parts = calState.month.split("-"); var y = parseInt(parts[0],10), m = parseInt(parts[1],10)-1;
  var d = new Date(y, m+1, 1);
  if (d > new Date(2026,11,1)) return;
  calState.month = d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0"); saveCal(); renderCal();
};
if (bridge && window.addEventListener) { window.addEventListener("hatch-widget-state", function(e){ if (e.detail && e.detail.state) { calState = e.detail.state; renderSide(); renderCal(); } }); }
// group pagination: 3 cards at a time
document.querySelectorAll(".group").forEach(function(g){
  var pages = parseInt(g.getAttribute("data-pages"),10);
  var cards = g.querySelectorAll(".tcard");
  var label = g.querySelector(".pg-label");
  var btns = g.querySelectorAll(".navbtn");
  var page = 0;
  function show(){
    cards.forEach(function(c, i){ c.style.display = (Math.floor(i/3) === page) ? "" : "none"; });
    if (label) label.textContent = "Page " + (page+1) + " of " + pages;
    btns.forEach(function(b){
      var dir = parseInt(b.getAttribute("data-dir"),10);
      b.disabled = (dir < 0 && page === 0) || (dir > 0 && page >= pages-1);
    });
    g.querySelectorAll(".navbtn").forEach(function(b){ b.style.display = pages <= 1 ? "none" : ""; });
    if (label) label.style.display = pages <= 1 ? "none" : "";
  }
  btns.forEach(function(b){ b.onclick = function(){ page = Math.max(0, Math.min(pages-1, page + parseInt(b.getAttribute("data-dir"),10))); show(); }; });
  show();
});
renderSide(); renderCal();

  })
  .catch(function (err) {
    var el = document.getElementById('status');
    if (el) el.textContent = 'Could not load the latest data. Try Refresh. (' + err.message + ')';
  });
