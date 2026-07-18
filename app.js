(()=>{
"use strict";

const SUPABASE_URL = "https://txdiazrvochdrlmlahbo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_c2FUhLGrPLvD8w6dj74TCQ_xolv2TEy";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
const {decide,escapeAttr,escapeHtml,exerciseIdentity,isUuid,localDateKey,normalizeRange,personalRecord,progressSeries,rangeMidpoint,slugifyExercise,validateBackup}=DivinityCore;

const PROFILES = globalThis.DIVINITY_PROFILES;
const COMPLETE_EX = "__WORKOUT_COMPLETE__";
const NAV_ITEMS = [
  {page:"dashboard",desktop:"Dashboard",mobile:"Home"},
  {page:"log",desktop:"Log",mobile:"Log"},
  {page:"history",desktop:"History",mobile:"History"},
  {page:"schedule",desktop:"Schedule"},
  {page:"settings",desktop:"Settings",mobile:"More"}
];
let entries = [];
let allEntries = [];
let checkins = [];
let profileSettings = {};
let user = null;
let currentProfileKey = localStorage.getItem("divinity-profile") || "alfred";
let histFilter = "all";
let editorProfileKey = "alfred";
let historyPage = 0;
let lastDeletedId = null;
let timerInterval = null;
let timerEndsAt = 0;
let deferredInstallPrompt = null;
let waitingWorker = null;
const DATA_PAGE_SIZE = 500;
const HISTORY_PAGE_SIZE = 50;

function qs(id){return document.getElementById(id)}
function profileByKey(key){return PROFILES.find(p=>p.key===key)||PROFILES[0]}
function catalogExerciseId(name){
  const normalized=String(name||"").toLowerCase();
  for(const profile of PROFILES)for(const day of profile.defaultSchedule)for(const exercise of day.exs){if([exercise[0],...(exercise[5]||[])].some(alias=>String(alias).toLowerCase()===normalized))return exercise[4]}
  return null;
}
function stableExerciseId(exercise){return exercise?.[4]||catalogExerciseId(exercise?.[0])||exerciseIdentity(exercise)}
function stableEntryExerciseId(name,explicitId){const derived=slugifyExercise(name),catalogId=catalogExerciseId(name);return explicitId&&explicitId!==derived?explicitId:(catalogId||explicitId||derived)}
function activeProfile(){return profileByKey(currentProfileKey)}
function activeSettings(key=currentProfileKey){return profileSettings[key] || {...profileByKey(key), schedule_json: profileByKey(key).defaultSchedule, expected_sessions_per_week: profileByKey(key).defaultExpected}}
function activeSchedule(key=currentProfileKey){return activeSettings(key).schedule_json || profileByKey(key).defaultSchedule}
function toast(msg){const t=qs("toast");t.textContent=msg;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2500)}
function setSync(status,msg){const d=qs("sync-dot"), s=qs("sync-text"); d.className="dot "+(status||""); s.textContent=msg;}
function reportError(context,error){
  console.error(context,error);
  setSync("bad","Error");
  alert(`${context}: ${error?.message||error}`);
}
function queryData(result,context){if(result.error)throw new Error(`${context}: ${result.error.message}`);return result.data||[]}
function setEmptyState(id,hasRows){qs(id).style.display=hasRows?"none":"block"}
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
}
async function resetPassword(){
  const email=qs("login-email").value.trim();
  if(!email){qs("auth-msg").textContent="Enter email first.";return}
  const {error}=await supabaseClient.auth.resetPasswordForEmail(email,{redirectTo:window.location.origin+window.location.pathname});
  qs("auth-msg").textContent=error?error.message:"Password reset email sent.";
}
function showPasswordRecovery(){qs("password-recovery").classList.add("show");qs("recovery-password").focus()}
async function updateRecoveredPassword(){
  const password=qs("recovery-password").value,confirmation=qs("recovery-confirm").value,msg=qs("recovery-msg");
  if(password.length<8){msg.textContent="Use at least 8 characters.";return}
  if(password!==confirmation){msg.textContent="Passwords do not match.";return}
  msg.textContent="Updating...";
  const {error}=await supabaseClient.auth.updateUser({password});
  if(error){msg.textContent=error.message;return}
  qs("password-recovery").classList.remove("show");
  history.replaceState(null,"",window.location.pathname);
  toast("Password updated");
}
async function signOut(){const {error}=await supabaseClient.auth.signOut();if(error){reportError("Could not sign out",error);return}location.reload()}
async function getUser(){const {data,error}=await supabaseClient.auth.getUser();if(error?.name==="AuthSessionMissingError")return null;if(error){reportError("Could not check authentication",error);return null}return data.user}
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
    await upsertProfileSettings(row);
    profileSettings[p.key]={...p,...row};
  }
}

