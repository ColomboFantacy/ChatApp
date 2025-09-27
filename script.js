const config = {
  adLink: "https://www.revenuecpmgate.com/ag8r7bq8b6?key=7e925c0ec2b4d12a9b138108e5db4922",
  logo: "logo.png",
  background: "background.png",
  profiles: [
    { id: "p1", name: "Ashawaree", age: 24, location: "Nugegoda", phone: "+94 70745871", img: "profiles/profile1.png", online: true },
    { id: "p2", name: "Shanika", age: 25, location: "Baththaramulla", phone: "+94 71724899", img: "profiles/profile2.png", online: true },
    { id: "p3", name: "Niluka", age: 29, location: "Wellawatte", phone: "+94 77328556", img: "profiles/profile3.png", online: true },
    { id: "p4", name: "Sheron", age: 31, location: "Rajagiriya", phone: "+94 77728823", img: "profiles/profile4.png", online: true },
    { id: "p5", name: "Asini", age: 24, location: "Maharagama", phone: "+94 74451507", img: "profiles/profile5.png", online: true },
    { id: "p6", name: "Kumari", age: 26, location: "Dematagoda", phone: "+94 70456106", img: "profiles/profile6.png", online: false },
    { id: "p7", name: "Niharika", age: 30, location: "Nugegoda", phone: "+94 71247893", img: "profiles/profile7.png", online: false },
    { id: "p8", name: "Sachini", age: 27, location: "Pelawatte", phone: "+94 77346554", img: "profiles/profile8.png", online: false },
    { id: "p9", name: "Amanda", age: 26, location: "Galkissa", phone: "+94 76254982", img: "profiles/profile9.png", online: false },
    { id: "p10", name: "Thaaru", age: 24, location: "Rathmalana", phone: "+94 77719198", img: "profiles/profile10.png", online: false },
  ],
  // Per-online-profile auto replies (you can replace these texts)
  autoReplies: {
    p1: { first: "Hi Hi මගේ චූටි වේ# කොල්ලෝ..🥵🍆💦", second: "ආස නැද්ද අනේ මට කියලා ඇරගන්න🥺 ආසයි නම් WhatsApp num එක එවන්න මං ඒකෙන් message කරන්නම් 🤤🫦" },
    p2: { first: "මොකෝ වෙන්නේ ඉතින්..🤭 ආසද මට කියලා නග්ගගන්න.😏🖕🏻", second: "මාත් මෝල් වෙලා ඉන්නේ හොඳටම🥵😖" },
    p3: { first: " Hi කොහොමද මගේ හුතු පැටියට 🙈🍆", second: "මන් නම් හොඳින් නෙමේ මගේ කිම්බ නලියනෝ ඇරගන්න කවුරුත් නැතුව😫🖕🏻" },
    p4: { first: "ඔයා කැමතිද meet වෙන්න..Room එක මං ගානේ 😁🫦", second: "පැයකට 500යි.. ශොට් unlimited😏💦" },
    p5: { first: "Hi මොකෝ කරන්නේ 🤤💦", second: "මම නම් මේ ඇඟිල්ලක් ගහන ගමන් ඉන්නේ 🫦🖕🏻💦" }
  }
};

/* ========= Chat persistence (localStorage) ========= */
const STORAGE_KEY = "cf_chat_store_v1";
const AUTO_KEY = "cf_chat_auto_v1";

function getStore() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {}; }
  catch { return {}; }
}
function setStore(store) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}
function getMessages(profileId) {
  const store = getStore();
  return Array.isArray(store[profileId]) ? store[profileId] : [];
}
function saveMessages(profileId, messages) {
  const store = getStore();
  store[profileId] = messages;
  setStore(store);
}
function addMessage(profileId, msg) {
  const msgs = getMessages(profileId);
  msgs.push(msg);
  saveMessages(profileId, msgs);
}

