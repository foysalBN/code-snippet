// ==UserScript==
// @name         Auto Add to Microsoft To Do - Fully Automated
// @namespace    http://tampermonkey.net/
// @version      6.0
// @description  Automatically handles logins and background token refreshing seamlessly
// @author       You
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @connect      login.microsoftonline.com
// @connect      graph.microsoft.com
// ==/UserScript==

(function() {
    'use strict';

    // ================= CONFIGURATION =================
    const CLIENT_ID = "d23b22dc-6da6-4fcd-ad22-82c3518fba87";
    const TARGET_LIST_ID = "AQMkADAwATM0MDAAMS00NAA1MS1lYjI1LTAwAi0wMAoALgAAA7Gu0dWD2zhCoJfcgcTZ4IUBALQqJ2d_92BMp41m1ZSa3zkAA5grnUIAAAA=";
    // =================================================

    const REDIRECT_URI = "https://login.microsoftonline.com/common/oauth2/nativeclient";
    const SCOPES = "Tasks.ReadWrite offline_access";

    if (window.self !== window.top) return;

    window.addEventListener('load', () => {
        const currentUrl = window.location.href;

        // Intercept the Microsoft native redirect to grab the login code
        if (currentUrl.startsWith(REDIRECT_URI) && window.location.search.includes("code=")) {
            const urlParams = new URLSearchParams(window.location.search);
            const authCode = urlParams.get('code');
            if (authCode) {
                // Show a quick visual status
                const statusDiv = document.createElement('div');
                statusDiv.style = "position:fixed;top:10px;left:10px;z-index:99999;background:black;color:lime;padding:20px;font-size:16px;border:2px solid lime;font-family:sans-serif;";
                statusDiv.innerText = "Connection successful! Saving secure background tokens...";
                document.body.appendChild(statusDiv);

                exchangeCodeForTokens(authCode);
            }
            return;
        }

        // Skip prompt on Microsoft login pages
        if (currentUrl.includes("login.microsoftonline.com")) return;

        const confirmSave = confirm(`Add this site to Microsoft To Do ("Anti-Vision")?\n\nTitle: ${document.title}\nURL: ${window.location.href}`);
        if (confirmSave) {
            ensureAuthenticatedAndAddTask();
        }
    });

    function ensureAuthenticatedAndAddTask() {
        const accessToken = GM_getValue("auto_access_token");
        const refreshToken = GM_getValue("auto_refresh_token");

        if (!accessToken && !refreshToken) {
            startOAuthFlow();
        } else {
            createTask(accessToken, TARGET_LIST_ID);
        }
    }

    function startOAuthFlow() {
        const authUrl = `https://login.microsoftonline.com/consumers/oauth2/v2.0/authorize?client_id=${CLIENT_ID}&response_type=code&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&response_mode=query&scope=${encodeURIComponent(SCOPES)}`;
        alert("Redirecting you to Microsoft to link your account...");
        window.location.href = authUrl;
    }

    function exchangeCodeForTokens(code) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://login.microsoftonline.com/consumers/oauth2/v2.0/token",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: `client_id=${CLIENT_ID}&scope=${encodeURIComponent(SCOPES)}&code=${code}&redirect_uri=${encodeURIComponent(REDIRECT_URI)}&grant_type=authorization_code`,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.access_token) {
                    GM_setValue("auto_access_token", data.access_token);
                    GM_setValue("auto_refresh_token", data.refresh_token);
                    alert("Setup Complete! Background access granted. You can close this tab.");
                } else {
                    alert("Failed to trade code for token. Check browser console.");
                    console.error(data);
                }
            }
        });
    }

    function refreshAccessToken(rToken) {
        GM_xmlhttpRequest({
            method: "POST",
            url: "https://login.microsoftonline.com/consumers/oauth2/v2.0/token",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            data: `client_id=${CLIENT_ID}&scope=${encodeURIComponent(SCOPES)}&refresh_token=${rToken}&grant_type=refresh_token`,
            onload: function(response) {
                const data = JSON.parse(response.responseText);
                if (data.access_token) {
                    GM_setValue("auto_access_token", data.access_token);
                    if (data.refresh_token) GM_setValue("auto_refresh_token", data.refresh_token);
                    createTask(data.access_token, TARGET_LIST_ID);
                } else {
                    // Refresh token failed/expired, force manual re-auth
                    startOAuthFlow();
                }
            }
        });
    }

    function createTask(token, listId) {
        GM_xmlhttpRequest({
            method: "POST",
            url: `https://graph.microsoft.com/v1.0/me/todo/lists/${listId}/tasks`,
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            data: JSON.stringify({
                "title": document.title,
                "body": {
                    "content": `URL: ${window.location.href}`,
                    "contentType": "text"
                }
            }),
            onload: function(response) {
                if (response.status === 201) {
                    console.log("Successfully added to Microsoft To Do!");

                    const successBanner = document.createElement('div');
                    successBanner.style = "position:fixed;top:50%;left:50%;transform:translate(-50%, -50%);z-index:999999;background:#107c41;color:white;padding:30px;font-size:20px;font-family:sans-serif;border-radius:8px;box-shadow:0 4px 15px rgba(0,0,0,0.5);text-align:center;";
                    successBanner.innerText = "✓ Task Added! You are One step ahead of Success";
                    document.body.appendChild(successBanner);

                    setTimeout(() => {
                        // successBanner.remove();
                    }, 1500);

                } else if (response.status === 401) {
                    // Token expired. Silently try to refresh using the refresh token
                    const rToken = GM_getValue("auto_refresh_token");
                    if (rToken) {
                        refreshAccessToken(rToken);
                    } else {
                        startOAuthFlow();
                    }
                } else {
                    console.error("Task creation failed", response.responseText);
                }
            }
        });
    }
})();
