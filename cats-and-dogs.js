// ==========================================
// PET MANAGEMENT MODULE
// ==========================================

const PET_SPECIES = {
    dog: { name: 'Dog', cost: 800, maxAge: 15, baseMaintenance: 200 },
    cat: { name: 'Cat', cost: 500, maxAge: 18, baseMaintenance: 150 },
    horse: { name: 'Horse', cost: 5000, maxAge: 25, baseMaintenance: 1200 },
    exotic: { name: 'Exotic (Tiger Cub)', cost: 25000, maxAge: 12, baseMaintenance: 4000 }
};

const PetModule = {
    adoptPet(speciesKey, customName) {
        const spec = PET_SPECIES[speciesKey.toLowerCase()];
        if (!spec) { updateLog("Invalid species selection."); return; }
        if (p.money < spec.cost) { updateLog("You cannot afford this pet."); return; }
        if (!p.relationships.pets) p.relationships.pets = [];

        const newPet = {
            name: customName || `Little ${spec.name}`,
            species: speciesKey,
            age: 0,
            maxAge: spec.maxAge,
            relationship: 50,
            maintenance: spec.baseMaintenance
        };

        p.money -= spec.cost;
        p.relationships.pets.push(newPet);
        updateLog(`🐾 PETS: You adopted a ${spec.name} named ${newPet.name}! (-$${spec.cost.toLocaleString()})`);
    },

    interactWithPet(index, action) {
        const pet = p.relationships.pets[index];
        if (!pet) return;

        if (action === 'play') {
            pet.relationship = Math.min(100, pet.relationship + 15);
            p.mental = Math.min(100, p.mental + 5);
            updateLog(`🎾 PETS: You played fetch with ${pet.name}. They love it!`);
        } else if (action === 'vet') {
            const vetBill = Math.floor(pet.maintenance * 0.5);
            p.money -= vetBill;
            pet.relationship = Math.min(100, pet.relationship + 20);
            updateLog(`🩺 PETS: You took ${pet.name} to the vet for a checkup. (-$${vetBill})`);
        }
        renderPets();
        updateUI();
    },

    // Called from ageUp() so pets age, cost upkeep, and can pass away/run away
    processYearlyPets() {
        if (!p.relationships || !p.relationships.pets || p.relationships.pets.length === 0) return;

        for (let i = p.relationships.pets.length - 1; i >= 0; i--) {
            const pet = p.relationships.pets[i];
            pet.age++;
            p.money -= pet.maintenance;
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
