// --- 1. GLOBAL STATE ---
let p = {}; 
let archive = JSON.parse(localStorage.getItem('dynasty_archive')) || [];
let graveyard = JSON.parse(localStorage.getItem('dynasty_graveyard')) || [];

const jobList = [
    { title: "Dishwasher", salary: 20000, reqSmart: 0 },
    { title: "Junior IT Support", salary: 45000, reqSmart: 60 },
    { title: "Data Analyst", salary: 65000, reqSmart: 85 },
    { title: "Research Scientist", salary: 95000, reqSmart: 95 }
];

// --- 2. INITIALIZATION ---
window.onload = () => {
    const saved = localStorage.getItem('dynasty_current');
    if (saved) {
        p = JSON.parse(saved);
        showUI('main');
        updateUI();
    } else {
        showUI('setup');
        rollStats();
    }
    const arcBtn = document.getElementById('btn-archive');
    if (arcBtn && (archive.length > 0 || graveyard.length > 0)) {
        arcBtn.style.display = 'inline-block';
    }
};

// --- 3. THE BIRTH ENGINE ---
function rollStats() {
    const firstNames = ["Ashlyn", "Jordan", "Taylor", "Morgan", "Casey", "Quinn", "Alex"];
    const lastNames = ["Hall", "Rivers", "Chen", "Gentry", "Smith", "Vance", "Nova"];
    const genders = ["Male", "Female", "Non-Binary"];
    const ethnicGroups = ["White", "Black or African American", "Asian", "Hispanic or Latino", "Native American", "Pacific Islander", "Mixed/Other"];
    const countries = ["USA", "UK", "Japan", "Brazil", "Nigeria", "Mexico", "Canada"];

    document.getElementById('input-name').value = `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`;
    document.getElementById('input-gender').value = genders[Math.floor(Math.random() * genders.length)];
    document.getElementById('input-race').value = ethnicGroups[Math.floor(Math.random() * ethnicGroups.length)];
    document.getElementById('setup-country').value = countries[Math.floor(Math.random() * countries.length)];
}

function finalizeLife() {
    if (Math.random() < 0.02) {
        alert("Complications at birth. This soul did not make it.");
        location.reload();
        return;
    }

    const inheritance = parseInt(localStorage.getItem('pending_inheritance')) || 0;
    localStorage.removeItem('pending_inheritance');

    p = {
        name: document.getElementById('input-name').value || "Unnamed",
        gender: document.getElementById('input-gender').value,
        race: document.getElementById('input-race').value,
        country: document.getElementById('setup-country').value,
        age: 0,
        money: inheritance,
        health: 100,
        mental: 100,
        smart: 20 + Math.floor(Math.random() * 30),
        looks: Math.floor(Math.random() * 100),
        fame: 0,
        isMarried: false,
        isBreakdown: false,
        breakdownTimer: 0,
        relationships: { family: [], pets: [] },
        job: null
    };

    generateInitialFamily();
    save();
    showUI('main');
    updateUI();
    updateLog(`YEAR 0: Born in ${p.country}. Inheritance: $${inheritance.toLocaleString()}`);
}

function generateInitialFamily() {
    p.relationships.family.push({ name: "Mother", rel: 100, type: "Parent" });
    p.relationships.family.push({ name: "Father", rel: 100, type: "Parent" });
}

// --- 4. LIFE CYCLE (AGE UP) ---
function ageUp() {
    if (p.health <= 0) { die(); return; }
    p.age++;

    // --- EXPANSION PACK HOOKS ---
    if (typeof SeasonsModule !== 'undefined') SeasonsModule.updateSeason(p.age);
    if (typeof FamilyModule !== 'undefined') FamilyModule.checkMilestones();
    if (typeof TogetherModule !== 'undefined') TogetherModule.processClubBonus();
    if (typeof WorkModule !== 'undefined') WorkModule.triggerWorkEvent();
    if (typeof FamousModule !== 'undefined') FamousModule.checkQuirks();
    if (typeof EcoModule !== 'undefined') EcoModule.applyEcoEffects();
    if (typeof CottageModule !== 'undefined') CottageModule.collectMilk();
    if (typeof CityModule !== 'undefined') CityModule.payRent();
    if (typeof IslandLivingModule !== 'undefined' && IslandLivingModule.isIsland(p.country)) {
        IslandLivingModule.triggerIslandEvent();
    }

    if (p.isBreakdown) {
        handleBreakdownTurn();
    } else {
        processStandardYear();
    }

    checkMentalHealth();
    updateUI();
    save();
}

function processStandardYear() {
    if (p.job) {
        p.money += p.job.salary;
        if (Math.random() < 0.1) {
            p.job.salary += Math.floor(p.job.salary * 0.05);
            updateLog("PERFORMANCE: You received a 5% raise!");
        }
    }

    if (p.age === 5) updateLog("SCHOOL: You started Primary School.");
    if (p.age === 18) {
        updateLog("GRADUATION: Careers and Fame are now available.");
        refreshJobBoard();
    }

    if (p.age > 3 && Math.random() < 0.20 && typeof triggerRandomEvent !== 'undefined') {
        triggerRandomEvent();
    }
}

function handleBreakdownTurn() {
    p.breakdownTimer--;
    const weird = ["You stared at a wall all day.", "You spent $200 on magic beans.", "You forgot your own name."];
    updateLog(`[DISORDER] ${weird[Math.floor(Math.random() * weird.length)]}`);
    if (p.breakdownTimer <= 0) {
        p.isBreakdown = false;
        p.mental = 20;
        updateLog("RECOVERY: You have regained control.");
    }
}

