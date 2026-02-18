// ==UserScript==
// @name         Focus & Motivation Manager ULTRA PRO v10.3
// @namespace    http://tampermonkey.net/
// @version      2026-02-18
// @description  Focus timer with URL allowlist + safe redirect + auto 2-min pause with countdown
// @match        *://*/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    // ================= CONFIG =================
    const CONFIG = {
        defaultTimerMin: 2,
        redirectUrl: "https://zenquotes.io/",
        storageKey: "focus_manager_v10_url",
        autoPauseSec: 120 // 2 minutes auto-pause
    };

    // ================= STORAGE =================
    const Storage = {
        load() {
            try {
                const raw = localStorage.getItem(CONFIG.storageKey);
                const data = raw ? JSON.parse(raw) : {};
                if (!data.allowedUrls) data.allowedUrls = [];
                return data;
            } catch {
                return { allowedUrls: [] };
            }
        },
        save(data) {
            localStorage.setItem(CONFIG.storageKey, JSON.stringify(data));
        }
    };

    // ================= STATE =================
    const state = {
        timer: CONFIG.defaultTimerMin * 60,
        paused: false,
        pauseRemaining: 0,
        pauseInterval: null,
        redirected: false,
        data: Storage.load()
    };

    // ================= HELPERS =================
    function isAllowed() {
        return state.data.allowedUrls.includes(location.href);
    }

    function format(sec) {
        const m = String(Math.floor(sec / 60)).padStart(2, "0");
        const s = String(sec % 60).padStart(2, "0");
        return `${m}:${s}`;
    }

    function redirectToMotivation() {
        if (state.redirected) return;
        state.redirected = true;
        location.replace(CONFIG.redirectUrl);
    }

    // ================= UI =================
    const UI = {
        pauseBtn: null,

        init() {
            if (document.getElementById("focusOverlay")) return;

            const overlay = document.createElement("div");
            overlay.id = "focusOverlay";

            Object.assign(overlay.style, {
                position: "fixed",
                bottom: "20px",
                right: "20px",
                width: "260px",
                background: "#1e1e1e",
                color: "white",
                padding: "12px",
                borderRadius: "12px",
                zIndex: "99999",
                fontFamily: "Arial,sans-serif",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
            });

            // Timer
            const timerText = document.createElement("div");
            timerText.id = "focusTimer";
            timerText.style.fontWeight = "bold";
            overlay.appendChild(timerText);

            // Buttons row
            const row = document.createElement("div");
            row.style.display = "flex";
            row.style.gap = "4px";

            const allowBtn = document.createElement("button");
            allowBtn.textContent = "Allow URL";

            const addBtn = document.createElement("button");
            addBtn.textContent = "+2 Min";

            const minusBtn = document.createElement("button");
            minusBtn.textContent = "-2 Min";

            const pauseBtn = document.createElement("button");
            pauseBtn.textContent = "Pause";
            UI.pauseBtn = pauseBtn;

            row.append(allowBtn, addBtn, minusBtn, pauseBtn);
            overlay.appendChild(row);

            // Toggle button
            const toggleBtn = document.createElement("button");
            toggleBtn.textContent = "Allowed URLs ▼";
            overlay.appendChild(toggleBtn);

            // Allowed list
            const list = document.createElement("div");
            list.id = "allowedList";
            Object.assign(list.style, {
                maxHeight: "0px",
                overflow: "hidden",
                transition: "max-height .3s ease"
            });
            overlay.appendChild(list);

            document.body.appendChild(overlay);

            // ---------- draggable ----------
            let dragging = false;
            let ox = 0, oy = 0;

            overlay.addEventListener("mousedown", e => {
                dragging = true;
                ox = e.clientX - overlay.getBoundingClientRect().left;
                oy = e.clientY - overlay.getBoundingClientRect().top;
            });

            document.addEventListener("mousemove", e => {
                if (!dragging) return;
                overlay.style.left = (e.clientX - ox) + "px";
                overlay.style.top = (e.clientY - oy) + "px";
                overlay.style.right = "auto";
                overlay.style.bottom = "auto";
            });

            document.addEventListener("mouseup", () => dragging = false);

            // ---------- button actions ----------
            allowBtn.onclick = () => {
                if (!isAllowed()) {
                    state.data.allowedUrls.push(location.href);
                    Storage.save(state.data);
                    UI.refreshList();
                    UI.updateTimer();
                }
            };

            addBtn.onclick = () => {
                state.timer += 120;
                UI.updateTimer();
            };

            minusBtn.onclick = () => {
                state.timer = Math.max(0, state.timer - 120);
                UI.updateTimer();
            };

            pauseBtn.onclick = () => {
                // Manual resume
                if (state.paused) {
                    state.paused = false;
                    state.pauseRemaining = 0;
                    if (state.pauseInterval) {
                        clearInterval(state.pauseInterval);
                        state.pauseInterval = null;
                    }
                    pauseBtn.textContent = "Pause";
                    return;
                }

                // Start auto-pause
                state.paused = true;
                state.pauseRemaining = CONFIG.autoPauseSec;
                pauseBtn.textContent = `Resume (${format(state.pauseRemaining)})`;

                state.pauseInterval = setInterval(() => {
                    state.pauseRemaining--;
                    if (state.pauseRemaining <= 0) {
                        state.paused = false;
                        state.pauseRemaining = 0;
                        clearInterval(state.pauseInterval);
                        state.pauseInterval = null;
                        pauseBtn.textContent = "Pause";
                    } else {
                        pauseBtn.textContent = `Resume (${format(state.pauseRemaining)})`;
                    }
                }, 1000);
            };

            toggleBtn.onclick = () => {
                list.style.maxHeight =
                    list.style.maxHeight === "0px" ? "200px" : "0px";
            };

            this.refreshList();
            this.updateTimer();
        },

        updateTimer() {
            const el = document.getElementById("focusTimer");
            if (!el) return;

            if (isAllowed()) {
                el.textContent = "URL Allowed ✅";
                el.style.color = "lime";
                return;
            }

            el.textContent = `Time Left: ${format(state.timer)}`;

            if (state.timer > 120) el.style.color = "lime";
            else if (state.timer > 60) el.style.color = "yellow";
            else el.style.color = "red";
        },

        refreshList() {
            const list = document.getElementById("allowedList");
            if (!list) return;

            list.replaceChildren();

            state.data.allowedUrls.forEach((url, i) => {
                const row = document.createElement("div");
                row.style.display = "flex";
                row.style.justifyContent = "space-between";
                row.style.fontSize = "12px";

                const txt = document.createElement("span");
                txt.textContent = url;
                txt.style.wordBreak = "break-all";

                const del = document.createElement("button");
                del.textContent = "✖";

                del.onclick = () => {
                    state.data.allowedUrls.splice(i, 1);
                    Storage.save(state.data);
                    UI.refreshList();
                    UI.updateTimer();
                };

                row.append(txt, del);
                list.appendChild(row);
            });
        }
    };

    // ================= TIMER =================
    function tick() {
        if (state.paused || isAllowed()) return;

        state.timer = Math.max(0, state.timer - 1);
        UI.updateTimer();

        if (state.timer <= 0) {
            redirectToMotivation();
        }
    }

    // ================= INIT =================
    UI.init();
    setInterval(tick, 1000);

})();
