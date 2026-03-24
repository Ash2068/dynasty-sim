let p = {}; 
let retired_parent = null; 
let familyVault = JSON.parse(localStorage.getItem('dynasty_family_vault')) || [];
let userStocks = 0;
let heat = 0;
let stability = 100;

function initGame() {
    const saved = localStorage.getItem('dynasty_current');
    if (saved) {
        p = JSON.parse(saved);
    } else {
        createNewLife();
    }
    updateUI();
}

function createNewLife(inheritance = 1000) {
    p = {
        name: "Soul_" + Math.floor(Math.random()*999),
        age: 18, 
        money: inheritance, 
        iq: 100 + Math.floor(Math.random()*50),
        health: 100, 
        mentalHealth: 100, 
        fame: 0,
        standing: "Commoner", 
        isBlackSheep: false, 
        newsTimer: 0, 
        privateVault: []
    };
    save();
}

function ageUp() {
    if (!p.alive && p.health <= 0) return;

    p.age++;
    p.money += 2500; // Basic Annual Income
    p.health -= (p.age > 60) ? 4 : 1;
    
    // 1. Market & Economy
    if (userStocks > 0) {
        let trend = (0.8 + Math.random() * 0.5);
        userStocks = Math.floor(userStocks * trend);
        if (trend < 0.9) updateLog("Market Downturn: Portfolio value dropped.");
    }

    // 2. World Stability (Civil War logic)
    stability -= Math.random() * 4;
    if (stability < 35) triggerGlobalNews("POLITICAL UNREST: Protests in the streets!", "war");
    if (stability < 10) {
        p.money = Math.floor(p.money * 0.5);
        stability = 50;
        triggerGlobalNews("CIVIL WAR: Savings seized by state!", "war");
    }

    // 3. Parent/Dynasty Logic
    if (retired_parent) {
        retired_parent.health -= 5;
        retired_parent.relationship -= 2;
        
        if (retired_parent.relationship <= 0 && !p.isBlackSheep) {
            p.isBlackSheep = true;
            updateLog("DISOWNED: You have been cut off from the family vault.");
        }
        
        if (retired_parent.health <= 0) {
            let legacy = 50000;
            if (!p.isBlackSheep) {
                p.money += legacy;
                updateLog(`INHERITANCE: Received $${legacy.toLocaleString()} from your parent.`);
            } else {
                updateLog("LEGACY LOST: Your parent passed away, but you were disowned.");
            }
            retired_parent = null;
        }
    }

    // 4. Heat & Police
    if (heat > 0) heat -= 5;

    if (p.health <= 0) die();
    
    // News Timer Logic
    if (p.newsTimer > 0) p.newsTimer--; 
    else document.getElementById('global-news-box').style.display = 'none';
    
    updateUI();
    save();
}

function invest(amt) {
    if (p.money >= amt) {
        p.money -= amt;
        userStocks += amt;
        updateLog(`INVESTED: $${amt.toLocaleString()} in Global Index.`);
    } else {
        updateLog("INSUFFICIENT FUNDS for investment.");
    }
    updateUI();
}

function sellStocks() {
    p.money += userStocks;
    updateLog(`LIQUIDATED: Sold stocks for $${userStocks.toLocaleString()}`);
    userStocks = 0;
    updateUI();
}

function spreadPropaganda(type) {
    p.fame += 15;
    heat += 20;
    if (type === 'Cult') p.standing = "Cult Leader";
    if (heat > 75) {
        let fine = Math.floor(p.money * 0.2);
        p.money -= fine;
        heat = 10;
        updateLog(`POLICE RAID: Fined $${fine.toLocaleString()} for illicit activities.`);
    }
    updateUI();
}

function goDark() {
    if (p.money >= 10000) {
        p.money -= 10000;
        heat = 0;
        updateLog("BRIBED: Police interest has vanished.");
    }
    updateUI();
}

function triggerGlobalNews(msg, type) {
    const box = document.getElementById('global-news-box');
    box.className = `news-box-${type}`;
    document.getElementById('news-content').innerText = ">> " + msg;
    box.style.display = "block";
    p.newsTimer = 5;
}

function die() {
    alert("The Character has died. Succession starting...");
    let inheritance = Math.floor(p.money * 0.7);
    createNewLife(inheritance);
    location.reload();
}

function save() {
    localStorage.setItem('dynasty_current', JSON.stringify(p));
    localStorage.setItem('dynasty_family_vault', JSON.stringify(familyVault));
}

function updateUI() {
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

    document.getElementById('btn-challenge').style.display = p.isBlackSheep ? 'block' : 'none';
}

function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.style.display = 'none');
    document.getElementById('tab-' + id).style.display = 'block';
}

function updateLog(msg) {
    const log = document.getElementById('log');
    log.innerHTML = `> ${msg}<br>${log.innerHTML}`;
}

window.onload = initGame;
