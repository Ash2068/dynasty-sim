// ==========================================
// CITY & HOUSING SYSTEM MODULE
// ==========================================

const CITY_DISTRICTS = {
    suburbs: { id: 'suburbs', name: 'The Suburbs', rent: 800, description: 'Quiet, affordable, but far away from nightlife.', happinessBonus: 2 },
    downtown: { id: 'downtown', name: 'Downtown Studio', rent: 1200, description: 'Right in the action. Loud, busy, and trendy.', happinessBonus: 5 },
    luxury: { id: 'luxury', name: 'Penthouse District', rent: 3500, description: 'High-class living with a private skyline view.', happinessBonus: 12 }
};

const CityModule = {
    currentDistrict: 'downtown',
    missedRentMonths: 0,

    moveDistrict(districtKey) {
        const target = CITY_DISTRICTS[districtKey.toLowerCase()];
        if (!target) { updateLog("Invalid city district selection."); return; }
        this.currentDistrict = districtKey.toLowerCase();
        updateLog(`🚚 CITY: You signed a new lease and moved into a ${target.name}!`);
    },

    // Called from ageUp() as CityModule.payRent()
    payRent() {
        if (p.age < 18 || p.isMarried) return;

        const apartment = CITY_DISTRICTS[this.currentDistrict];
        const rentBill = apartment.rent;

        if (p.money >= rentBill) {
            p.money -= rentBill;
            p.mental = Math.min(100, p.mental + apartment.happinessBonus);
            this.missedRentMonths = 0;
            updateLog(`🏙️ CITY: Paid $${rentBill.toLocaleString()} for your ${apartment.name}.`);
        } else {
            this.missedRentMonths++;
            p.mental = Math.max(0, p.mental - 20);

            if (this.missedRentMonths >= 2) {
                this.currentDistrict = 'suburbs';
                this.missedRentMonths = 0;
                const penalty = 500;
                p.money -= penalty;
                updateLog(`🚨 EVICTION: You were evicted for non-payment! Forced to move to ${CITY_DISTRICTS.suburbs.name} and charged a $${penalty} fine.`);
            } else {
                updateLog(`⚠️ WARNING: You couldn't afford your $${rentBill} rent! You are facing eviction next cycle.`);
            }
        }

        if (Math.random() < 0.10) {
            const fluctuation = Math.random() > 0.5 ? 50 : -50;
            CITY_DISTRICTS[this.currentDistrict].rent += fluctuation;
            const direction = fluctuation > 0 ? "increased" : "decreased";
            updateLog(`📈 MARKET: Local real estate trends shifted. Your rent ${direction} by $${Math.abs(fluctuation)}.`);
        }
    }
};