async function loadAllData(show=true){
  try{
    if(show)setSync("","Loading");
    user=user||await getUser();
    if(!user){entries=[];renderAll();return}
    const settingsRows=queryData(await supabaseClient.from("profile_settings").select("*").eq("user_id",user.id),"Could not load profile settings");
    profileSettings={};
    settingsRows.forEach(r=>{const base=profileByKey(r.profile_key);profileSettings[r.profile_key]={...base,...r}});
    await ensureProfileSettings();
    const [entryRows,checkinRows]=await Promise.all([loadWorkoutEntries(),loadCheckins()]);
    allEntries=entryRows.map(mapWorkoutEntry);
    entries=allEntries.filter(entry=>!entry.deletedAt);
    checkins=checkinRows.map(r=>({id:r.id,profile:r.profile_key,date:r.entry_date,weight:r.body_weight_kg==null?null:Number(r.body_weight_kg),sleep:r.sleep_hours==null?null:Number(r.sleep_hours),readiness:r.readiness,pain:r.pain_notes||""}));
    setSync("ok","Synced");
    renderAll();
  }catch(error){reportError("Sync failed",error)}
}

async function loadWorkoutEntries(){
  const rows=[];
  for(let from=0;;from+=DATA_PAGE_SIZE){
    const result=await supabaseClient.from("workout_entries").select("*").eq("user_id",user.id).order("created_at",{ascending:false}).order("id",{ascending:false}).range(from,from+DATA_PAGE_SIZE-1);
    const page=queryData(result,"Could not load workout entries");
    rows.push(...page);
    if(page.length<DATA_PAGE_SIZE) return rows;
  }
}

async function loadCheckins(){
  return queryData(await supabaseClient.from("daily_checkins").select("*").eq("user_id",user.id).order("entry_date",{ascending:false}),"Could not load daily check-ins");
}

function mapWorkoutEntry(r){return {id:r.id,date:r.entry_date,profile:r.profile_key||"alfred",day:r.loop_day,title:r.workout_title,ex:r.exercise,exerciseId:stableEntryExerciseId(r.exercise,r.exercise_id),load:r.load_kg==null?null:Number(r.load_kg),s1:r.set_1_reps||0,s2:r.set_2_reps||0,rir:r.rir,range:r.rep_range,decision:r.decision||"",notes:r.notes||"",isRest:!!r.is_rest_day,setType:r.set_type||"work",deletedAt:r.deleted_at,created:r.created_at}}
async function upsertProfileSettings(row){const {error}=await supabaseClient.from("profile_settings").upsert(row,{onConflict:"user_id,profile_key"});if(error)throw error}

function switchProfile(key, close=false){
  currentProfileKey=key;localStorage.setItem("divinity-profile",key);
  if(close) hideProfilePicker();
  renderAll();
  fillDaySelect();
}
function profileEntries(key=currentProfileKey){return entries.filter(e=>e.profile===key)}
function completedEntries(key=currentProfileKey){return profileEntries(key).filter(e=>e.ex===COMPLETE_EX&&!e.isRest)}
function setEntries(key=currentProfileKey){return profileEntries(key).filter(e=>e.ex!==COMPLETE_EX&&!e.isRest&&e.setType!=="warmup")}
function loggedSetEntries(key=currentProfileKey){return profileEntries(key).filter(e=>e.ex!==COMPLETE_EX&&!e.isRest)}
function scheduleByDay(day,key=currentProfileKey){return activeSchedule(key).find(x=>x.day===day)||activeSchedule(key)[0]}
// Completion rows are already newest-first, so advancing follows the configured
// schedule order instead of assuming that day labels contain consecutive numbers.
function nextDayIndex(key=currentProfileKey){const schedule=activeSchedule(key);const c=completedEntries(key)[0];if(!c)return 0;const idx=schedule.findIndex(d=>d.day===c.day);return idx<0?0:(idx+1)%schedule.length}
function latestSetFor(ex,key=currentProfileKey){const id=Array.isArray(ex)?stableExerciseId(ex):ex;return setEntries(key).find(e=>e.exerciseId===id)}
function decisionClass(d){return d==="increase"?"increase":d==="reduce"?"reduce":d==="rest"?"rest":d==="complete"?"complete":"repeat"}