/* Track auto-reply steps per profile (so we send only twice) */
function getAutoProgress() {
  try { return JSON.parse(localStorage.getItem(AUTO_KEY)) || {}; }
  catch { return {}; }
}
function setAutoProgress(obj) {
  localStorage.setItem(AUTO_KEY, JSON.stringify(obj));
}
function hasStep(profileId, step) {
  const s = getAutoProgress();
  return !!(s[profileId] && s[profileId][step]);
}
function markStep(profileId, step) {
  const s = getAutoProgress();
  if (!s[profileId]) s[profileId] = {};
  s[profileId][step] = true;
  setAutoProgress(s);
}

/* ========= UI state ========= */
let currentChatId = null;
let currentProfile = null;
let autoReplyTimer = null;

/* ========= Boot ========= */
document.addEventListener("DOMContentLoaded", () => {
  const logoImg = document.getElementById("logoImg");
  if (logoImg) logoImg.src = config.logo;

  renderLists();
  setupTabs();
  setupChatControls();
});

/* ========= Render cards ========= */
function renderLists(){
  const online = document.getElementById("onlineSection");
  const all = document.getElementById("allSection");
  online.innerHTML=""; all.innerHTML="";

  config.profiles.filter(p=>p.online).slice(0,5).forEach(p=>online.appendChild(makeCard(p)));
  config.profiles.forEach(p=>all.appendChild(makeCard(p)));
}

function makeCard(p){
  const card=document.createElement("div");
  card.className="chat-card";
  card.innerHTML=`
    <div class="card-left">
      <div class="name">${p.name}</div>
      <div class="info">Age: ${p.age}<br>Location: ${p.location}<br>Number: ${p.phone}</div>
    </div>
    <div class="profile-thumb">
      <img src="${p.img}" alt="${p.name}" />
      ${p.online?'<div class="online-dot"></div>':""}
    </div>
  `;
  card.addEventListener("click",()=>{
    window.open(config.adLink,"_blank");
    openChat(p);
  });
  return card;
}

/* ========= Tabs ========= */
function setupTabs(){
  const t1=document.getElementById("tab-online");
  const t2=document.getElementById("tab-all");
  const s1=document.getElementById("onlineSection");
  const s2=document.getElementById("allSection");
  t1.addEventListener("click",()=>{
    t1.classList.add("active");t2.classList.remove("active");
    s1.classList.remove("hidden");s2.classList.add("hidden");
  });
  t2.addEventListener("click",()=>{
    t2.classList.add("active");t1.classList.remove("active");
    s2.classList.remove("hidden");s1.classList.add("hidden");
  });
}

/* ========= Chat controls ========= */
function setupChatControls(){
  document.getElementById("backBtn").addEventListener("click",hideChat);
  document.getElementById("adOnlyBtn").addEventListener("click",()=>window.open(config.adLink,"_blank"));
  document.getElementById("sendBtn").addEventListener("click",sendMessage);
  document.getElementById("messageInput").addEventListener("keydown",(e)=>{
    if(e.key==="Enter"){ e.preventDefault(); sendMessage(); }
  });
}

/* ========= Chat open/close ========= */
function openChat(p){
  currentChatId = p.id;
  currentProfile = p;

  const panel=document.getElementById("chatPanel");
  document.getElementById("chatAvatar").src=p.img;
  document.getElementById("chatName").textContent=p.name;
  document.getElementById("chatMeta").textContent=`Age: ${p.age} · ${p.location}`;

  // cancel any previous typing timers and hide indicator
  if (autoReplyTimer) { clearTimeout(autoReplyTimer); autoReplyTimer = null; }
  hideTypingIndicator();

  // seed first-time chat
  let msgs = getMessages(p.id);
  if (!msgs.length) {
    msgs = [
      { role: "incoming", text: "Hi, මම " + p.name, ts: Date.now() },
      { role: "incoming", text: "ඔයාට ඕනේ මොන වගේ සැපක්ද?", ts: Date.now() }
    ];
    saveMessages(p.id, msgs);
  }

  renderConversation(p.id);

  panel.classList.add("show");
  panel.classList.remove("hidden");
  panel.setAttribute("aria-hidden","false");
}

