let p = {}; 
let retired_parent = null; 
let familyVault = JSON.parse(localStorage.getItem('dynasty_family_vault')) || [];
let userStocks = 0;
let heat = 0;
let stability = 100;
let tempLife = {}; 

// --- INITIALIZATION ---
function initGame() {
    const saved = localStorage.getItem('dynasty_current');
    if (saved) {
        p = JSON.parse(saved);
        showUI('main');
    } else {
        showUI('setup');
        rollStats(); // Pre-rolls hidden stats like IQ
    }
    updateUI();
}

function showUI(screen) {
    const setup = document.getElementById('setup-screen');
    const main = document.getElementById('main-ui');
    
    if (screen === 'setup') {
        setup.style.display = 'block';
        main.style.display = 'none';
    } else {
        setup.style.display = 'none';
        main.style.display = 'block';
    }
}

// --- CHARACTER CREATION ---
function rollStats() {
    // Generate a random name for the input box
    const first = ["Aris", "Kael", "Lyra", "Sora", "Jax", "Vera"];
    const last = ["Thorne", "Vance", "Nova", "Steel", "Echo"];
    const randomName = first[Math.floor(Math.random()*first.length)] + " " + last[Math.floor(Math.random()*last.length)];
    
    document.getElementById('input-name').value = randomName;

    // Roll hidden stats that the user doesn't pick
    tempLife = {
        iq: 85 + Math.floor(Math.random() * 75),
        looks: 40 + Math.floor(Math.random() * 60)
    };
}

function finalizeLife() {
    const nameVal = document.getElementById('input-name').value;
    const genderVal = document.getElementById('input-gender').value;
    const raceVal = document.getElementById('input-race').value;
    const countryVal = document.getElementById('setup-country').value;

    if (!nameVal) {
        alert("Please enter a name for your legacy.");
        return;
    }

    p = {
        name: nameVal,
        gender: genderVal,
        race: raceVal,
        country: countryVal,
        iq: tempLife.iq || 100,
        age: 18,
        money: 1500,
        health: 100,
        mentalHealth: 100,
        fame: 0,
        standing: "Commoner",
        isBlackSheep: false,
        newsTimer: 0,
        alive: true
    };

    save();
    showUI('main');
    updateUI();
    updateLog(`${p.name} (${p.race}) has arrived in ${p.country}.`);
}

// --- NAVIGATION & UTILITY ---
function exitToHome() {
    if (confirm("Exit to Main Menu? Your current life will be deleted, but the Family Vault remains.")) {
        localStorage.removeItem('dynasty_current');
        location.reload();
    }
}

function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById('tab-' + id).style.display = 'block';
}

// --- CORE GAMEPLAY ---
function ageUp() {
    if (!p.alive) return;

    p.age++;
    p.money += 2500; 
    p.health -= (p.age > 60) ? 4 : 1;
    
    if (userStocks > 0) {
        let trend = (0.8 + Math.random() * 0.5);
        userStocks = Math.floor(userStocks * trend);
    }

    stability -= Math.random() * 3;
    if (stability < 15) {
        p.money = Math.floor(p.money * 0.7);
        triggerGlobalNews("ECONOMIC CRASH: Currency devalued!", "war");
        stability = 40;
    }

    if (p.health <= 0) die();
    
    if (p.newsTimer > 0) p.newsTimer--; 
    else document.getElementById('global-news-box').style.display = 'none';
    
    updateUI();
    save();
}

// --- SYSTEM ---
function triggerGlobalNews(msg, type) {
    const box = document.getElementById('global-news-box');
    box.className = `news-box-${type}`;
    document.getElementById('news-content').innerText = ">> " + msg;
    box.style.display = "block";
    p.newsTimer = 4;
}

function die() {
    p.alive = false;
    alert("Your character has passed away.");
    localStorage.removeItem('dynasty_current');
    location.reload();
}

function save() {
    localStorage.setItem('dynasty_current', JSON.stringify(p));
    localStorage.setItem('dynasty_family_vault', JSON.stringify(familyVault));
}

function updateUI() {
    if (!p.name) return;
    document.getElementById('char-name').innerText = p.name;
    document.getElementById('val-money').innerText = p.money.toLocaleString();
    document.getElementById('val-age').innerText = p.age;
    document.getElementById('val-iq').innerText = p.iq;
    document.getElementById('val-standing').innerText = p.standing;
    
    document.getElementById('bar-health').style.width = Math.max(0, p.health) + "%";
    document.getElementById('bar-mental').style.width = Math.max(0, p.mentalHealth) + "%";
    document.getElementById('bar-fame').style.width = Math.min(100, p.fame) + "%";
    
    document.getElementById('val-stocks').innerText = "$" + userStocks.toLocaleString();
    document.getElementById('bar-stability').style.width = stability + "%";
}

function updateLog(msg) {
    const log = document.getElementById('log');
    log.innerHTML = `> ${msg}<br>${log.innerHTML}`;
}

window.onload = initGame;
