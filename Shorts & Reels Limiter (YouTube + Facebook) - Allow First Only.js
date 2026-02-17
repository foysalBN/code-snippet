// ==UserScript==
// @name         Shorts & Reels Limiter (YouTube + Facebook) - Allow First Only
// @namespace    http://tampermonkey.net/
// @version      2025-12-22
// @description  Allow first YouTube Short / Facebook Reel, redirect on next swipe
// @author       You
// @match        https://www.youtube.com/*
// @match        https://www.facebook.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const MOTIVATION_URL = "https://zenquotes.io/";

    let lastPathname = null;
    let firstAllowed = false;

    function isShortsOrReels() {
        const path = location.pathname;
        return (
            path.startsWith("/shorts/") ||
            path.startsWith("/reel/") ||
            path.startsWith("/reels/")
        );
    }

    function checkPathChange() {
        const currentPath = location.pathname;

        // Entering Shorts/Reels for the first time
        if (isShortsOrReels() && !firstAllowed) {
            firstAllowed = true;
            lastPathname = currentPath;
            console.log("First Short/Reel allowed:", currentPath);
            return;
        }

        // Swiping to next Short/Reel
        if (isShortsOrReels() && currentPath !== lastPathname) {
            console.log("Next Short/Reel detected → redirecting");
            window.location.href = MOTIVATION_URL;
            return;
        }

        // Leaving Shorts/Reels → reset
        if (!isShortsOrReels()) {
            firstAllowed = false;
            lastPathname = null;
        }
    }

    // Initial check
    checkPathChange();

    // Observe SPA navigation
    const observer = new MutationObserver(checkPathChange);
    observer.observe(document.body, { childList: true, subtree: true });

})();