function hideChat(){
  const panel=document.getElementById("chatPanel");
  panel.classList.remove("show");
  setTimeout(()=>panel.classList.add("hidden"),300);
  panel.setAttribute("aria-hidden","true");

  if (autoReplyTimer) { clearTimeout(autoReplyTimer); autoReplyTimer = null; }
  hideTypingIndicator();

  currentChatId = null;
  currentProfile = null;
}

/* ========= Messages UI ========= */
function createMsgElement({ role, text }) {
  const el = document.createElement("div");
  el.className = "msg " + (role === "outgoing" ? "outgoing" : "incoming");
  el.textContent = text;
  return el;
}

function renderConversation(profileId) {
  const msgsEl = document.getElementById("messages");
  msgsEl.innerHTML = "";
  const msgs = getMessages(profileId);
  msgs.forEach(m => msgsEl.appendChild(createMsgElement(m)));
  msgsEl.scrollTop = msgsEl.scrollHeight;
}

/* ========= Typing indicator ========= */
function showTypingIndicator() {
  const bar = document.getElementById("typingIndicator");
  if (bar) bar.classList.remove("hidden");
}
function hideTypingIndicator() {
  const bar = document.getElementById("typingIndicator");
  if (bar) bar.classList.add("hidden");
}

/* ========= Auto-reply logic ========= */
function scheduleAutoReply(step) {
  // Only for online profiles with configured replies
  if (!currentProfile || !currentProfile.online) return;
  const replies = (config.autoReplies || {})[currentProfile.id];
  if (!replies || !replies[step]) return;

  // Prevent stacking multiple timers
  if (autoReplyTimer) return;

  showTypingIndicator();
  autoReplyTimer = setTimeout(() => {
    autoReplyTimer = null;
    hideTypingIndicator();

    const text = replies[step];
    const msgObj = { role: "incoming", text, ts: Date.now() };

    // Persist and update UI
    if (currentChatId) {
      addMessage(currentChatId, msgObj);
      const msgsEl = document.getElementById("messages");
      if (msgsEl) {
        msgsEl.appendChild(createMsgElement(msgObj));
        msgsEl.scrollTop = msgsEl.scrollHeight;
      }
      markStep(currentChatId, step);

      // If we just completed first reply and user already sent >= 2 messages,
      // queue second reply automatically (with its own 5s typing).
      if (step === "first") {
        const totalOutgoing = getMessages(currentChatId).filter(m => m.role === "outgoing").length;
        if (!hasStep(currentChatId, "second") && totalOutgoing >= 2) {
          scheduleAutoReply("second");
        }
      }
    }
  }, 5000);
}

/* ========= Send message ========= */
function sendMessage(){
  const input=document.getElementById("messageInput");
  const text=input.value.trim();
  if(!text || !currentChatId) return;

  const msgs=document.getElementById("messages");
  const msgObj = { role: "outgoing", text, ts: Date.now() };

  // UI
  msgs.appendChild(createMsgElement(msgObj));

  // Persist
  addMessage(currentChatId, msgObj);

  // Reset + scroll
  input.value="";
  msgs.scrollTop=msgs.scrollHeight;

  // Auto-replies only for online profiles
  if (currentProfile && currentProfile.online) {
    const outCount = getMessages(currentChatId).filter(m => m.role === "outgoing").length;

    // Schedule first reply after first user message
    if (!hasStep(currentChatId, "first") && outCount >= 1) {
      scheduleAutoReply("first");
    }
    // Schedule second reply after second message (only after first is done)
    else if (hasStep(currentChatId, "first") && !hasStep(currentChatId, "second") && outCount >= 2 && !autoReplyTimer) {
      scheduleAutoReply("second");
    }
  }
}

/* ========= Splash hide ========= */
window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  if (splash) {
    setTimeout(() => {
      splash.classList.add("hidden");
    }, 800);
  }
});
