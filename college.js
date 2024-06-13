// =============== Random Mark Generator START ===============
let [tc_min, tc_max] = [48, 55]
let [pc_min, pc_max] = [18, 22]

document.querySelectorAll('table[width="100%"] td input:nth-child(3)').forEach(input => input.value = Math.floor(Math.random() * (tc_max - tc_min +1)) + tc_min);
document.querySelectorAll('table[width="100%"] td input:nth-child(4)').forEach(input => input.value = Math.floor(Math.random() * (pc_max - pc_min +1)) + pc_min);
//============================ END ============================


// =============== Random Mark Generator START ===============
let [pf_min, pf_max] = [48, 55]

document.querySelectorAll('table[width="100%"] td input:nth-child(3)').forEach(input => input.value = Math.floor(Math.random() * (pf_max - pf_min +1)) + pf_min);
//============================ END ============================


// =============== Random Mark Generator START ===============
let toppers=[]
let [pf_min, pf_max] = [0, 0]

document.querySelectorAll('table[width="100%"] tr tr').forEach(tr=>{
    return toppers.includes(parseInt(tr.querySelector('td[align="left"]').innerText))
        ?(tr.querySelector('input[type="text"]').value=pf_max, tr.querySelectorAll('*').forEach(td=> td.style.backgroundColor = '#00fd0838'))  // Topper
        :tr.querySelector('input[type="text"]').value= Math.floor(Math.random() * (pf_max - pf_min )) + pf_min //Random Student
})
//============================ END ============================