// --- 5. SOCIAL & CAREER ACTIONS ---
function study() {
    p.smart = Math.min(100, p.smart + 3);
    p.mental = Math.max(0, p.mental - 8);
    updateLog("You studied hard. (+Smart, -Mental)");
    updateUI();
}

function seekTherapy(tier) {
    const cost = tier === 'cheap' ? 500 : 5000;
    if (p.money < cost) { updateLog("Insufficient funds."); return; }
    p.money -= cost;
    p.mental = Math.min(100, p.mental + (tier === 'cheap' ? 15 : 50));
    updateLog(`Therapy successful. (+Mental)`);
    updateUI();
}

function refreshJobBoard() {
    const board = document.getElementById('job-board');
    if (!board) return;
    board.innerHTML = "";
    jobList.forEach((job, i) => {
        const canApply = p.smart >= job.reqSmart;
        board.innerHTML += `<button class="btn-ghost" ${canApply ? '' : 'disabled'} onclick="applyJob(${i})">
            ${job.title} ($${job.salary})</button>`;
    });
}

function applyJob(i) {
    p.job = jobList[i];
    updateLog(`HIRED: You are now a ${p.job.title}.`);
    updateUI();
}

// --- 6. ARCHIVE & DEATH ---
function die() {
    let tax = 0.2; 
    if (typeof RoyaltyModule !== 'undefined') tax = RoyaltyModule.getInheritanceTax();
    
    const legacyMoney = Math.floor(p.money * (1 - tax));
    const title = (typeof RoyaltyModule !== 'undefined') ? RoyaltyModule.checkTitle() : "Citizen";

    graveyard.push({ name: p.name, age: p.age, summary: `${title} - ${p.job ? p.job.title : "Unemployed"}` });
    localStorage.setItem('dynasty_graveyard', JSON.stringify(graveyard));
    localStorage.setItem('pending_inheritance', legacyMoney);
    
    alert(`Rest in Peace, ${p.name}. You lived to be ${p.age}. Inheritance for next life: $${legacyMoney.toLocaleString()}`);
    localStorage.removeItem('dynasty_current');
    location.reload();
}

// --- 7. UI & NAVIGATION UTILS ---
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    const target = document.getElementById(`tab-${tabId}`);
    if (target) target.style.display = 'block';
}

function updateLog(msg) {
    const log = document.getElementById('log');
    if(log) {
        log.innerHTML += `<div>> ${msg}</div>`;
        log.scrollTop = log.scrollHeight;
    }
}

function updateUI() {
    document.getElementById('char-name').innerText = p.name;
    document.getElementById('val-money').innerText = p.money.toLocaleString();
    document.getElementById('val-age').innerText = p.age;
    
    let standing = "Infant";
    if (p.age >= 3) standing = "Toddler";
    if (p.age >= 6) standing = "Child";
    if (p.age >= 13) standing = "Teenager";
    if (p.age >= 18) standing = "Adult";
    if (p.age >= 65) standing = "Senior";
    document.getElementById('char-standing').innerText = standing;

    document.getElementById('bar-health').style.width = p.health + "%";
    document.getElementById('bar-mental').style.width = p.mental + "%";
    document.getElementById('bar-smart').style.width = p.smart + "%";
    document.getElementById('bar-looks').style.width = p.looks + "%";

    const jobSect = document.getElementById('job-section');
    if (jobSect) jobSect.style.display = p.age >= 18 ? 'block' : 'none';

    if (p.age >= 13) {
        const smSect = document.getElementById('social-media-section');
        const fameCont = document.getElementById('fame-container');
        if(smSect) smSect.style.display = 'block';
        if(fameCont) {
            fameCont.style.display = 'block';
            document.getElementById('bar-fame').style.width = p.fame + "%";
        }
    }
}

function showUI(type) {
    const setup = document.getElementById('setup-screen');
    const main = document.getElementById('main-ui');
    if(setup && main) {
        setup.style.display = type === 'setup' ? 'block' : 'none';
        main.style.display = type === 'main' ? 'block' : 'none';
    }
}

// --- 8. SYSTEM ACTIONS ---
function save() { 
    localStorage.setItem('dynasty_current', JSON.stringify(p)); 
}

function checkMentalHealth() { 
    if (p.mental <= 0) { 
        p.isBreakdown = true; 
        p.breakdownTimer = 5; 
        p.job = null; 
        updateLog("CRITICAL: You have suffered a mental breakdown.");
    } 
}

function openArchive() { document.getElementById('archive-modal').style.display = 'flex'; }
function closeArchive() { document.getElementById('archive-modal').style.display = 'none'; }

// --- 9. GLOBAL HOME BUTTON LOGIC ---
window.exitToHome = function() {
    console.log("Home button triggered. Initiating Hard Reset...");
    
    if (confirm("Return to main menu? Your current progress will be archived.")) {
        // 1. Save the current state to the graveyard/archive logic if needed
        save(); 

        // 2. THE NUCLEAR OPTION: Clear the specific session key
        localStorage.removeItem('dynasty_current');
        
        // 3. Double Check: If the key still exists, force it to null
        localStorage.setItem('dynasty_current', "");

        console.log("Session cleared. Reloading in 100ms...");

        // 4. Tiny delay to ensure LocalStorage writes to disk before the reload happens
        setTimeout(() => {
            window.location.href = window.location.pathname + "?reset=" + Date.now();
        }, 100);
    }
};
