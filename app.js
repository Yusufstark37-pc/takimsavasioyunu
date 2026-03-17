// =============================
// TAKIMLAR
// =============================
const defaultTeams = [
    { id:"gs", name:"Galatasaray", score:0 },
    { id:"fb", name:"Fenerbahçe", score:0 },
    { id:"bjk", name:"Beşiktaş", score:0 },
    { id:"ts", name:"Trabzonspor", score:0 },
    { id:"alanya", name:"Alanyaspor", score:0 },
    { id:"antalya", name:"Antalyaspor", score:0 },
    { id:"gaziantep", name:"Gaziantep FK", score:0 },
    { id:"goztepe", name:"Göztepe", score:0 },
    { id:"kasimpasa", name:"Kasımpaşa", score:0 },
    { id:"kayseri", name:"Kayserispor", score:0 },
    { id:"konya", name:"Konyaspor", score:0 },
    { id:"rizespor", name:"Rizespor", score:0 },
    { id:"samsun", name:"Samsunspor", score:0 },
    { id:"ibb", name:"Başakşehir", score:0 },
    { id:"eyupspor", name:"Eyüpspor", score:0 },
    { id:"fatihkaragumruk", name:"Fatih Karagümrük", score:0 },
    { id:"hatay", name:"Hatayspor", score:0 },
    { id:"kocaeli", name:"Kocaelispor", score:0 },
    { id:"genclerbirligi", name:"Gençlerbirliği", score:0 },
    { id:"sakarya", name:"Sakaryaspor", score:0 },
    { id:"bolu", name:"Boluspor", score:0 },
    { id:"bandirma", name:"Bandırmaspor", score:0 },
    { id:"erzurum", name:"Erzurumspor FK", score:0 },
    { id:"manisa", name:"Manisa FK", score:0 },
    { id:"umraniye", name:"Ümraniyespor", score:0 },
    { id:"istanbulspor", name:"İstanbulspor", score:0 },
    { id:"pendik", name:"Pendikspor", score:0 },
    { id:"corum", name:"Çorum FK", score:0 },
    { id:"amed", name:"Amed SK", score:0 },
    { id:"igdir", name:"Iğdır FK", score:0 },
    { id:"sariyer", name:"Sarıyer", score:0 },
    { id:"bursaspor", name:"Bursaspor", score:0 } // Bursaspor sabitlendi
];

// =============================
// LOCAL STORAGE TEMİZLE & GÜNCELLE
// =============================
localStorage.removeItem("teams"); // Eski Erok verisini temizle
let teams = [...defaultTeams];
localStorage.setItem("teams", JSON.stringify(teams));

let selectedTeam = null;

// =============================
// DOM REFERANSLARI
// =============================
const container = document.getElementById("teams");
const firstDiv = document.getElementById("first");
const secondDiv = document.getElementById("second");
const thirdDiv = document.getElementById("third");

// Sağ panel
let votePanel = document.getElementById("votePanel");
if(!votePanel){
    votePanel = document.createElement("div");
    votePanel.id = "votePanel";
    votePanel.style.position = "fixed";
    votePanel.style.right = "20px";
    votePanel.style.top = "100px";
    votePanel.style.padding = "15px";
    votePanel.style.border = "1px solid #ccc";
    votePanel.style.borderRadius = "10px";
    votePanel.style.background = "#fff";
    votePanel.style.display = "none";
    votePanel.style.zIndex = 1000;
    document.body.appendChild(votePanel);
}

// =============================
// RENDER
// =============================
function render() {
    container.innerHTML = "";
    const sorted = [...teams].sort((a,b)=>b.score-a.score);
    const maxScore = Math.max(...teams.map(t=>t.score),1);

    sorted.forEach(team=>{
        const percent = (team.score/maxScore)*100;
        const div = document.createElement("div");
        div.className="team";
        div.style.margin="5px 0";
        div.style.padding="5px";
        div.style.borderRadius="5px";
        div.style.background="#fff";
        div.style.display="flex";
        div.style.flexDirection="column";
        div.style.color = "#000";

        div.innerHTML=`
            <div style="display:flex; align-items:center; gap:10px;">
                <img src="./logolar/${team.id}.png" onerror="this.src='./logolar/default.png'" width="40" height="40">
                <b>${team.name}</b> (${team.score})
            </div>
            <div class="bar" style="height:10px; background:#ccc; border-radius:5px; overflow:hidden; margin:5px 0;">
                <div class="fill" style="width:${percent}%; height:100%; background:#ffcc00;"></div>
            </div>
            <button onclick="openVotePanel('${team.id}')">Oy Ver</button>
        `;
        container.appendChild(div);
    });

    // TOP 3
    if(sorted.length>=3){
        firstDiv.innerHTML = `<img src="./logolar/${sorted[0].id}.png" width="30"><b>🥇 ${sorted[0].name}</b> ${sorted[0].score} Oy`;
        secondDiv.innerHTML = `<img src="./logolar/${sorted[1].id}.png" width="30"><b>🥈 ${sorted[1].name}</b> ${sorted[1].score} Oy`;
        thirdDiv.innerHTML = `<img src="./logolar/${sorted[2].id}.png" width="30"><b>🥉 ${sorted[2].name}</b> ${sorted[2].score} Oy`;
    }

    if(selectedTeam){
        const team = teams.find(t=>t.id===selectedTeam);
        votePanel.innerHTML = `
            <h3>${team.name} Takımına Oy Ver</h3>
            <div style="display:flex; gap:10px; flex-wrap:wrap;">
                <button onclick="vote('${selectedTeam}',5)">5 Puan</button>
                <button onclick="vote('${selectedTeam}',10)">10 Puan</button>
                <button onclick="vote('${selectedTeam}',20)">20 Puan</button>
                <button onclick="vote('${selectedTeam}',50)">50 Puan</button>
                <button onclick="vote('${selectedTeam}',100)">100 Puan</button>
            </div>
            <button onclick="closeVotePanel()" style="margin-top:10px;">❌ Kapat</button>
        `;
        votePanel.style.display="block";
    } else {
        votePanel.style.display="none";
    }

    // Gece modu kontrolü
    if(document.body.classList.contains("dark")){
        document.querySelectorAll(".team").forEach(t=>{
            t.style.backgroundColor = "#1e1e1e";
            t.style.color = "#fff";
        });
    } else {
        document.querySelectorAll(".team").forEach(t=>{
            t.style.backgroundColor = "#fff";
            t.style.color = "#000";
        });
    }

    localStorage.setItem("teams", JSON.stringify(teams));
}

// =============================
// OY PANELİ AÇ
// =============================
function openVotePanel(id){
    selectedTeam = id;
    render();
}

// =============================
// OY VER
// =============================
function vote(id, points){
    const team = teams.find(t=>t.id===id);
    if(team){
        team.score += points;
        render();
    }
}

// =============================
// PANEL KAPAT
// =============================
function closeVotePanel(){
    selectedTeam = null;
    render();
}

// =============================
// DARK MODE
// =============================
const themeBtn = document.getElementById("themeToggle");
themeBtn.onclick = ()=>{
    document.body.classList.toggle("dark");
    render();
}

// =============================
// OYLARI SIFIRLA
// =============================
function resetVotes(){
    if(confirm("Tüm oylar sıfırlansın mı?")){
        teams.forEach(t=>t.score=0);
        localStorage.removeItem("teams");
        selectedTeam = null;
        render();
    }
}

// =============================
// BAŞLAT
// =============================
render();