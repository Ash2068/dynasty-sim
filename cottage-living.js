// ==========================================
// COTTAGE & HOMESTEAD LIFESTYLE MODULE
// ==========================================

const HOMESTEAD_ANIMALS = {
    chicken: { id: 'chicken', name: 'Chickens', buyCost: 150, yieldProduct: 'Fresh Eggs', yieldValue: 15, feedCostPerYear: 5 },
    cow: { id: 'cow', name: 'Dairy Cow', buyCost: 1200, yieldProduct: 'Fresh Milk', yieldValue: 50, feedCostPerYear: 30 },
    bees: { id: 'bees', name: 'Honeybee Hive', buyCost: 400, yieldProduct: 'Organic Honey', yieldValue: 35, feedCostPerYear: 0 }
};

const CottageModule = {
    hasPlot: false,
    inventory: { chicken: 0, cow: 0, bees: 0 },

    buyCottagePlot() {
        const plotCost = 15000;
        if (p.money < plotCost) { updateLog("You cannot afford to buy a cottage plot."); return; }
        p.money -= plotCost;
        this.hasPlot = true;
        updateLog(`🏡 COTTAGE: You bought a cozy countryside cottage plot with a small barn! (-$${plotCost.toLocaleString()})`);
    },

    buyLivestock(animalKey, amount = 1) {
        if (!this.hasPlot) { updateLog("❌ You need a cottage plot before you can raise livestock!"); return; }
        const animal = HOMESTEAD_ANIMALS[animalKey.toLowerCase()];
        if (!animal) { updateLog("Invalid animal selection."); return; }
        const totalCost = animal.buyCost * amount;
        if (p.money < totalCost) { updateLog(`You cannot afford to buy ${amount} ${animal.name}.`); return; }
        p.money -= totalCost;
        this.inventory[animalKey.toLowerCase()] += amount;
        updateLog(`🚜 FARM: Bought ${amount}x ${animal.name} for your homestead. (-$${totalCost.toLocaleString()})`);
    },

    // Called from ageUp() as CottageModule.collectMilk()
    collectMilk() {
        if (!this.hasPlot) return;

        let totalRevenue = 0;
        let totalFeedBill = 0;
        Object.keys(this.inventory).forEach(key => {
            const count = this.inventory[key];
            if (count > 0) {
                const spec = HOMESTEAD_ANIMALS[key];
                totalRevenue += count * spec.yieldValue;
                totalFeedBill += count * spec.feedCostPerYear;
            }
        });

        if (totalRevenue > 0) {
            p.money += totalRevenue - totalFeedBill;
            p.mental = Math.min(100, p.mental + 4);
            updateLog(`🌾 COTTAGE: Harvested farm goods for +$${totalRevenue} (Feed bills: -$${totalFeedBill}).`);
        }

        const roll = Math.random();
        if (roll < 0.08 && (this.inventory.chicken > 0 || this.inventory.cow > 0)) {
            if (this.inventory.chicken > 0) {
                this.inventory.chicken--;
                updateLog("🦊 WILDLIFE: A red fox snuck into the coop last night! You lost 1 Chicken.");
            } else {
                updateLog("🐺 WILDLIFE: Wolves were howling near the pasture, but your fences held them back.");
            }
        } else if (roll > 0.92 && this.hasPlot) {
            const bonusMoney = 400;
            p.money += bonusMoney;
            updateLog(`🍎 HARVEST: Your organic apple orchard had a massive surplus! Sold the yield for +$${bonusMoney}.`);
        }
    }
};
