// ==UserScript==
// @name         PHero Helper
// @namespace    http://tampermonkey.net/
// @version      2024-06-07
// @description  try to take over the world!
// @author       FoysalBn
// @match        https://web.programming-hero.com/*/video/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=programming-hero.com
// @grant        GM_setClipboard
// ==/UserScript==

(function() {
    'use strict';

    // Create helperDiv
    let helperDiv = document.createElement('div');
    helperDiv.id = 'helper-div';

    helperDiv.innerHTML = `
        <p id="helper-title">🔥Helper</p>
        <div id="helper-tools">
            <button id="enable-pip">Enable PictureInPicture</button>
            <button id="copy-title">Copy Title</button>
            <button id="copy-mdlink">Copy [Title](url)</button>
        </div>`;
    // Append helperDiv to the body
    document.body.appendChild(helperDiv);


    // Create a <style> element for the hover effect
    let style = document.createElement('style');
    style.innerHTML = `
    #helper-div {
        position: absolute;
        top: 68px;
        right: 2em;
        display: flex;
        flex-direction: row-reverse;
        cursor: pointer;
        padding:1em 0;
    }
    #helper-title{
        margin-left: 1em;
        color: #7a20ed;
    }
    #helper-tools {
        display: none;
    }
    #helper-div:hover #helper-tools {
        display: block;
    }
    #helper-tools button{
        color:white;
        background: none;
        padding: 0.5em 1.2em;
        border-radius: 9px;
        border: none;
        box-shadow: inset #8700b9 0px 0px 5px 0px;
    }`;

    // Append the <style> element to the head
    document.head.appendChild(style);


    //fn: enable Picture In Picture
    const enablePIP=async()=>{
        const video = document.querySelector('video')
        video.removeAttribute('disablepictureinpicture')

        //Fet: Enter PIP
        try {
            if (video !== document.pictureInPictureElement) {
                await video.requestPictureInPicture();
            } else {
                await document.exitPictureInPicture();
            }
        } finally {console.log('🔥finally')}
    }
    const copyTitle=()=>{
        const title=document.querySelector('.container h3').innerText
        GM_setClipboard(title)
    }
    const copyMdLink=()=>{
        const title=document.querySelector('.container h3').innerText
        const url =window.location.href
        let mdLink = '[' + title + '](' + url +')'
        GM_setClipboard(mdLink)
    }


    //Handle click Event
    document.querySelector('#enable-pip').addEventListener('click',enablePIP)
    document.querySelector('#copy-title').addEventListener('click',copyTitle)
    document.querySelector('#copy-mdlink').addEventListener('click',copyMdLink)

})();