// Double-progression rules live in core.js so they can be tested without a browser.
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
  qs("log-day").innerHTML=sched.map(d=>`<option value="${escapeAttr(d.day)}">${escapeHtml(d.day)} — ${escapeHtml(d.title)}</option>`).join("");
  qs("log-day").value=sched[nextDayIndex(currentProfileKey)].day;
  fillExercisesForDay();
}
// Only sets newer than this day's latest completion belong to the current loop.
// This prevents an old workout from shifting the first exercise of a new loop.
function dayEntries(day,key=currentProfileKey){const completion=completedEntries(key).find(e=>e.day===day);return setEntries(key).filter(e=>e.day===day&&(!completion||e.created>completion.created))}
function lastLoggedExerciseForDay(day,key=currentProfileKey){const dayLog=dayEntries(day,key);return dayLog.length?dayLog[0].exerciseId:null}
function nextExerciseForDay(day,key=currentProfileKey){const d=scheduleByDay(day,key);const last=lastLoggedExerciseForDay(day,key);if(!last) return stableExerciseId(d.exs[0]);const idx=d.exs.findIndex(e=>stableExerciseId(e)===last);return stableExerciseId(d.exs[(idx+1+d.exs.length)%d.exs.length])}
function renderLogPreview(){const exercise=selectedExercise(); if(!exercise) return; const last=latestSetFor(exercise); if(!last){qs("log-preview").innerHTML=`<div class="warnbox">Next exercise: <strong>${escapeHtml(exercise[0])}</strong>. No recent work set yet.</div>`; return;} qs("log-preview").innerHTML=`<div class="warnbox">Next exercise: <strong>${escapeHtml(exercise[0])}</strong>. Last work set ${escapeHtml(last.load??"—")} kg, ${escapeHtml(last.s1)}${last.s2?"/"+escapeHtml(last.s2):""} reps, ${escapeHtml(last.decision)}.</div>`}
function fillExercisesForDay(){
  const d=scheduleByDay(qs("log-day").value,currentProfileKey);
  qs("log-ex").innerHTML=d.exs.map(e=>`<option value="${escapeAttr(stableExerciseId(e))}">${escapeHtml(e[0])}</option>`).join("");
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
  if(error){reportError("Could not save workout entry",error);return false}
  setSync("ok","Synced"); await loadAllData(false); return true;
}
async function addEntry(){
  const day=qs("log-day").value, exercise=selectedExercise(), ex=exercise?.[0], exerciseId=stableExerciseId(exercise), setType=qs("log-set-type").value, load=parseFloat(qs("log-load").value), s1=parseInt(qs("log-s1").value), s2=parseInt(qs("log-s2").value)||0, rir=parseInt(qs("log-rir").value), range=qs("log-range").value, notes=qs("log-notes").value.trim();
  if(isNaN(load)||!s1||(setType==="work"&&isNaN(rir))){toast(setType==="work"?"Fill load, set 1, and RIR":"Fill load and set 1");return}
  const dec=setType==="warmup"?{decision:"warmup",label:"Warm-up saved",reason:"Warm-up sets do not affect progression or records.",cls:"repeat"}:decide(s1,s2,rir,range); const d=scheduleByDay(day);
  const ok=await insertRow({entry_date:localDateKey(),loop_day:day,workout_title:d.title,exercise:ex,exercise_id:exerciseId,set_type:setType,load_kg:load,set_1_reps:s1,set_2_reps:s2||null,rir:Number.isNaN(rir)?null:rir,rep_range:range,decision:dec.decision,notes,is_rest_day:false});
  if(ok){
    qs("decision").classList.add("show");
    qs("decision-main").innerHTML=`<span class="badge ${dec.cls}">${dec.label}</span>`;
    qs("decision-reason").textContent=dec.reason;
    toast("Set saved");
    startRestTimer(setType==="warmup"?60:120);
    if(setType==="work")qs("log-ex").value=nextExerciseForDay(day,currentProfileKey);
    clearForm();
  }
}
async function markWorkoutComplete(){
  const day=qs("log-day").value, d=scheduleByDay(day);
  const ok=await insertRow({entry_date:localDateKey(),loop_day:day,workout_title:d.title,exercise:COMPLETE_EX,decision:"complete",notes:"Workout completed",is_rest_day:false});
  if(ok){toast(`${activeProfile().name}: ${day} completed`); fillDaySelect(); showPage("dashboard")}
}
async function markWorkoutCompleteFromDashboard(){const n=activeSchedule()[nextDayIndex()]; qs("log-day").value=n.day; await markWorkoutComplete()}
async function logRestDay(){
  const n=activeSchedule()[nextDayIndex()];
  const ok=await insertRow({entry_date:localDateKey(),loop_day:n.day,workout_title:"Rest day",exercise:"Rest day",decision:"rest",notes:"Recovery day",is_rest_day:true});
  if(ok) toast("Rest day logged");
}
async function deleteEntry(id){ if(!confirm("Move this entry to trash?"))return; const {error}=await supabaseClient.from("workout_entries").update({deleted_at:new Date().toISOString()}).eq("id",id).eq("user_id",user.id); if(error){reportError("Could not move workout entry",error);return} lastDeletedId=id;qs("undo-bar").hidden=false;await loadAllData(false);toast("Moved to trash") }
async function restoreEntry(id){const {error}=await supabaseClient.from("workout_entries").update({deleted_at:null}).eq("id",id).eq("user_id",user.id);if(error){reportError("Could not restore entry",error);return}if(lastDeletedId===id){lastDeletedId=null;qs("undo-bar").hidden=true}await loadAllData(false);toast("Restored")}
async function permanentlyDeleteEntry(id){if(!confirm("Permanently delete this entry? This cannot be undone."))return;const {error}=await supabaseClient.from("workout_entries").delete().eq("id",id).eq("user_id",user.id);if(error){reportError("Could not permanently delete entry",error);return}await loadAllData(false);toast("Permanently deleted")}
async function undoDelete(){if(lastDeletedId)await restoreEntry(lastDeletedId)}
async function clearProfileData(){ if(!confirm(`Move ALL data for ${activeProfile().name} to trash?`))return; const {error}=await supabaseClient.from("workout_entries").update({deleted_at:new Date().toISOString()}).eq("user_id",user.id).eq("profile_key",currentProfileKey).is("deleted_at",null); if(error){reportError("Could not move profile data",error);return} await loadAllData(false); toast("Profile data moved to trash") }

