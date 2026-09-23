// ==========================================
// SEASONS & WEATHER EFFECTS MODULE
// ==========================================

const SEASON_DETAILS = {
    Spring: { name: "Spring", icon: "🌸", description: "Flowers blooming, fresh air, and seasonal allergies." },
    Summer: { name: "Summer", icon: "☀️", description: "Bright sunny days, beach trips, and intense heat waves." },
    Autumn: { name: "Autumn", icon: "🍂", description: "Cooler breezes, falling leaves, and cozy sweaters." },
    Winter: { name: "Winter", icon: "❄️", description: "Freezing temperatures, icy sidewalks, and flu season." }
};

const SeasonsModule = {
    currentSeason: "Spring",
    seasons: ["Spring", "Summer", "Autumn", "Winter"],

    // Called from ageUp() as SeasonsModule.updateSeason(p.age)
    updateSeason(age) {
        this.currentSeason = this.seasons[age % 4];
        this.applySeasonalEffects();
    },

    applySeasonalEffects() {
        let msg = `The season is now ${this.currentSeason}.`;

        if (this.currentSeason === "Winter") {
            p.health = Math.max(0, p.health - 2);
            msg += " It's freezing! Health slightly dropped.";
        } else if (this.currentSeason === "Summer") {
            p.mental = Math.min(100, p.mental + 5);
            msg += " The sun is out! Mental health improved.";
        } else if (this.currentSeason === "Spring") {
            if (Math.random() < 0.30) {
                p.health = Math.max(0, p.health - 3);
                msg += " High pollen counts triggered an allergy flare-up! (-3 Health)";
            } else {
                msg += " Warm weather returns. Perfect time to go outside.";
            }
        } else if (this.currentSeason === "Autumn") {
            const clothingCost = 150;
            p.money = Math.max(0, p.money - clothingCost);
            p.mental = Math.min(100, p.mental + 3);
            msg += ` Cozy autumn winds arrive! You updated your wardrobe. (-$${clothingCost}, +3 Mental)`;
        }

        updateLog(`🌦️ SEASONS: ${msg}`);
    },

    // 5% chance of an extreme weather event matching the current season
    triggerRandomWeatherAnomaly() {
        if (Math.random() >= 0.05) return;
        if (this.currentSeason === "Winter") {
            p.health = Math.max(0, p.health - 10);
            updateLog("🥶 WEATHER: A historic polar vortex hit your region! (-10 Health)");
        } else if (this.currentSeason === "Summer") {
            p.health = Math.max(0, p.health - 5);
            updateLog("🥵 WEATHER: An extreme summer heatwave triggered rolling blackouts. (-5 Health)");
        } else if (this.currentSeason === "Spring") {
            updateLog("🌧️ WEATHER: Heavy spring downpours flooded your street, keeping you indoors all week.");
        } else {
            updateLog("💨 WEATHER: Beautiful crisp autumn weather makes for excellent park walks.");
        }
    }
};
