const config = {
  adLink: "https://www.revenuecpmgate.com/ag8r7bq8b6?key=7e925c0ec2b4d12a9b138108e5db4922",
  logo: "logo.png",
  background: "background.png",
  profiles: [
    { id: "p1", name: "Sihilal Nimsara", age: 24, location: "Nugegoda", phone: "+94 70745871", img: "profiles/profile1.png", online: true },
    { id: "p2", name: "Shanika", age: 25, location: "Baththaramulla", phone: "+94 71724899", img: "profiles/profile2.png", online: true },
    { id: "p3", name: "Niluka", age: 29, location: "Wellawatte", phone: "+94 77328556", img: "profiles/profile3.png", online: true },
    { id: "p4", name: "Sheron", age: 31, location: "Rajagiriya", phone: "+94 77728823", img: "profiles/profile4.png", online: true },
    { id: "p5", name: "Asini", age: 24, location: "Maharagama", phone: "+94 74451507", img: "profiles/profile5.png", online: true },
    { id: "p6", name: "Kumari", age: 26, location: "Dematagoda", phone: "+94 70456106", img: "profiles/profile6.png", online: false },
    { id: "p7", name: "Niharika", age: 30, location: "Nugegoda", phone: "+94 71247893", img: "profiles/profile7.png", online: false },
    { id: "p8", name: "Sachini", age: 27, location: "Pelawatte", phone: "+94 77346554", img: "profiles/profile8.png", online: false },
    { id: "p9", name: "Amanda", age: 26, location: "Galkissa", phone: "+94 76254982", img: "profiles/profile9.png", online: false },
    { id: "p10", name: "Thaaru", age: 24, location: "Rathmalana", phone: "+94 77719198", img: "profiles/profile10.png", online: false },
  ]
};

document.addEventListener("DOMContentLoaded", () => {
  const logoImg = document.getElementById("logoImg");
  if (logoImg) logoImg.src = config.logo;

  renderLists();
  setupTabs();
  setupChatControls();
});

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

function setupChatControls(){
  document.getElementById("backBtn").addEventListener("click",hideChat);
  document.getElementById("adOnlyBtn").addEventListener("click",()=>window.open(config.adLink,"_blank"));
  document.getElementById("sendBtn").addEventListener("click",sendMessage);
  document.getElementById("messageInput").addEventListener("keydown",(e)=>{if(e.key==="Enter")sendMessage();});
}

function openChat(p){
  const panel=document.getElementById("chatPanel");
  document.getElementById("chatAvatar").src=p.img;
  document.getElementById("chatName").textContent=p.name;
  document.getElementById("chatMeta").textContent=`Age: ${p.age} · ${p.location}`;
  const msgs=document.getElementById("messages");
  msgs.innerHTML="";
  ["Hi, මම "+p.name,"ඔයාට ඕනේ මොන වගේ සැපක්ද?"].forEach(t=>{
    const m=document.createElement("div");m.className="msg incoming";m.textContent=t;msgs.appendChild(m);
  });
  panel.classList.add("show");
  panel.classList.remove("hidden");
}

function hideChat(){
  const panel=document.getElementById("chatPanel");
  panel.classList.remove("show");
  setTimeout(()=>panel.classList.add("hidden"),300);
}

function sendMessage(){
  const input=document.getElementById("messageInput");
  const text=input.value.trim();
  if(!text)return;
  const msgs=document.getElementById("messages");
  const m=document.createElement("div");m.className="msg outgoing";m.textContent=text;msgs.appendChild(m);
  input.value="";
  msgs.scrollTop=msgs.scrollHeight;
}

// Hide splash after page fully loads
window.addEventListener("load", () => {
  const splash = document.getElementById("splash");
  if (splash) {
    setTimeout(() => {
      splash.classList.add("hidden");
    }, 800); // delay so splash is visible for ~0.8s
  }
});

