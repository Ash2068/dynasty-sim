// ==========================================
// TOGETHER: CLUBS MODULE
// ==========================================

const CLUB_CONFIGS = {
    Coders: { id: 'Coders', name: 'The Binary Guild (Coders)', dues: 50, description: 'Late-night hackathons and algorithmic puzzles.' },
    Athletes: { id: 'Athletes', name: 'The Iron Syndicate (Athletes)', dues: 120, description: 'Intense physical regimens, stamina building, and track meets.' },
    Partiers: { id: 'Partiers', name: 'The Neon Circle (Partiers)', dues: 300, description: 'Vibrant raves, high-stakes networking, and extreme social stamina.' }
};

const TogetherModule = {
    clubs: ["Coders", "Athletes", "Partiers"],
    activeClub: null,

    joinClub(clubName) {
        if (!this.clubs.includes(clubName)) { updateLog("That club does not exist in this city."); return; }
        this.activeClub = clubName;
        updateLog(`👥 TOGETHER: Joined the ${CLUB_CONFIGS[clubName].name}!`);
    },

    // Called from ageUp() as TogetherModule.processClubBonus()
    processClubBonus() {
        if (!this.activeClub) return;
        const club = CLUB_CONFIGS[this.activeClub];
        p.money -= club.dues;

        if (this.activeClub === "Coders") p.smart = Math.min(100, p.smart + 2);
        if (this.activeClub === "Athletes") p.health = Math.min(100, p.health + 2);
        if (this.activeClub === "Partiers") {
            p.mental = Math.min(100, p.mental + 5);
            p.health = Math.max(0, p.health - 2);
        }

        updateLog(`👥 TOGETHER: ${club.name} activities completed. Paid $${club.dues} in dues.`);
    },

    leaveClub() {
        if (!this.activeClub) { updateLog("You aren't a member of any club right now."); return; }
        const oldClub = this.activeClub;
        this.activeClub = null;
        updateLog(`👥 TOGETHER: You resigned your membership from the ${oldClub} club.`);
    }
};
