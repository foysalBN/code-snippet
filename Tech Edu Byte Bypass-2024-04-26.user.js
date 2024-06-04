// ==UserScript==
// @name         Tech Edu Byte Bypass
// @namespace    http://tampermonkey.net/
// @version      2024-04-26
// @description  try to take over the world!
// @author       You
// @match        https://www.techedubyte.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=techedubyte.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const link1=document.querySelector('#wpsafe-link button')
    if(link1){
        link1.click()
    }

    const tableTr = document.querySelectorAll('table tbody tr')
    if(tableTr.length ==1 ){
        tableTr[0].querySelector('a').click()
    }
})();