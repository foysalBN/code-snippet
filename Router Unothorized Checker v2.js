// ==UserScript==
// @name         Router Unothorized Checker v2
// @namespace    http://tampermonkey.net/
// @version      2024-05-05
// @description  try to take over the world!
// @author       FoysalBN
// @match        http://192.168.1.1/index.htm
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1.1
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const testMac=()=>{
        console.log('test')

        //go to wireless client list
        if(!document.querySelector('#refresh_wl_list')){
            return document.querySelector('#c_menu_list').click()
        }

        let macObj = {
            'c8:3d:d4:77:13:ed':'⭐My PC',
            'b4:cb:57:c3:6c:4b':'⭐Rafi Phone',
            '7c:a1:77:02:bc:18':'⭐raihan',
            'dc:6d:cd:2d:8f:6d':'⭐Tanim',
            '74:f2:fa:62:b7:28':'Sayed',
            '7c:a4:49:01:18:f6':'Obijit',
            'c0:cb:f1:ff:49:04':'Saker',
            '30:56:96:72:a8:5d':'Mojahid',
            'b0:6f:e0:a9:14:ba':'🔥Shovo',
            'b4:31:61:6e:06:61':'Foysal Choto',
            'd8:9b:3b:aa:a3:df':'KHURSED VAI',
            'f6:17:5f:f2:31:75':'Tarek',
            '80:77:a4:34:06:7d':'Miraz-rafi',
            '70:74:14:f2:11:6c':'Irfan-rafi',
            '70:28:8b:35:5a:e9':'⭐Kaium',
        };

        document.querySelectorAll('tbody tr td:nth-child(4)').forEach(td => {
            let mac = td.innerText;
            td.style.color = 'black';
            if (Object.keys(macObj).includes(mac)) {
                td.style.backgroundColor = '#acf98c';
                td.innerHTML=`${mac}<br><b>${macObj[mac]}</b>`

            }else{
                td.style.backgroundColor = '#ff7272';
            }
        });
    }

    const testBtn = document.createElement("button")
    testBtn.id='testbtn'
    testBtn.innerText='Check Mac in Wireless Client List'
    testBtn.style=`padding: 0.7em 1.5em;
    background: white;
    border: none;
    border-radius: 5px;
    box-shadow: inset #00b02f78 0px 0px 5px 1px;
    margin: 1em 1em;`
    testBtn.addEventListener('click',testMac)


    // document.querySelector('#content_layer').appendChild(testBtn)
    document.body.appendChild(testBtn)



})();
