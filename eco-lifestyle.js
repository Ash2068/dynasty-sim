// ==========================================
// ECOLOGICAL FOOTPRINT MODULE
// ==========================================

const ECO_CHOICES = {
    solarPanels: { label: 'solarPanels', name: 'Install Solar Roof Panels', cost: 8500, footprintImpact: -15, yearlySavings: 600, description: 'Power your home using clean, renewable energy.' },
    electricVehicle: { label: 'electricVehicle', name: 'Buy Electric Vehicle', cost: 45000, footprintImpact: -20, yearlySavings: 1200, description: 'Swap gas emissions for a lithium-powered ride.' },
    coalInvestment: { label: 'coalInvestment', name: 'Invest in Industrial Factory', cost: 30000, footprintImpact: 35, yearlySavings: 15000, description: 'Buy shares in heavy manufacturing plants.' }
};

const EcoModule = {
    footprint: 50, // 0 is pristine green, 100 is heavy industrial polluter
    activeUpgrades: [],

    buyEcoProject(choiceKey) {
        const project = ECO_CHOICES[choiceKey];
        if (!project) { updateLog("Invalid selection choice."); return; }
        if (p.money < project.cost) { updateLog("You cannot afford this investment."); return; }
        if (this.activeUpgrades.includes(choiceKey)) { updateLog("You have already completed this project."); return; }

        p.money -= project.cost;
        this.activeUpgrades.push(choiceKey);
        this.footprint = Math.max(0, Math.min(100, this.footprint + project.footprintImpact));
        updateLog(`🌱 ECO: Purchased "${project.name}". Your footprint shifted by ${project.footprintImpact}.`);
    },

    // Called from ageUp() as EcoModule.applyEcoEffects()
    applyEcoEffects() {
        this.activeUpgrades.forEach(key => { p.money += ECO_CHOICES[key].yearlySavings; });

        if (this.footprint < 30) p.health = Math.min(100, p.health + 5);
        if (this.footprint > 70) p.health = Math.max(0, p.health - 5);

        if (this.footprint > 80) {
            const carbonTax = 2500;
            p.money -= carbonTax;
            p.mental = Math.max(0, p.mental - 8);
            updateLog(`🛑 ENVIRONMENT: Activists protest your high emissions! Charged a $${carbonTax} Carbon Tax.`);
        } else if (this.footprint < 20) {
            p.mental = Math.min(100, p.mental + 5);
            updateLog(`✨ ECO: You received an Eco-Citizen Award for keeping a pristine green footprint! (+5 Mental)`);
        } else {
            updateLog(`🌱 ECO: Current Footprint is ${this.footprint > 50 ? 'Industrial' : 'Green'}. (${this.footprint}/100)`);
        }
    }
};