function stopRestTimer(){clearInterval(timerInterval);timerInterval=null;timerEndsAt=0;qs("timer-display").textContent="00:00"}
function startRestTimer(seconds){stopRestTimer();timerEndsAt=Date.now()+seconds*1000;const tick=()=>{const left=Math.max(0,Math.ceil((timerEndsAt-Date.now())/1000));qs("timer-display").textContent=`${String(Math.floor(left/60)).padStart(2,"0")}:${String(left%60).padStart(2,"0")}`;if(!left){stopRestTimer();navigator.vibrate?.([150,100,150]);toast("Rest complete")}};tick();timerInterval=setInterval(tick,250)}

function todayCheckin(){return checkins.find(item=>item.profile===currentProfileKey&&item.date===localDateKey())}
function renderCheckin(){const item=todayCheckin();qs("checkin-date").textContent=localDateKey();qs("checkin-weight").value=item?.weight??"";qs("checkin-sleep").value=item?.sleep??"";qs("checkin-readiness").value=item?.readiness??"";qs("checkin-pain").value=item?.pain??""}
async function saveCheckin(){
  const numeric=(id)=>qs(id).value===""?null:Number(qs(id).value);
  const row={user_id:user.id,profile_key:currentProfileKey,entry_date:localDateKey(),body_weight_kg:numeric("checkin-weight"),sleep_hours:numeric("checkin-sleep"),readiness:numeric("checkin-readiness"),pain_notes:qs("checkin-pain").value.trim(),updated_at:new Date().toISOString()};
  const {error}=await supabaseClient.from("daily_checkins").upsert(row,{onConflict:"user_id,profile_key,entry_date"});
  if(error){reportError("Could not save daily check-in",error);return}await loadAllData(false);toast("Check-in saved")
}

