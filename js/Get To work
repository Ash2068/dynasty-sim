const WorkModule = {
    triggerWorkEvent() {
        if (!p.job || p.age < 18) return;
        if (Math.random() < 0.2) {
            const bonus = Math.floor(p.job.salary * 0.1);
            p.money += bonus;
            updateLog(`💼 WORK: You took an extra shift. +$${bonus.toLocaleString()}`);
        }
    }
};
