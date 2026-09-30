// ==========================================
// PET MANAGEMENT MODULE
// ==========================================
const PET_SPECIES = {
    dog: { name: 'Dog', cost: 800, maxAge: 15, baseMaintenance: 200 },
    cat: { name: 'Cat', cost: 500, maxAge: 18, baseMaintenance: 150 },
    fish: { name: 'Fish', cost: 100, maxAge: 10, baseMaintenance: 20 },
    horse: { name: 'Horse', cost: 5000, maxAge: 25, baseMaintenance: 1200 },
    exotic: { name: 'Exotic (Tiger Cub)', cost: 25000, maxAge: 12, baseMaintenance: 4000 }
};
            pet.relationship = Math.min(100, pet.relationship + 15);
            p.mental = Math.min(100, p.mental + 5);
            updateLog(`🎾 PETS: You played fetch with ${pet.name}. They love it!`);
        } else if (action === 'feed' && pet.species === 'fish') {
            pet.relationship = Math.min(100, pet.relationship + 10);
            p.mental = Math.min(100, p.mental + 3);
            updateLog(`🐟 PETS: You fed ${pet.name} and watched them swim.`);
        } else if (action === 'clean' && pet.species === 'fish') {
            const cleaningCost = pet.familyPet ? 0 : Math.floor(pet.maintenance * 0.5);
            p.money -= cleaningCost;
            pet.relationship = Math.min(100, pet.relationship + 15);
            updateLog(`🧽 PETS: You cleaned ${pet.name}'s tank.${cleaningCost ? ` (-$${cleaningCost})` : ""}`);
        } else if (action === 'vet') {
            const vetBill = Math.floor(pet.maintenance * 0.5);
            p.money -= vetBill;
        for (let i = p.relationships.pets.length - 1; i >= 0; i--) {
            const pet = p.relationships.pets[i];
            pet.age++;
             if (!pet.familyPet) p.money -= pet.maintenance;
            pet.relationship = Math.max(0, pet.relationship - 5);
            if (pet.age >= pet.maxAge) {
                p.mental = Math.max(0, p.mental - 25);
                updateLog(`🌈 PETS: Your beloved ${pet.species}, ${pet.name}, passed away at age ${pet.age}. (-25 Mental)`);
                p.relationships.pets.splice(i, 1);
                continue;
            }
            if (pet.relationship < 15) {
                updateLog(`🏃 PETS: ${pet.name} ran away from home because they felt neglected!`);
                p.relationships.pets.splice(i, 1);
            }
        }
    }
};
