// --- 1. GLOBAL STATE ---
let p = {}; // The Player Object
let archive = JSON.parse(localStorage.getItem('dynasty_archive')) || [];
let graveyard = JSON.parse(localStorage.getItem('dynasty_graveyard')) || [];

const jobList = [
    { title: "Dishwasher", salary: 20000, reqSmart: 0 },
    { title: "Junior IT Support", salary: 45000, reqSmart: 60 },
    { title: "Data Analyst", salary: 65000, reqSmart: 85 },
    { title: "Research Scientist", salary: 95000, reqSmart: 95 }
];

const petTypes = [
    { species: "Dog", price: 500, monthly: 50, life: 15, bonus: 10 },
    { species: "Cat", price: 300, monthly: 30, life: 18, bonus: 8 }
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
    const names = ["Ashlyn", "Jordan", "Taylor", "Morgan", "Casey", "Quinn", "Alex"];
    document.getElementById('input-name').value = names[Math.floor(Math.random() * names.length)];
}

function finalizeLife() {
    // 2% Infant Mortality Check
    if (Math.random() < 0.02) {
        alert("Complications at birth. This soul did not make it.");
        location.reload();
        return;
    }

    // Check for Inheritance
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
        smart: 40 + Math.floor(Math.random() * 50),
        looks: 40 + Math.floor(Math.random() * 50),
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
    updateLog(`You were born in ${p.country}. Inheritance: $${inheritance}`);
}

function generateInitialFamily() {
    p.relationships.family.push({ name: "Mother", rel: 100, type: "Parent" });
    p.relationships.family.push({ name: "Father", rel: 100, type: "Parent" });
}

// --- 4. LIFE CYCLE (AGE UP) ---
function ageUp() {
    if (p.health <= 0) { die(); return; }
    p.age++;

    // Breakdown Logic
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
    // Money Logic
    if (p.job) {
        p.money += p.job.salary;
        if (Math.random() < 0.1) { // Random Raise
            p.job.salary += Math.floor(p.job.salary * 0.05);
            updateLog("You received a 5% performance raise!");
        }
    }

    // School Logic
    if (p.age === 5) updateLog("You started Primary School.");
    if (p.age === 18) {
        updateLog("You graduated! Careers are now available.");
        document.getElementById('job-section').style.display = 'block';
        document.getElementById('fame-container').style.display = 'block';
        refreshJobBoard();
    }

    // Pet/Child Costs
    p.relationships.pets.forEach(pet => p.money -= pet.monthly);
    
    // Random Social Invites
    if (p.age > 10 && Math.random() < 0.15) triggerSocialEvent();
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
    const record = { name: p.name, age: p.age, summary: p.job ? p.job.title : "Unemployed" };
    graveyard.push(record);
    localStorage.setItem('dynasty_graveyard', JSON.stringify(graveyard));
    
    alert(`Rest in Peace, ${p.name}. Age: ${p.age}`);
    localStorage.removeItem('dynasty_current');
    location.reload();
}

// --- 7. UI UTILS ---
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById(`tab-${tabId}`).style.display = 'block';
}

function updateLog(msg) {
    const log = document.getElementById('log');
    log.innerHTML += `<div>> ${msg}</div>`;
    log.scrollTop = log.scrollHeight;
}

function updateUI() {
    document.getElementById('char-name').innerText = p.name;
    document.getElementById('val-money').innerText = p.money.toLocaleString();
    document.getElementById('val-age').innerText = p.age;
    document.getElementById('bar-health').style.width = p.health + "%";
    document.getElementById('bar-mental').style.width = p.mental + "%";
    document.getElementById('bar-smart').style.width = p.smart + "%";
    document.getElementById('bar-looks').style.width = p.looks + "%";
}

function save() { localStorage.setItem('dynasty_current', JSON.stringify(p)); }
function showUI(type) {
    document.getElementById('setup-screen').style.display = type === 'setup' ? 'block' : 'none';
    document.getElementById('main-ui').style.display = type === 'main' ? 'block' : 'none';
}
function openArchive() { document.getElementById('archive-modal').style.display = 'flex'; }
function closeArchive() { document.getElementById('archive-modal').style.display = 'none'; }
function checkMentalHealth() { if (p.mental <= 0) { p.isBreakdown = true; p.breakdownTimer = 10; p.job = null; } }