function usageEstimate(){
  const rows=allEntries.length+checkins.length+Object.keys(profileSettings).length;
  const mb=(allEntries.length*3+checkins.length*2+Object.keys(profileSettings).length*12)/1024;
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
  qs("next-card").innerHTML=`<div class="workout-head"><div><div class="workout-title">${escapeHtml(n.title)}</div><div class="workout-sub">${escapeHtml(activeProfile().name)} · ${escapeHtml(n.focus)}. Complete this workout to advance this profile's loop.</div></div><div class="btnrow"><button class="btn primary" data-page="log">Log set</button><button class="btn" data-action="complete-dashboard-workout">Complete</button><button class="btn ghost" data-action="log-rest-day">Rest</button></div></div><div class="tablewrap"><table><thead><tr><th>Exercise</th><th>Sets</th><th>Target</th><th>Last load</th><th>Decision</th></tr></thead><tbody>${n.exs.map(e=>{const last=latestSetFor(e);return `<tr><td><div class="exname">${escapeHtml(e[0])}</div><div class="meta">${escapeHtml(e[3]||"")}</div></td><td class="mono">${escapeHtml(e[1])}</td><td class="mono">${escapeHtml(e[2])}</td><td class="mono">${last&&last.load!=null?escapeHtml(last.load)+" kg":"—"}</td><td>${last?`<span class="badge ${decisionClass(last.decision)}">${escapeHtml(last.decision)}</span>`:'<span class="meta">—</span>'}</td></tr>`}).join("")}</tbody></table></div>`;
  const recent=setEntries().slice(0,8); setEmptyState("recent-empty",recent.length>0); qs("recent-body").innerHTML=recent.map(rowHtml).join("");
  qs("log-profile-tag").textContent=activeProfile().name;
}
function rowHtml(e){return `<tr><td class="mono">${escapeHtml(e.date)}</td><td>${escapeHtml(profileByKey(e.profile).name)}</td><td><span class="tag">${escapeHtml(e.day)}</span></td><td>${escapeHtml(e.ex)}</td><td class="mono">${escapeHtml(e.load??"—")}${e.load!=null?" kg":""}</td><td class="mono">${escapeHtml(e.s1)}${e.s2?"/"+escapeHtml(e.s2):""}</td><td><span class="badge ${decisionClass(e.decision)}">${escapeHtml(e.decision)}</span></td></tr>`}
function renderLoads(){
  const map={}; setEntries().forEach(e=>{if(!map[e.ex])map[e.ex]=e});
  const rows=Object.values(map); setEmptyState("loads-empty",rows.length>0);
  qs("loads-body").innerHTML=rows.map(e=>`<tr><td>${escapeHtml(e.ex)}</td><td class="mono">${escapeHtml(e.load)} kg</td><td class="mono">${escapeHtml(e.s1)}${e.s2?"/"+escapeHtml(e.s2):""}</td><td class="mono">${escapeHtml(e.range)}</td><td><span class="badge ${decisionClass(e.decision)}">${escapeHtml(e.decision)}</span></td></tr>`).join("");
}
function buildFilters(){const fs=["all","current","Day 1","Day 2","Day 3","Day 4","Day 5","Day 6","increase","complete"]; qs("filters").innerHTML=fs.map(f=>`<button class="${histFilter===f?'active':''}" data-filter="${f}">${f}</button>`).join("")}
function renderHistory(){
  buildFilters(); let rows=entries;
  if(histFilter==="current") rows=profileEntries();
  else if(histFilter==="increase") rows=setEntries().filter(e=>e.decision==="increase");
  else if(histFilter==="complete") rows=completedEntries();
  else if(histFilter!=="all") rows=entries.filter(e=>e.day===histFilter && e.profile===currentProfileKey);
  const totalPages=Math.max(1,Math.ceil(rows.length/HISTORY_PAGE_SIZE));
  historyPage=Math.min(historyPage,totalPages-1);
  const pageRows=rows.slice(historyPage*HISTORY_PAGE_SIZE,(historyPage+1)*HISTORY_PAGE_SIZE);
  setEmptyState("hist-empty",rows.length>0);
  qs("hist-body").innerHTML=pageRows.map(e=>`<tr><td class="mono">${escapeHtml(e.date)}</td><td>${escapeHtml(profileByKey(e.profile).name)}</td><td>${escapeHtml(e.day)}</td><td>${escapeHtml(e.ex===COMPLETE_EX?"Workout complete":e.ex)}</td><td class="mono">${escapeHtml(e.load??"—")}</td><td class="mono">${escapeHtml(e.s1||"—")}</td><td class="mono">${escapeHtml(e.s2||"—")}</td><td class="mono">${escapeHtml(e.rir??"—")}</td><td><span class="badge ${decisionClass(e.decision)}">${escapeHtml(e.decision)}</span></td><td><button class="btn ghost small" data-delete-id="${escapeAttr(e.id)}">Del</button></td></tr>`).join("");
  qs("hist-cards").innerHTML=pageRows.map(e=>`<div class="history-card"><div class="top"><div><h3>${escapeHtml(e.ex===COMPLETE_EX?"Workout complete":e.ex)}</h3><div class="line">${escapeHtml(profileByKey(e.profile).name)} · ${escapeHtml(e.date)} · ${escapeHtml(e.day)} · ${escapeHtml(e.load??"—")}${e.load!=null?" kg":""} · reps ${escapeHtml(e.s1||"—")}${e.s2?"/"+escapeHtml(e.s2):""}</div><div class="line">${escapeHtml(e.notes||"")}</div></div><span class="badge ${decisionClass(e.decision)}">${escapeHtml(e.decision)}</span></div><div class="btnrow" style="margin-top:10px"><button class="btn ghost" data-delete-id="${escapeAttr(e.id)}">Delete</button></div></div>`).join("");
  qs("history-page").textContent=rows.length?`Page ${historyPage+1} of ${totalPages} · ${rows.length} entries`:"No entries";
  qs("history-prev").disabled=historyPage===0;
  qs("history-next").disabled=historyPage>=totalPages-1;
  renderProgress();renderTrash();
}
function renderProgress(){
  const select=qs("progress-exercise"),sets=setEntries(),catalog=new Map();sets.forEach(entry=>catalog.set(entry.exerciseId,entry.ex));
  const previous=select.value;select.innerHTML=[...catalog].sort((a,b)=>a[1].localeCompare(b[1])).map(([id,name])=>`<option value="${escapeAttr(id)}">${escapeHtml(name)}</option>`).join("");
  if([...select.options].some(option=>option.value===previous))select.value=previous;
  const id=select.value,series=progressSeries(sets,id),record=personalRecord(sets,id);
  qs("progress-pr").textContent=record?`${record.load} kg`:"—";qs("progress-pr-date").textContent=record?.date||"No work sets";
  if(!series.length){qs("progress-chart").innerHTML='<text x="300" y="95" text-anchor="middle">No progression data</text>';return}
  const loads=series.map(item=>item.load),min=Math.min(...loads),max=Math.max(...loads),span=max-min||1;
  const points=series.map((item,index)=>`${20+(index/Math.max(1,series.length-1))*560},${155-((item.load-min)/span)*125}`).join(" ");
  qs("progress-chart").innerHTML=`<line x1="20" y1="155" x2="580" y2="155"/><polyline points="${points}"/><text x="20" y="175">${escapeHtml(series[0].date)}</text><text x="580" y="175" text-anchor="end">${escapeHtml(series.at(-1).date)}</text>`;
}
function renderTrash(){const rows=allEntries.filter(entry=>entry.deletedAt&&entry.profile===currentProfileKey);qs("trash-count").textContent=rows.length;qs("trash-list").innerHTML=rows.length?rows.slice(0,50).map(entry=>`<div class="warnbox"><b>${escapeHtml(entry.ex===COMPLETE_EX?"Workout complete":entry.ex)}</b> · ${escapeHtml(entry.date)}<div class="btnrow" style="margin-top:8px"><button class="btn small" data-restore-id="${escapeAttr(entry.id)}">Restore</button><button class="btn small bad" data-permanent-id="${escapeAttr(entry.id)}">Delete permanently</button></div></div>`).join(""):'<div class="empty"><p>Trash is empty.</p></div>'}
function renderSchedule(){
  qs("schedule-title").textContent=`${activeProfile().name} schedule`;
  qs("schedule-expected").textContent=`${activeSettings().expected_sessions_per_week} / week`;
  qs("schedule-grid").innerHTML=activeSchedule().map(d=>`<div class="day-card"><div class="day-head"><div class="circle">${escapeHtml(String(d.day).replace("Day ",""))}</div><div><h3>${escapeHtml(d.title)}</h3><p>${escapeHtml(d.focus||d.type)}</p></div></div>${d.exs.map(e=>`<div class="exrow"><span>${escapeHtml(e[0])}</span><span>${escapeHtml(e[1])} × ${escapeHtml(e[2])}</span></div>`).join("")}</div>`).join("");
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
  qs("schedule-editor").innerHTML=(st.schedule_json||[]).map((d,idx)=>`<div class="warnbox"><div class="formgrid"><div class="field"><label>Day title</label><input id="ed-title-${idx}" value="${escapeAttr(d.title)}"></div><div class="field"><label>Type / focus</label><input id="ed-focus-${idx}" value="${escapeAttr(d.focus||d.type||"")}"></div></div><div class="field" style="margin-top:10px"><label>Exercises — name | sets | reps | note | stable ID | aliases</label><textarea id="ed-exs-${idx}">${escapeHtml((d.exs||[]).map(e=>[e[0],e[1],e[2],e[3],stableExerciseId(e),(e[5]||[]).join(", ")].join(" | ")).join("\n"))}</textarea></div></div>`).join("");
}
function parseExerciseLines(text){return text.split("\n").map(l=>l.trim()).filter(Boolean).map(l=>{const parts=l.split("|").map(x=>x.trim());return [parts[0]||"Exercise",parts[1]||"1",parts[2]||"6–10",parts[3]||"",parts[4]||slugifyExercise(parts[0]),parts[5]?parts[5].split(",").map(x=>x.trim()).filter(Boolean):[]]})}
async function saveEditedSchedule(){
  try{
    const base=activeSettings(editorProfileKey); const sched=(base.schedule_json||[]).map((d,idx)=>({...d,title:qs(`ed-title-${idx}`).value.trim()||d.title,focus:qs(`ed-focus-${idx}`).value.trim()||d.focus,exs:parseExerciseLines(qs(`ed-exs-${idx}`).value)}));
    const row={user_id:user.id,profile_key:editorProfileKey,display_name:profileByKey(editorProfileKey).name,expected_sessions_per_week:Number(qs("edit-expected").value)||0,schedule_json:sched};
    await upsertProfileSettings(row);
    toast("Schedule saved"); await loadAllData(false); loadEditorForProfile(editorProfileKey);
  }catch(error){reportError("Could not save schedule",error)}
}
async function resetEditedSchedule(){
  if(!confirm("Reset this profile schedule to its default?")) return;
  try{
    const p=profileByKey(editorProfileKey); const row={user_id:user.id,profile_key:p.key,display_name:p.name,expected_sessions_per_week:p.defaultExpected,schedule_json:p.defaultSchedule};
    await upsertProfileSettings(row);
    toast("Schedule reset"); await loadAllData(false); loadEditorForProfile(editorProfileKey);
  }catch(error){reportError("Could not reset schedule",error)}
}
function exportBackup(){
  const data={schema_version:2,exported_at:new Date().toISOString(),profiles:profileSettings,entries:allEntries,checkins};
  const blob=new Blob([JSON.stringify(data,null,2)],{type:"application/json"});
  const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="divinity-backup.json"; a.click(); URL.revokeObjectURL(url);
}
function chooseImport(){qs("import-file").click()}
function entryToRow(entry){const row={user_id:user.id,profile_key:entry.profile||"alfred",profile_name:profileByKey(entry.profile).name,entry_date:entry.date,loop_day:entry.day,workout_title:entry.title,exercise:entry.ex,exercise_id:entry.exerciseId||slugifyExercise(entry.ex),load_kg:entry.load,set_1_reps:entry.s1||null,set_2_reps:entry.s2||null,rir:entry.rir,rep_range:entry.range,decision:entry.decision,notes:entry.notes||"",is_rest_day:!!entry.isRest,set_type:entry.setType||"work",deleted_at:entry.deletedAt||null,created_at:entry.created||undefined};if(isUuid(entry.id))row.id=entry.id;return row}
async function importBackup(file){
  try{
    const data=validateBackup(JSON.parse(await file.text()));
    if(!confirm(`Import ${(data.entries||[]).length} entries and ${(data.checkins||[]).length} check-ins? Existing matching records will be updated.`))return;
    const profiles=Object.values(data.profiles||{}).filter(item=>item?.profile_key&&PROFILES.some(p=>p.key===item.profile_key)).map(item=>({user_id:user.id,profile_key:item.profile_key,display_name:String(item.display_name||profileByKey(item.profile_key).name),expected_sessions_per_week:Number(item.expected_sessions_per_week)||0,schedule_json:Array.isArray(item.schedule_json)?item.schedule_json:profileByKey(item.profile_key).defaultSchedule}));
    if(profiles.length){const {error}=await supabaseClient.from("profile_settings").upsert(profiles,{onConflict:"user_id,profile_key"});if(error)throw error}
    const rows=(data.entries||[]).filter(item=>item?.ex&&item?.date).map(entryToRow);for(let index=0;index<rows.length;index+=100){const {error}=await supabaseClient.from("workout_entries").upsert(rows.slice(index,index+100),{onConflict:"id"});if(error)throw error}
    const importedCheckins=(data.checkins||[]).filter(item=>item?.date).map(item=>({user_id:user.id,profile_key:item.profile||"alfred",entry_date:item.date,body_weight_kg:item.weight??null,sleep_hours:item.sleep??null,readiness:item.readiness??null,pain_notes:String(item.pain||"").slice(0,1000)}));if(importedCheckins.length){const {error}=await supabaseClient.from("daily_checkins").upsert(importedCheckins,{onConflict:"user_id,profile_key,entry_date"});if(error)throw error}
    await loadAllData(false);toast("Backup imported")
  }catch(error){reportError("Could not import backup",error)}finally{qs("import-file").value=""}
}

