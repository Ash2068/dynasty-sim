// ==========================================
// ISLAND LIVING & GEOGRAPHY MODULE
// ==========================================

const ISLAND_PROPERTIES = {
    beachShack: { id: 'beachShack', name: 'Rustic Beachfront Shack', cost: 45000, maintenance: 150, happinessBonus: 8, description: 'Right on the sand. Beautiful views, but unprotected from high tide.' },
    privateAtoll: { id: 'privateAtoll', name: 'Private Luxury Atoll Villa', cost: 1500000, maintenance: 6500, happinessBonus: 25, description: 'An elite, secluded sanctuary with a private dock and crystal clear lagoons.' }
};

const IslandLivingModule = {
    ownedIslandProperty: null,

    // Called from ageUp() as IslandLivingModule.isIsland(p.country)
    isIsland(country) {
        const islands = ["Japan", "UK", "Philippines", "Iceland", "Maldives", "New Zealand", "Madagascar"];
        return islands.includes(country);
    },

    // Called from ageUp() as IslandLivingModule.triggerIslandEvent()
    triggerIslandEvent() {
        const roll = Math.random();

        if (roll < 0.10) {
            p.health = Math.min(100, p.health + 5);
            updateLog("🏝️ ISLAND: You spent the day spear-fishing in the coral reefs. (+5 Health)");
        } else if (roll < 0.15) {
            const treasureValue = Math.floor(Math.random() * 800) + 200;
            p.money += treasureValue;
            updateLog(`🐚 ISLAND: You found a rare nautilus shell washed up on the beach! Sold it for +$${treasureValue}.`);
        }

        if (this.ownedIslandProperty) {
            const prop = ISLAND_PROPERTIES[this.ownedIslandProperty];
            p.money -= prop.maintenance;
            p.mental = Math.min(100, p.mental + prop.happinessBonus);

            if (Math.random() < 0.07) {
                p.mental = Math.max(0, p.mental - 12);
                if (this.ownedIslandProperty === 'beachShack') {
                    const repairCost = 3000;
                    p.money -= repairCost;
                    updateLog(`⛈️ MONSOON: A tropical storm battered the coast! Your Beach Shack suffered water damage. Repair costs: -$${repairCost}.`);
                } else {
                    updateLog("⛈️ MONSOON: Heavy typhoons hit the coast, but you safely watched the storm pass from inside your home.");
                }
            }
        }
    },

    buyIslandProperty(propertyKey) {
        if (!this.isIsland(p.country)) { updateLog("❌ You can only purchase beachfront properties in an island nation!"); return; }
        const property = ISLAND_PROPERTIES[propertyKey];
        if (!property) { updateLog("Invalid property type."); return; }
        if (p.money < property.cost) { updateLog("You do not have enough funds for this property."); return; }
        p.money -= property.cost;
        this.ownedIslandProperty = propertyKey;
        updateLog(`🏝️ REAL ESTATE: You purchased a ${property.name}! (-$${property.cost.toLocaleString()})`);
    }
};
