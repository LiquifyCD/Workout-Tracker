(()=>{
"use strict";

const SUPABASE_URL = "https://txdiazrvochdrlmlahbo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_c2FUhLGrPLvD8w6dj74TCQ_xolv2TEy";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

const PROFILES = [{"key": "alfred", "name": "Alfred", "color": "#b794f4", "defaultExpected": 6, "defaultSchedule": [{"day": "Day 1", "type": "Upper", "title": "Upper — back priority", "focus": "Back first", "exs": [["Wide-grip lat pulldown", "1–2", "4–7", "Back first"], ["Close-grip cable row", "1", "4–7", "Row / shoulder extension"], ["Pec deck", "1", "6–10", "Chest maintenance"], ["Rope triceps extension", "1–2", "6–10", "Direct triceps"], ["Curl variation", "1–2", "6–10", "Direct biceps"], ["Lateral raise", "1 optional", "8–15", "Only if side delts lag"]]}, {"day": "Day 2", "type": "Lower", "title": "Lower — hinge + quad", "focus": "Hinge first", "exs": [["Stiff-leg deadlift", "1–2", "4–7", "Hinge priority"], ["Leg curl", "1", "6–10", "Short-head coverage"], ["Leg press / squat", "1–2", "4–7", "Quad stimulus"], ["Calf raise", "1–2", "6–12", "Controlled stretch"]]}, {"day": "Day 3", "type": "Upper", "title": "Upper — chest priority", "focus": "Chest first", "exs": [["Incline press", "2", "4–7", "Chest priority"], ["Pec deck", "1", "6–10", "Horizontal adduction"], ["Wide-grip lat pulldown", "1–2", "4–7", "Lat stimulus"], ["JM press", "1", "4–7", "Triceps"], ["Rope extension", "1", "6–10", "All heads"], ["Curl variation", "1–2", "6–10", "Direct biceps"]]}, {"day": "Day 4", "type": "Lower", "title": "Lower — quad + curl", "focus": "Quad first", "exs": [["Squat variation", "1–2", "4–7", "Quad priority"], ["Leg extension", "1", "6–10", "Knee extension"], ["Leg curl", "2", "6–10", "Curl priority, no hinge"], ["Calf raise", "1–2", "6–12", "Calves"]]}, {"day": "Day 5", "type": "Upper", "title": "Upper — shoulder priority", "focus": "Shoulders first", "exs": [["Overhead press", "1–2", "4–7", "Shoulder priority"], ["Lateral raise", "1–2", "8–15", "Side delts"], ["Pec deck", "1", "6–10", "No incline today"], ["Single-arm lat pulldown", "1–2", "6–10", "Different lat angle"], ["Rope extension", "1–2", "6–10", "Direct triceps"], ["Curl variation", "1–2", "6–10", "Direct biceps"]]}, {"day": "Day 6", "type": "Lower", "title": "Lower — hinge + quad", "focus": "Hinge first", "exs": [["Stiff-leg deadlift", "2", "4–7", "Hinge priority"], ["Leg curl", "1", "6–10", "Knee flexion coverage"], ["Leg press", "1–2", "4–7", "Quad stimulus"], ["Calf raise", "1–2", "6–12", "Calves"]]}]}, {"key": "maja", "name": "Maja", "color": "#ffffff", "defaultExpected": 3, "defaultSchedule": [{"day": "Day 1", "type": "Full body", "title": "Full Body A", "focus": "Squat + push", "exs": [["Leg press / squat", "2", "6–10", "Main lower"], ["Incline press", "2", "6–10", "Push"], ["Wide-grip lat pulldown", "2", "6–10", "Pull"], ["Leg curl", "1–2", "8–12", "Hamstrings"], ["Curl variation", "1", "8–12", "Optional"]]}, {"day": "Day 2", "type": "Full body", "title": "Full Body B", "focus": "Hinge + pull", "exs": [["Stiff-leg deadlift", "2", "6–10", "Hinge"], ["Close-grip cable row", "2", "6–10", "Back"], ["Pec deck", "1–2", "8–12", "Chest"], ["Lateral raise", "1–2", "10–15", "Side delts"], ["Rope triceps extension", "1", "8–12", "Optional"]]}, {"day": "Day 3", "type": "Full body", "title": "Full Body C", "focus": "Quad + shoulders", "exs": [["Squat variation", "2", "6–10", "Quad"], ["Overhead press", "1–2", "6–10", "Shoulders"], ["Single-arm lat pulldown", "2", "8–12", "Back"], ["Leg extension", "1–2", "8–12", "Quads"], ["Calf raise", "1–2", "8–15", "Calves"]]}]}, {"key": "elias", "name": "Elias", "color": "#d6bcfa", "defaultExpected": 4, "defaultSchedule": [{"day": "Day 1", "type": "Upper", "title": "Upper A", "focus": "Push/pull", "exs": [["Incline press", "2", "6–10", "Chest"], ["Wide-grip lat pulldown", "2", "6–10", "Back"], ["Pec deck", "1", "8–12", "Chest"], ["Curl variation", "1–2", "8–12", "Biceps"], ["Rope triceps extension", "1–2", "8–12", "Triceps"]]}, {"day": "Day 2", "type": "Lower", "title": "Lower A", "focus": "Quad", "exs": [["Leg press / squat", "2", "6–10", "Quads"], ["Leg curl", "2", "8–12", "Hamstrings"], ["Leg extension", "1", "8–12", "Quads"], ["Calf raise", "2", "8–15", "Calves"]]}, {"day": "Day 3", "type": "Upper", "title": "Upper B", "focus": "Shoulders/back", "exs": [["Overhead press", "2", "6–10", "Shoulders"], ["Close-grip cable row", "2", "6–10", "Back"], ["Lateral raise", "1–2", "10–15", "Side delts"], ["Pec deck", "1", "8–12", "Chest"], ["Curl variation", "1", "8–12", "Biceps"]]}, {"day": "Day 4", "type": "Lower", "title": "Lower B", "focus": "Hinge", "exs": [["Stiff-leg deadlift", "2", "6–10", "Hinge"], ["Squat variation", "1–2", "6–10", "Quads"], ["Leg curl", "1", "8–12", "Hamstrings"], ["Calf raise", "2", "8–15", "Calves"]]}]}, {"key": "jacqueline", "name": "Jacqueline", "color": "#c4b5fd", "defaultExpected": 3, "defaultSchedule": [{"day": "Day 1", "type": "Full body", "title": "Full Body A", "focus": "Squat + push", "exs": [["Leg press / squat", "2", "6–10", "Main lower"], ["Incline press", "2", "6–10", "Push"], ["Wide-grip lat pulldown", "2", "6–10", "Pull"], ["Leg curl", "1–2", "8–12", "Hamstrings"], ["Curl variation", "1", "8–12", "Optional"]]}, {"day": "Day 2", "type": "Full body", "title": "Full Body B", "focus": "Hinge + pull", "exs": [["Stiff-leg deadlift", "2", "6–10", "Hinge"], ["Close-grip cable row", "2", "6–10", "Back"], ["Pec deck", "1–2", "8–12", "Chest"], ["Lateral raise", "1–2", "10–15", "Side delts"], ["Rope triceps extension", "1", "8–12", "Optional"]]}, {"day": "Day 3", "type": "Full body", "title": "Full Body C", "focus": "Quad + shoulders", "exs": [["Squat variation", "2", "6–10", "Quad"], ["Overhead press", "1–2", "6–10", "Shoulders"], ["Single-arm lat pulldown", "2", "8–12", "Back"], ["Leg extension", "1–2", "8–12", "Quads"], ["Calf raise", "1–2", "8–15", "Calves"]]}]}];
const COMPLETE_EX = "__WORKOUT_COMPLETE__";
const NAV_ITEMS = [
  {page:"dashboard",desktop:"Dashboard",mobile:"Home"},
  {page:"log",desktop:"Log",mobile:"Log"},
  {page:"history",desktop:"History",mobile:"History"},
  {page:"schedule",desktop:"Schedule"},
  {page:"settings",desktop:"Settings",mobile:"More"}
];
let entries = [];
let profileSettings = {};
let user = null;
let currentProfileKey = localStorage.getItem("divinity-profile") || "alfred";
let histFilter = "all";
let editorProfileKey = "alfred";

function qs(id){return document.getElementById(id)}
function profileByKey(key){return PROFILES.find(p=>p.key===key)||PROFILES[0]}
function activeProfile(){return profileByKey(currentProfileKey)}
function activeSettings(key=currentProfileKey){return profileSettings[key] || {...profileByKey(key), schedule_json: profileByKey(key).defaultSchedule, expected_sessions_per_week: profileByKey(key).defaultExpected}}
function activeSchedule(key=currentProfileKey){return activeSettings(key).schedule_json || profileByKey(key).defaultSchedule}
function toast(msg){const t=qs("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)}
function setSync(status,msg){const d=qs("sync-dot"), s=qs("sync-text"); d.className="dot "+(status||""); s.textContent=msg;}
function setActiveButtons(page){document.querySelectorAll("[data-page]").forEach(b=>b.classList.toggle("active",b.dataset.page===page))}
function renderNavigation(){
  qs("desktop-nav").innerHTML=NAV_ITEMS.map(item=>`<button class="${item.page==="dashboard"?"active":""}" data-page="${item.page}">${item.desktop}</button>`).join("");
  qs("mobile-nav").innerHTML=NAV_ITEMS.filter(item=>item.mobile).map(item=>`<button class="${item.page==="dashboard"?"active":""}" data-page="${item.page}">${item.mobile}</button>`).join("");
}
function showPage(page){document.querySelectorAll(".page").forEach(p=>p.classList.remove("active"));qs("page-"+page).classList.add("active");setActiveButtons(page);renderAll()}
function showProfilePicker(){renderProfilePicker();qs("profile-screen").classList.add("show")}
function hideProfilePicker(){qs("profile-screen").classList.remove("show")}

async function signInPassword(){
  const email=qs("login-email").value.trim(), password=qs("login-password").value;
  if(!email||!password){qs("auth-msg").textContent="Enter email and password.";return}
  qs("auth-msg").textContent="Logging in...";
  const {error}=await supabaseClient.auth.signInWithPassword({email,password});
  if(error){qs("auth-msg").textContent=error.message;return}
  await checkAuth();
}
async function resetPassword(){
  const email=qs("login-email").value.trim();
  if(!email){qs("auth-msg").textContent="Enter email first.";return}
  const {error}=await supabaseClient.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+window.location.pathname});
  qs("auth-msg").textContent=error?error.message:"Password reset email sent.";
}
async function signOut(){await supabaseClient.auth.signOut();location.reload()}
async function getUser(){const {data}=await supabaseClient.auth.getUser();return data.user}
async function checkAuth(){
  setSync("", "Checking");
  user=await getUser();
  if(!user){qs("auth").classList.add("show");setSync("bad","Signed out");return}
  qs("auth").classList.remove("show");
  await loadAllData();
  if(!localStorage.getItem("divinity-profile")) showProfilePicker();
}

function renderProfilePicker(){
  qs("profile-grid").innerHTML = PROFILES.map(p=>`<button class="profile-btn ${p.key===currentProfileKey?'active':''}" data-profile="${p.key}"><strong>${p.name}</strong><span>${activeSettings(p.key).expected_sessions_per_week} expected sessions / week</span></button>`).join("");
}

async function ensureProfileSettings(){
  for(const p of PROFILES){
    if(profileSettings[p.key]) continue;
    const row={user_id:user.id,profile_key:p.key,display_name:p.name,expected_sessions_per_week:p.defaultExpected,schedule_json:p.defaultSchedule};
    const {error}=await supabaseClient.from("profile_settings").upsert(row,{onConflict:"user_id,profile_key"});
    if(error) throw error;
    profileSettings[p.key]={...p,...row};
  }
}

async function loadAllData(show=true){
  if(show) setSync("", "Loading");
  user = user || await getUser();
  if(!user){entries=[];renderAll();return}
  const s = await supabaseClient.from("profile_settings").select("*").eq("user_id",user.id);
  if(s.error){setSync("bad","SQL needed");alert("Run the new SQL migration first. Missing profile_settings or policy.\n\n"+s.error.message);return}
  profileSettings={};
  (s.data||[]).forEach(r=>{const base=profileByKey(r.profile_key);profileSettings[r.profile_key]={...base,...r}});
  await ensureProfileSettings();
  const e = await supabaseClient.from("workout_entries").select("*").eq("user_id",user.id).order("created_at",{ascending:false});
  if(e.error){setSync("bad","SQL needed");alert("Run the SQL migration first. Missing profile_key or policy.\n\n"+e.error.message);return}
  entries=(e.data||[]).map(r=>({id:r.id,date:r.entry_date,profile:r.profile_key||"alfred",day:r.loop_day,title:r.workout_title,ex:r.exercise,load:r.load_kg==null?null:Number(r.load_kg),s1:r.set_1_reps||0,s2:r.set_2_reps||0,rir:r.rir,range:r.rep_range,decision:r.decision||"",notes:r.notes||"",isRest:!!r.is_rest_day,created:r.created_at}));
  setSync("ok","Synced");
  renderAll();
}

function switchProfile(key, close=false){
  currentProfileKey=key;localStorage.setItem("divinity-profile",key);
  if(close) hideProfilePicker();
  renderAll();
  fillDaySelect();
}
function profileEntries(key=currentProfileKey){return entries.filter(e=>e.profile===key)}
function completedEntries(key=currentProfileKey){return profileEntries(key).filter(e=>e.ex===COMPLETE_EX&&!e.isRest)}
function setEntries(key=currentProfileKey){return profileEntries(key).filter(e=>e.ex!==COMPLETE_EX&&!e.isRest)}
function scheduleByDay(day,key=currentProfileKey){return activeSchedule(key).find(x=>x.day===day)||activeSchedule(key)[0]}
function nextDayIndex(key=currentProfileKey){const schedule=activeSchedule(key);const c=completedEntries(key)[0];if(!c)return 0;const idx=schedule.findIndex(d=>d.day===c.day);return idx<0?0:(idx+1)%schedule.length}
function latestSetFor(ex,key=currentProfileKey){return setEntries(key).find(e=>e.ex===ex)}
function decisionClass(d){return d==="increase"?"increase":d==="reduce"?"reduce":d==="rest"?"rest":d==="complete"?"complete":"repeat"}

function decide(s1,s2,rir,range){
  const [min,max]=range.split("-").map(Number); const sets=s2>0?[s1,s2]:[s1];
  if(sets.some(r=>r<min)) return {decision:"reduce",label:"Repeat or reduce",reason:"A set fell below the target range.",cls:"reduce"};
  if(rir>2) return {decision:"rest",label:"Check recovery",reason:"RIR is high. Check effort, form, or fatigue before adding load.",cls:"rest"};
  if(sets.every(r=>r>=max) && rir<=1) return {decision:"increase",label:"Increase load",reason:"Top of range reached with ≤1 RIR.",cls:"increase"};
  if(sets.every(r=>r>=max) && rir>1) return {decision:"repeat",label:"Repeat, push harder",reason:"Top reps reached but RIR suggests more available.",cls:"repeat"};
  return {decision:"repeat",label:"Repeat load",reason:"Within range, not fully maxed yet.",cls:"repeat"};
}
function guessedRangeFor(ex){
  if(/lateral/i.test(ex)) return "8-15";
  if(/calf/i.test(ex)) return "6-12";
  if(/curl|extension|pec deck/i.test(ex) && !/stiff/i.test(ex)) return "6-10";
  return "4-7";
}
function fillProfileSelects(){
  const opts=PROFILES.map(p=>`<option value="${p.key}">${p.name}</option>`).join("");
  ["log-profile","edit-profile"].forEach(id=>{if(qs(id)) qs(id).innerHTML=opts});
  qs("log-profile").value=currentProfileKey;
}
function fillDaySelect(){
  if(!qs("log-day")) return;
  fillProfileSelects();
  const sched=activeSchedule(currentProfileKey);
  qs("log-day").innerHTML=sched.map(d=>`<option value="${d.day}">${d.day} — ${d.title}</option>`).join("");
  qs("log-day").value=sched[nextDayIndex(currentProfileKey)].day;
  fillExercisesForDay();
}
function dayEntries(day,key=currentProfileKey){const completion=completedEntries(key).find(e=>e.day===day);return setEntries(key).filter(e=>e.day===day&&(!completion||e.created>completion.created))}
function lastLoggedExerciseForDay(day,key=currentProfileKey){const dayLog=dayEntries(day,key);return dayLog.length?dayLog[0].ex:null}
function nextExerciseForDay(day,key=currentProfileKey){const d=scheduleByDay(day,key);const last=lastLoggedExerciseForDay(day,key);if(!last) return d.exs[0][0];const idx=d.exs.findIndex(e=>e[0]===last);return d.exs[(idx+1+d.exs.length)%d.exs.length][0]}
function renderLogPreview(){const ex=qs("log-ex")?.value; if(!ex) return; const last=latestSetFor(ex); if(!last){qs("log-preview").innerHTML=`<div class="warnbox">Next exercise: <strong>${ex}</strong>. No recent set yet.</div>`; return;} qs("log-preview").innerHTML=`<div class="warnbox">Next exercise: <strong>${ex}</strong>. Last saved ${last.load??"—"} kg, ${last.s1}${last.s2?"/"+last.s2:""} reps, ${last.decision}.</div>`}
function fillExercisesForDay(){
  const d=scheduleByDay(qs("log-day").value,currentProfileKey);
  qs("log-ex").innerHTML=d.exs.map(e=>`<option value="${e[0]}">${e[0]}</option>`).join("");
  qs("log-ex").value=nextExerciseForDay(qs("log-day").value,currentProfileKey);
  setExerciseDefaults();
}
function setExerciseDefaults(){
  const range=rangeForExercise();
  if(![...qs("log-range").options].some(option=>option.value===range))qs("log-range").add(new Option(range,range));
  qs("log-range").value=range;
  const last=latestSetFor(qs("log-ex").value),midpoint=rangeMidpoint(range);
  qs("log-load").value=last?.load??"";
  qs("log-s1").value=last?.s1||midpoint;
  qs("log-s2").value=last?.s2||midpoint;
  renderLogPreview();
}
function clearForm(){["log-rir","log-notes"].forEach(id=>qs(id).value="");qs("decision").classList.remove("show");setExerciseDefaults()}

async function insertRow(row){
  user = user || await getUser();
  if(!user){qs("auth").classList.add("show");toast("Sign in first");return false}
  setSync("", "Saving");
  const {error}=await supabaseClient.from("workout_entries").insert({...row,user_id:user.id,profile_key:currentProfileKey,profile_name:activeProfile().name});
  if(error){setSync("bad","Error");alert(error.message);return false}
  setSync("ok","Synced"); await loadAllData(false); return true;
}
async function addEntry(){
  const day=qs("log-day").value, ex=qs("log-ex").value, load=parseFloat(qs("log-load").value), s1=parseInt(qs("log-s1").value), s2=parseInt(qs("log-s2").value)||0, rir=parseInt(qs("log-rir").value), range=qs("log-range").value, notes=qs("log-notes").value.trim();
  if(isNaN(load)||!s1||isNaN(rir)){toast("Fill load, set 1, and RIR");return}
  const dec=decide(s1,s2,rir,range); const d=scheduleByDay(day);
  const ok=await insertRow({entry_date:new Date().toISOString().slice(0,10),loop_day:day,workout_title:d.title,exercise:ex,load_kg:load,set_1_reps:s1,set_2_reps:s2||null,rir,rep_range:range,decision:dec.decision,notes,is_rest_day:false});
  if(ok){
    qs("decision").classList.add("show");
    qs("decision-main").innerHTML=`<span class="badge ${dec.cls}">${dec.label}</span>`;
    qs("decision-reason").textContent=dec.reason;
    toast("Set saved");
    qs("log-ex").value=nextExerciseForDay(day,currentProfileKey);
    clearForm();
  }
}
async function markWorkoutComplete(){
  const day=qs("log-day").value, d=scheduleByDay(day);
  const ok=await insertRow({entry_date:new Date().toISOString().slice(0,10),loop_day:day,workout_title:d.title,exercise:COMPLETE_EX,decision:"complete",notes:"Workout completed",is_rest_day:false});
  if(ok){toast(`${activeProfile().name}: ${day} completed`); fillDaySelect(); showPage("dashboard")}
}
async function markWorkoutCompleteFromDashboard(){const n=activeSchedule()[nextDayIndex()]; qs("log-day").value=n.day; await markWorkoutComplete()}
async function logRestDay(){
  const n=activeSchedule()[nextDayIndex()];
  const ok=await insertRow({entry_date:new Date().toISOString().slice(0,10),loop_day:n.day,workout_title:"Rest day",exercise:"Rest day",decision:"rest",notes:"Recovery day",is_rest_day:true});
  if(ok) toast("Rest day logged");
}
async function deleteEntry(id){ if(!confirm("Delete this entry?"))return; const {error}=await supabaseClient.from("workout_entries").delete().eq("id",id); if(error){alert(error.message);return} await loadAllData(false); toast("Deleted") }
async function clearProfileData(){ if(!confirm(`Delete ALL data for ${activeProfile().name}?`))return; const {error}=await supabaseClient.from("workout_entries").delete().eq("user_id",user.id).eq("profile_key",currentProfileKey); if(error){alert(error.message);return} await loadAllData(false); toast("Profile data deleted") }

function usageEstimate(){
  const rows=entries.length+Object.keys(profileSettings).length;
  const mb=(entries.length*3 + Object.keys(profileSettings).length*12)/1024;
  const pct=Math.min(100,(mb/500)*100);
  let level="ok", msg="Storage estimate is safe.";
  if(mb>350){level="warn";msg="Storage estimate is getting high. Export a backup and consider pruning old notes."}
  if(mb>450){level="bad";msg="Storage estimate is near the free 500 MB database limit."}
  return {rows,mb,pct,level,msg};
}

function renderDashboard(){
  const n=activeSchedule()[nextDayIndex()];
  qs("brand-sub").textContent=`${activeProfile().name} · group tracker`;
  if(qs("active-profile-btn")) qs("active-profile-btn").textContent=activeProfile().name;
  qs("stat-workouts").textContent=completedEntries().length;
  qs("stat-next").textContent=n.day;
  qs("stat-next-title").textContent=n.title;
  qs("next-tag").textContent=`${activeProfile().name} · ${n.type}`;
  const u=usageEstimate();
  qs("usage-alert").style.display=u.level==="ok"?"none":"block";
  qs("usage-alert").className="warnbox "+u.level;
  qs("usage-alert").innerHTML=`<b>Storage alert:</b> ${u.msg} Estimated database use: ${u.mb.toFixed(2)} MB / 500 MB.`;
  qs("next-card").innerHTML=`<div class="workout-head"><div><div class="workout-title">${n.title}</div><div class="workout-sub">${activeProfile().name} · ${n.focus}. Complete this workout to advance this profile's loop.</div></div><div class="btnrow"><button class="btn primary" data-page="log">Log set</button><button class="btn" data-action="complete-dashboard-workout">Complete</button><button class="btn ghost" data-action="log-rest-day">Rest</button></div></div><div class="tablewrap"><table><thead><tr><th>Exercise</th><th>Sets</th><th>Target</th><th>Last load</th><th>Decision</th></tr></thead><tbody>${n.exs.map(e=>{const last=latestSetFor(e[0]);return `<tr><td><div class="exname">${e[0]}</div><div class="meta">${e[3]||""}</div></td><td class="mono">${e[1]}</td><td class="mono">${e[2]}</td><td class="mono">${last&&last.load!=null?last.load+" kg":"—"}</td><td>${last?`<span class="badge ${decisionClass(last.decision)}">${last.decision}</span>`:'<span class="meta">—</span>'}</td></tr>`}).join("")}</tbody></table></div>`;
  const recent=setEntries().slice(0,8); qs("recent-empty").style.display=recent.length?"none":"block"; qs("recent-body").innerHTML=recent.map(rowHtml).join("");
  qs("log-profile-tag").textContent=activeProfile().name;
}
function rowHtml(e){return `<tr><td class="mono">${e.date}</td><td>${profileByKey(e.profile).name}</td><td><span class="tag">${e.day}</span></td><td>${e.ex}</td><td class="mono">${e.load??"—"}${e.load!=null?" kg":""}</td><td class="mono">${e.s1}${e.s2?"/"+e.s2:""}</td><td><span class="badge ${decisionClass(e.decision)}">${e.decision}</span></td></tr>`}
function renderLoads(){
  const map={}; setEntries().forEach(e=>{if(!map[e.ex])map[e.ex]=e});
  const rows=Object.values(map); qs("loads-empty").style.display=rows.length?"none":"block";
  qs("loads-body").innerHTML=rows.map(e=>`<tr><td>${e.ex}</td><td class="mono">${e.load} kg</td><td class="mono">${e.s1}${e.s2?"/"+e.s2:""}</td><td class="mono">${e.range}</td><td><span class="badge ${decisionClass(e.decision)}">${e.decision}</span></td></tr>`).join("");
}
function buildFilters(){const fs=["all","current","Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","increase","complete"]; qs("filters").innerHTML=fs.map(f=>`<button class="${histFilter===f?'active':''}" data-filter="${f}">${f}</button>`).join("")}
function renderHistory(){
  buildFilters(); let rows=entries;
  if(histFilter==="current") rows=profileEntries();
  else if(histFilter==="increase") rows=setEntries().filter(e=>e.decision==="increase");
  else if(histFilter==="complete") rows=completedEntries();
  else if(histFilter!=="all") rows=entries.filter(e=>e.day===histFilter && e.profile===currentProfileKey);
  qs("hist-empty").style.display=rows.length?"none":"block";
  qs("hist-body").innerHTML=rows.map(e=>`<tr><td class="mono">${e.date}</td><td>${profileByKey(e.profile).name}</td><td>${e.day}</td><td>${e.ex===COMPLETE_EX?"Workout complete":e.ex}</td><td class="mono">${e.load??"—"}</td><td class="mono">${e.s1||"—"}</td><td class="mono">${e.s2||"—"}</td><td class="mono">${e.rir??"—"}</td><td><span class="badge ${decisionClass(e.decision)}">${e.decision}</span></td><td><button class="btn ghost small" data-delete-id="${e.id}">Del</button></td></tr>`).join("");
  qs("hist-cards").innerHTML=rows.map(e=>`<div class="history-card"><div class="top"><div><h3>${e.ex===COMPLETE_EX?"Workout complete":e.ex}</h3><div class="line">${profileByKey(e.profile).name} · ${e.date} · ${e.day} · ${e.load??"—"}${e.load!=null?" kg":""} · reps ${e.s1||"—"}${e.s2?"/"+e.s2:""}</div><div class="line">${e.notes||""}</div></div><span class="badge ${decisionClass(e.decision)}">${e.decision}</span></div><div class="btnrow" style="margin-top:10px"><button class="btn ghost" data-delete-id="${e.id}">Delete</button></div></div>`).join("");
}
function renderSchedule(){
  qs("schedule-title").textContent=`${activeProfile().name} schedule`;
  qs("schedule-expected").textContent=`${activeSettings().expected_sessions_per_week} / week`;
  qs("schedule-grid").innerHTML=activeSchedule().map(d=>`<div class="day-card"><div class="day-head"><div class="circle">${String(d.day).replace("Day ","")}</div><div><h3>${d.title}</h3><p>${d.focus||d.type}</p></div></div>${d.exs.map(e=>`<div class="exrow"><span>${e[0]}</span><span>${e[1]} × ${e[2]}</span></div>`).join("")}</div>`).join("");
}
function renderSettings(){
  qs("settings-profile").textContent=activeProfile().name;
  const u=usageEstimate();
  qs("usage-mb").textContent=u.mb.toFixed(2)+" MB";
  qs("usage-rows").textContent=u.rows;
  qs("usage-sub").textContent=`${u.pct.toFixed(2)}% of estimated free DB limit`;
  qs("usage-detail").className="warnbox "+u.level;
  qs("usage-detail").innerHTML=`<b>Usage estimate:</b> ${u.msg}<div class="bar"><span style="width:${u.pct}%"></span></div><br>Rows: ${u.rows}. Estimated size: ${u.mb.toFixed(2)} MB / 500 MB. This is a conservative estimate; exact database size requires Supabase dashboard access.`;
  fillProfileSelects();
  qs("edit-profile").value=editorProfileKey;
  qs("edit-profile-tag").textContent=profileByKey(editorProfileKey).name;
}
function loadEditorForProfile(key){
  editorProfileKey=key;
  const st=activeSettings(key); qs("edit-expected").value=st.expected_sessions_per_week;
  qs("edit-profile-tag").textContent=profileByKey(key).name;
  qs("schedule-editor").innerHTML=(st.schedule_json||[]).map((d,idx)=>`<div class="warnbox"><div class="formgrid"><div class="field"><label>Day title</label><input id="ed-title-${idx}" value="${escapeAttr(d.title)}"></div><div class="field"><label>Type / focus</label><input id="ed-focus-${idx}" value="${escapeAttr(d.focus||d.type||"")}"></div></div><div class="field" style="margin-top:10px"><label>Exercises — one per line: name | sets | reps | note</label><textarea id="ed-exs-${idx}">${(d.exs||[]).map(e=>e.join(" | ")).join("\n")}</textarea></div></div>`).join("");
}
function escapeAttr(s){return String(s||"").replaceAll("&","&amp;").replaceAll('"',"&quot;").replaceAll("<","&lt;")}
function parseExerciseLines(text){return text.split("\n").map(l=>l.trim()).filter(Boolean).map(l=>{const parts=l.split("|").map(x=>x.trim());return [parts[0]||"Exercise",parts[1]||"1",parts[2]||"6–10",parts[3]||""]})}
async function saveEditedSchedule(){
  const base=activeSettings(editorProfileKey); const sched=(base.schedule_json||[]).map((d,idx)=>({...d,title:qs(`ed-title-${idx}`).value.trim()||d.title,focus:qs(`ed-focus-${idx}`).value.trim()||d.focus,exs:parseExerciseLines(qs(`ed-exs-${idx}`).value)}));
  const row={user_id:user.id,profile_key:editorProfileKey,display_name:profileByKey(editorProfileKey).name,expected_sessions_per_week:Number(qs("edit-expected").value)||0,schedule_json:sched};
  const {error}=await supabaseClient.from("profile_settings").upsert(row,{onConflict:"user_id,profile_key"});
  if(error){alert(error.message);return}
  toast("Schedule saved"); await loadAllData(false); loadEditorForProfile(editorProfileKey);
}
async function resetEditedSchedule(){
  if(!confirm("Reset this profile schedule to its default?")) return;
  const p=profileByKey(editorProfileKey); const row={user_id:user.id,profile_key:p.key,display_name:p.name,expected_sessions_per_week:p.defaultExpected,schedule_json:p.defaultSchedule};
  const {error}=await supabaseClient.from("profile_settings").upsert(row,{onConflict:"user_id,profile_key"});
  if(error){alert(error.message);return}
  toast("Schedule reset"); await loadAllData(false); loadEditorForProfile(editorProfileKey);
}
function exportBackup(){
  const data={exported_at:new Date().toISOString(),profiles:profileSettings,entries};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="divinity-backup.json"; a.click(); URL.revokeObjectURL(url);
}

function renderAll(){
  if(!user) return;
  renderProfilePicker(); fillProfileSelects(); fillDaySelect(); renderDashboard(); renderLoads(); renderHistory(); renderSchedule(); renderSettings(); if(qs("schedule-editor").innerHTML==="") loadEditorForProfile(editorProfileKey);
}
function normalizeRange(range){const match=String(range||"").match(/(\d+)\D+(\d+)/);return match?`${match[1]}-${match[2]}`:""}
function selectedExercise(day=qs("log-day").value,key=currentProfileKey){return scheduleByDay(day,key).exs.find(e=>e[0]===qs("log-ex").value)}
function rangeForExercise(day=qs("log-day").value,key=currentProfileKey){const exercise=selectedExercise(day,key);return normalizeRange(exercise?.[2])||guessedRangeFor(qs("log-ex").value)}
function rangeMidpoint(range){const [min,max]=normalizeRange(range).split("-").map(Number);return Math.round((min+max)/2)}

const ACTIONS = {
  "sign-in":signInPassword,
  "reset-password":resetPassword,
  "sign-out":signOut,
  "hide-profile-picker":hideProfilePicker,
  "show-profile-picker":showProfilePicker,
  "refresh":loadAllData,
  "add-entry":addEntry,
  "complete-workout":markWorkoutComplete,
  "complete-dashboard-workout":markWorkoutCompleteFromDashboard,
  "log-rest-day":logRestDay,
  "clear-form":clearForm,
  "clear-profile-data":clearProfileData,
  "save-schedule":saveEditedSchedule,
  "reset-schedule":resetEditedSchedule,
  "export-backup":exportBackup
};

async function handleClick(event){
  const button=event.target.closest("button");
  if(!button)return;
  if(button.dataset.page){showPage(button.dataset.page);return}
  if(button.dataset.profile){switchProfile(button.dataset.profile,true);return}
  if(button.dataset.filter){histFilter=button.dataset.filter;renderHistory();return}
  if(button.dataset.deleteId){await deleteEntry(button.dataset.deleteId);return}
  const action=ACTIONS[button.dataset.action];
  if(action)await action();
}

function bindEvents(){
  document.addEventListener("click",handleClick);
  qs("login-password").addEventListener("keydown",event=>{if(event.key==="Enter")signInPassword()});
  qs("log-profile").addEventListener("change",event=>switchProfile(event.target.value));
  qs("log-day").addEventListener("change",fillExercisesForDay);
  qs("log-ex").addEventListener("change",setExerciseDefaults);
  qs("edit-profile").addEventListener("change",event=>loadEditorForProfile(event.target.value));
}

renderNavigation();
bindEvents();
supabaseClient.auth.onAuthStateChange((event, session)=>{ if(event==="SIGNED_IN") checkAuth(); });
checkAuth();
})();