function renderAll(){
  if(!user) return;
  renderProfilePicker(); fillProfileSelects(); fillDaySelect(); renderDashboard(); renderCheckin(); renderLoads(); renderHistory(); renderSchedule(); renderSettings(); if(qs("schedule-editor").innerHTML==="") loadEditorForProfile(editorProfileKey);
}
function selectedExercise(day=qs("log-day").value,key=currentProfileKey){return scheduleByDay(day,key).exs.find(e=>stableExerciseId(e)===qs("log-ex").value)}
function rangeForExercise(day=qs("log-day").value,key=currentProfileKey){const exercise=selectedExercise(day,key);return normalizeRange(exercise?.[2])||guessedRangeFor(exercise?.[0]||"")}
function previousHistoryPage(){if(historyPage>0){historyPage--;renderHistory()}}
function nextHistoryPage(){historyPage++;renderHistory()}

const ACTIONS = {
  "sign-in":signInPassword,
  "reset-password":resetPassword,
  "update-password":updateRecoveredPassword,
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
  "save-checkin":saveCheckin,
  "stop-timer":stopRestTimer,
  "undo-delete":undoDelete,
  "save-schedule":saveEditedSchedule,
  "reset-schedule":resetEditedSchedule,
  "export-backup":exportBackup,
  "choose-import":chooseImport,
  "install-app":installApp,
  "apply-update":applyUpdate,
  "history-prev":previousHistoryPage,
  "history-next":nextHistoryPage
};

