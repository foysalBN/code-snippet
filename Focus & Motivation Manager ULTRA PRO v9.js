// ==UserScript==
// @name         Focus & Motivation Manager ULTRA PRO v9
// @namespace    http://tampermonkey.net/
// @version      2026-02-17
// @description  Per-URL timer + Shorts/Reels first-only + expandable allowed URLs list
// @author       You
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function(){
    'use strict';

    const DEFAULT_TIMER_MIN = 5;
    const WARNING_TIME_SEC = 60;
    const DEFAULT_REDIRECT = "https://zenquotes.io/";
    const FEED_SELECTORS = ["ytd-rich-grid-renderer","#pagelet_home_stream","[role=feed]"];

    // --- STORAGE ---
    const STORAGE_KEY = "focus_manager_data";
    function getData() {
        const raw = localStorage.getItem(STORAGE_KEY);
        if(raw) {
            try {
                const obj = JSON.parse(raw);
                if(!obj.allowedUrls) obj.allowedUrls = [];
                if(!obj.shortsReels) obj.shortsReels = {};
                return obj;
            } catch(e){
                return { allowedUrls: [], shortsReels: {} };
            }
        }
        return { allowedUrls: [], shortsReels: {} };
    }
    function setData(data){ localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); }

    const data = getData();
    let timer = DEFAULT_TIMER_MIN*60;
    let paused = false;
    let toastShown = false;
    let feedBlurred = false;

    function secondsToMMSS(sec){ const m=Math.floor(sec/60).toString().padStart(2,'0'); const s=(sec%60).toString().padStart(2,'0'); return `${m}:${s}`; }
    function isShortsOrReel(){ const p=location.pathname; return p.startsWith("/shorts/") || p.startsWith("/reel/") || p.startsWith("/reels/"); }
    function redirectToMotivation(){ window.location.href = DEFAULT_REDIRECT; }

    // --- OVERLAY ---
    function createOverlay() {
        let overlay = document.getElementById("focusOverlay");
        if(!overlay){
            overlay=document.createElement("div");
            overlay.id="focusOverlay";
            overlay.style.position="fixed"; overlay.style.bottom="20px"; overlay.style.right="20px";
            overlay.style.zIndex=99999; overlay.style.background="#1e1e1e"; overlay.style.color="white";
            overlay.style.padding="12px"; overlay.style.borderRadius="12px"; overlay.style.fontFamily="Arial,sans-serif";
            overlay.style.width="260px"; overlay.style.boxShadow="0 4px 12px rgba(0,0,0,0.3)";
            overlay.style.display="flex"; overlay.style.flexDirection="column"; overlay.style.alignItems="center";

            // Timer
            const timerText=document.createElement("div");
            timerText.id="focusTimerText"; timerText.style.fontSize="16px"; timerText.style.marginBottom="6px"; timerText.style.fontWeight="bold";
            overlay.appendChild(timerText);

            // Buttons
            const btnContainer=document.createElement("div");
            btnContainer.style.display="flex"; btnContainer.style.width="100%"; btnContainer.style.marginBottom="4px";

            const allowBtn=document.createElement("button"); allowBtn.textContent="Allow"; allowBtn.style.flex="1"; allowBtn.style.marginRight="2px";
            const add5Btn=document.createElement("button"); add5Btn.textContent="+5 Min"; add5Btn.style.flex="1"; add5Btn.style.marginRight="2px";
            const minus2Btn=document.createElement("button"); minus2Btn.textContent="-2 Min"; minus2Btn.style.flex="1"; minus2Btn.style.marginRight="2px";
            const pauseBtn=document.createElement("button"); pauseBtn.textContent="Pause"; pauseBtn.style.flex="1";

            btnContainer.appendChild(allowBtn); btnContainer.appendChild(add5Btn); btnContainer.appendChild(minus2Btn); btnContainer.appendChild(pauseBtn);
            overlay.appendChild(btnContainer);

            // Expandable allowed URLs
            const allowedSection = document.createElement("div");
            allowedSection.id="allowedSection";
            allowedSection.style.width="100%";
            allowedSection.style.marginTop="6px";
            allowedSection.style.maxHeight="0px";
            allowedSection.style.overflow="hidden";
            allowedSection.style.transition="max-height 0.3s ease";
            overlay.appendChild(allowedSection);

            const toggleBtn = document.createElement("button");
            toggleBtn.textContent="Allowed URLs ▼";
            toggleBtn.style.width="100%";
            toggleBtn.style.marginBottom="4px";
            toggleBtn.addEventListener("click", ()=>{
                if(allowedSection.style.maxHeight === "0px") allowedSection.style.maxHeight="200px";
                else allowedSection.style.maxHeight="0px";
            });
            overlay.insertBefore(toggleBtn, allowedSection);

            document.body.appendChild(overlay);

            // Draggable
            let isDragging=false, offsetX, offsetY;
            overlay.addEventListener("mousedown", e=>{ isDragging=true; offsetX=e.clientX-overlay.getBoundingClientRect().left; offsetY=e.clientY-overlay.getBoundingClientRect().top; });
            document.addEventListener("mousemove", e=>{ if(isDragging){ overlay.style.left=(e.clientX-offsetX)+"px"; overlay.style.top=(e.clientY-offsetY)+"px"; overlay.style.bottom="auto"; overlay.style.right="auto"; } });
            document.addEventListener("mouseup", ()=>isDragging=false);

            // Button actions
            allowBtn.addEventListener("click", ()=>{
                if(!data.allowedUrls.includes(location.href)){
                    data.allowedUrls.push(location.href);
                    setData(data);
                    updateTimerText();
                    refreshAllowedSection();
                }
            });
            add5Btn.addEventListener("click", ()=>{ timer+=5*60; updateTimerText(); });
            minus2Btn.addEventListener("click", ()=>{ timer-=2*60; if(timer<0) timer=0; updateTimerText(); });
            pauseBtn.addEventListener("click", ()=>{ paused=!paused; pauseBtn.textContent=paused?"Resume":"Pause"; });

            refreshAllowedSection();
        }
        return overlay;
    }

    function updateTimerText(){
        const timerText=document.getElementById("focusTimerText");
        if(!timerText) return;
        if(data.allowedUrls.includes(location.href)){ timerText.textContent="URL Allowed ✅"; timerText.style.color="lime"; return; }
        timerText.textContent=`Time Left: ${secondsToMMSS(timer)}`;
        if(timer>120) timerText.style.color="lime";
        else if(timer>60) timerText.style.color="yellow";
        else timerText.style.color="red";
    }

    function refreshAllowedSection(){
        const allowedSection = document.getElementById("allowedSection");
        if(!allowedSection) return;
        clearChildren(allowedSection);
        data.allowedUrls.forEach((url,i)=>{
            const div = document.createElement("div");
            div.style.display="flex"; div.style.justifyContent="space-between"; div.style.alignItems="center"; div.style.fontSize="12px";
            const text = document.createElement("span"); text.textContent=url; text.style.wordBreak="break-all";
            const removeBtn = document.createElement("button"); removeBtn.textContent="✖"; removeBtn.style.fontSize="12px";
            removeBtn.addEventListener("click", ()=>{
                data.allowedUrls.splice(i,1);
                setData(data);
                refreshAllowedSection();
                updateTimerText();
            });
            div.appendChild(text); div.appendChild(removeBtn);
            allowedSection.appendChild(div);
        });
    }

    function showToast(msg){
        const t=document.createElement("div"); t.textContent=msg;
        t.style.position="fixed"; t.style.bottom="60px"; t.style.left="50%"; t.style.transform="translateX(-50%)";
        t.style.background="rgba(0,0,0,0.85)"; t.style.color="white"; t.style.padding="8px 14px"; t.style.borderRadius="6px"; t.style.zIndex=999999;
        document.body.appendChild(t); setTimeout(()=>document.body.removeChild(t),3000);
    }

    // --- SHORTS / REELS ---
    function checkShortsReel(){
        if(!isShortsOrReel()) return false;
        const url = location.href;
        if(!data.shortsReels[url]){
            data.shortsReels[url] = { firstAllowed:true, lastUrl: url };
            setData(data);
            return false;
        }
        if(data.shortsReels[url].firstAllowed && data.shortsReels[url].lastUrl !== url){
            redirectToMotivation();
            return true;
        }
        data.shortsReels[url].lastUrl = url;
        setData(data);
        return false;
    }

    // --- FEED BLUR ---
    function applyFeedBlur(){ if(feedBlurred) return; feedBlurred=true; FEED_SELECTORS.forEach(sel=>{ document.querySelectorAll(sel).forEach(f=>{ f.style.filter="blur(10px) brightness(0.6)"; f.style.pointerEvents="none"; }); });}
    function removeFeedBlur(){ feedBlurred=false; FEED_SELECTORS.forEach(sel=>{ document.querySelectorAll(sel).forEach(f=>{ f.style.filter=""; f.style.pointerEvents=""; }); });}
    function clearChildren(el){ while(el.firstChild) el.removeChild(el.firstChild); }

    // --- SPA NAVIGATION ---
    function onNavigation(callback){
        let lastUrl = location.href;
        new MutationObserver(()=>{
            const url=location.href;
            if(url!==lastUrl){ lastUrl=url; callback(); lastUrl=url; }
        }).observe(document,{subtree:true,childList:true});
    }

    // --- INIT ---
    createOverlay(); updateTimerText();

    setInterval(()=>{
        if(paused || data.allowedUrls.includes(location.href)) { removeFeedBlur(); return; }
        if(checkShortsReel()) return;

        timer--; if(timer<0) timer=0; updateTimerText();
        if(timer===WARNING_TIME_SEC) showToast("⚠️ 1 minute remaining!");
        if(timer<=0){ applyFeedBlur(); redirectToMotivation(); }
    },1000);

    onNavigation(()=>{ createOverlay(); updateTimerText(); });

})();
