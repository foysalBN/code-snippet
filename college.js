// ========================================================================
// ================ 1. Random Mark Generator(TC, PC) START ================
let [tc_min, tc_max] = [48, 55]
let [pc_min, pc_max] = [18, 22]

document.querySelectorAll('table[width="100%"] td input:nth-child(3)').forEach(input => input.value = Math.floor(Math.random() * (tc_max - tc_min +1)) + tc_min);
document.querySelectorAll('table[width="100%"] td input:nth-child(4)').forEach(input => input.value = Math.floor(Math.random() * (pc_max - pc_min +1)) + pc_min);
//================================== END ==================================
// ========================================================================




// ========================================================================
// ================ 2. Random Mark Generator((PF)) START ==================
let [pf_min, pf_max] = [48, 55]

document.querySelectorAll('table[width="100%"] td input:nth-child(3)').forEach(input => input.value = Math.floor(Math.random() * (pf_max - pf_min +1)) + pf_min);
// ================================== END ==================================
// =========================================================================




// ========================================================================
// ============= 3. Random Mark Generator(PF Advanced) START ==============
let absent = []
    ,toppers = []
    ,[pf_min, pf_max] = [0, 1]

let getRoll = tr => parseInt(tr.querySelector('td[align="left"]').innerText)
    ,getInputEl = tr => tr.querySelector('input[type="text"]')
    ,setBgColor = (tr, color) =>tr.querySelectorAll('*').forEach(td=> td.style.backgroundColor = color)
document.querySelectorAll('table[width="100%"] tr tr').forEach(tr=>{
    return absent.includes(getRoll(tr))
        ?(getInputEl(tr).value='A', setBgColor(tr,'#ff00008a')) // Absent
        :toppers.includes(getRoll(tr))
        ?(getInputEl(tr).value=pf_max, setBgColor(tr,'#00fd0838')) // Topper
        :getInputEl(tr).value= Math.floor(Math.random() * (pf_max - pf_min )) + pf_min //Random Student
})
// ================================= END ==================================
// ========================================================================