async function handleClick(event){
  try{
    const button=event.target.closest("button");
    if(!button)return;
    if(button.dataset.page){showPage(button.dataset.page);return}
    if(button.dataset.profile){switchProfile(button.dataset.profile,true);return}
    if(button.dataset.filter){histFilter=button.dataset.filter;historyPage=0;renderHistory();return}
    if(button.dataset.timer){startRestTimer(Number(button.dataset.timer));return}
    if(button.dataset.deleteId){await deleteEntry(button.dataset.deleteId);return}
    if(button.dataset.restoreId){await restoreEntry(button.dataset.restoreId);return}
    if(button.dataset.permanentId){await permanentlyDeleteEntry(button.dataset.permanentId);return}
    const action=ACTIONS[button.dataset.action];
    if(action)await action();
  }catch(error){reportError("Action failed",error)}
}

function bindEvents(){
  document.addEventListener("click",handleClick);
  qs("login-password").addEventListener("keydown",event=>{if(event.key==="Enter")signInPassword()});
  qs("log-profile").addEventListener("change",event=>switchProfile(event.target.value));
  qs("log-day").addEventListener("change",fillExercisesForDay);
  qs("log-ex").addEventListener("change",setExerciseDefaults);
  qs("edit-profile").addEventListener("change",event=>loadEditorForProfile(event.target.value));
  qs("progress-exercise").addEventListener("change",renderProgress);
  qs("import-file").addEventListener("change",event=>{const file=event.target.files?.[0];if(file)importBackup(file)});
}

