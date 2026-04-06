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
    if (archive.length > 0 || graveyard.length > 0) {
        document.getElementById('btn-archive').style.display = 'inline-block';
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

    // Trigger Random Events (if Choice System is loaded)
    if (p.age > 3 && Math.random() < 0.20 && typeof triggerRandomEvent !== 'undefined') {
        triggerRandomEvent();
    }
}

// --- 5. UI & UTILS ---
function updateUI() {
    document.getElementById('char-name').innerText = p.name;
    document.getElementById('val-money').innerText = p.money.toLocaleString();
    document.getElementById('val-age').innerText = p.age;
    
    // Dynamic Life Standing label
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

    // Age Gates
    document.getElementById('job-section').style.display = p.age >= 18 ? 'block' : 'none';
    if (p.age >= 13) {
        if(document.getElementById('social-media-section')) document.getElementById('social-media-section').style.display = 'block';
        if(document.getElementById('fame-container')) {
            document.getElementById('fame-container').style.display = 'block';
            document.getElementById('bar-fame').style.width = p.fame + "%";
        }
    }
}

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

function save() { localStorage.setItem('dynasty_current', JSON.stringify(p)); }
function showUI(type) {
    document.getElementById('setup-screen').style.display = type === 'setup' ? 'block' : 'none';
    document.getElementById('main-ui').style.display = type === 'main' ? 'block' : 'none';
}
function updateLog(msg) {
    const log = document.getElementById('log');
    if(log) {
        log.innerHTML += `<div>> ${msg}</div>`;
        log.scrollTop = log.scrollHeight;
    }
}
function checkMentalHealth() { if (p.mental <= 0) { p.isBreakdown = true; p.breakdownTimer = 5; p.job = null; } }
