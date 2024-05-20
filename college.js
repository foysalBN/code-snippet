// =============== Random Mark Generator START ===============
let [tc_min, tc_max] = [48, 55]
let [pc_min, pc_max] = [18, 22]

document.querySelectorAll('table[width="100%"] td input:nth-child(3)').forEach(input => input.value = Math.floor(Math.random() * (tc_max - tc_min +1)) + tc_min);
document.querySelectorAll('table[width="100%"] td input:nth-child(4)').forEach(input => input.value = Math.floor(Math.random() * (pc_max - pc_min +1)) + pc_min);
//============================ END ============================