function updateConnectionStatus(){qs("connection-banner").hidden=navigator.onLine}
async function installApp(){if(!deferredInstallPrompt)return;await deferredInstallPrompt.prompt();deferredInstallPrompt=null;qs("install-app").hidden=true}
function applyUpdate(){if(waitingWorker)waitingWorker.postMessage({type:"SKIP_WAITING"});else location.reload()}
async function registerServiceWorker(){
  if(!("serviceWorker" in navigator))return;
  const registration=await navigator.serviceWorker.register("./sw.js");
  if(registration.waiting){waitingWorker=registration.waiting;qs("update-banner").hidden=false}
  registration.addEventListener("updatefound",()=>{const worker=registration.installing;worker?.addEventListener("statechange",()=>{if(worker.state==="installed"&&navigator.serviceWorker.controller){waitingWorker=worker;qs("update-banner").hidden=false}})});
  let refreshing=false;navigator.serviceWorker.addEventListener("controllerchange",()=>{if(!refreshing){refreshing=true;location.reload()}});
}

renderNavigation();
bindEvents();
updateConnectionStatus();
window.addEventListener("online",updateConnectionStatus);
window.addEventListener("offline",updateConnectionStatus);
window.addEventListener("beforeinstallprompt",event=>{event.preventDefault();deferredInstallPrompt=event;qs("install-app").hidden=false});
registerServiceWorker().catch(error=>console.error("Service worker registration failed",error));
supabaseClient.auth.onAuthStateChange(event=>{
  if(event==="PASSWORD_RECOVERY"){showPasswordRecovery();return}
  if(event==="SIGNED_IN")setTimeout(()=>checkAuth().catch(error=>reportError("Sign-in failed",error)),0);
});
checkAuth().catch(error=>reportError("Startup failed",error));
})();
