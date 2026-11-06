(() => {
  "use strict";
  const C = window.CONTENT || {};
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} },
    del(k) { try { localStorage.removeItem(k); } catch {} },
  };
  const esc = (s = "") => String(s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
  const pick = (path) => path.split(".").reduce((o, k) => (o ? o[k] : undefined), C);

  /* ---------- simple text bindings ---------- */
  $$("[data-c]").forEach((el) => { const v = pick(el.dataset.c); if (v != null) el.textContent = v; });

  /* =========================================================
     CONFETTI (sand + clay + lake coloured)
     ========================================================= */
  const confetti = (() => {
    const cv = $("#confetti"), ctx = cv.getContext("2d");
    let parts = [], raf = 0;
    const colors = ["#C8643B", "#F2A93B", "#5FB3BF", "#EFA6A0", "#FFF8EC", "#9C4426"];
    const size = () => { const d = devicePixelRatio || 1; cv.width = innerWidth * d; cv.height = innerHeight * d; ctx.setTransform(d, 0, 0, d, 0, 0); };
    addEventListener("resize", size); size();
    function burst(x = innerWidth / 2, y = innerHeight / 2, n = 120) {
      if (reduceMotion) return;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * Math.PI * 2, s = 4 + Math.random() * 9;
        parts.push({ x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6, r: 3 + Math.random() * 5, c: colors[i % colors.length], rot: Math.random() * 6, vr: (Math.random() - .5) * .3, life: 1, shape: Math.random() < .5 });
      }
      if (!raf) raf = requestAnimationFrame(tick);
    }
    function tick() {
      ctx.clearRect(0, 0, innerWidth, innerHeight);
      parts = parts.filter((p) => p.life > 0 && p.y < innerHeight + 40);
      for (const p of parts) {
        p.vy += .25; p.vx *= .99; p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.life -= .006;
        ctx.save(); ctx.globalAlpha = Math.max(p.life, 0); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.c;
        if (p.shape) ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r); else { ctx.beginPath(); ctx.arc(0, 0, p.r * .7, 0, 7); ctx.fill(); }
        ctx.restore();
      }
      raf = parts.length ? requestAnimationFrame(tick) : 0;
      if (!raf) ctx.clearRect(0, 0, innerWidth, innerHeight);
    }
    return { burst };
  })();

  /* =========================================================
     GATE — brush away the sand
     ========================================================= */
  const gate = $("#gate"), site = $("#site");
  const SEEN_KEY = "fayoum-bach-entered";

  function openSite(instant) {
    store.set(SEEN_KEY, true);
    document.body.classList.remove("locked");
    site.setAttribute("aria-hidden", "false");
    site.classList.add("is-on");
    if (instant) { gate.classList.add("is-gone"); }
    else {
      gate.classList.add("is-leaving");
      setTimeout(() => gate.classList.add("is-gone"), 950);
      setTimeout(() => confetti.burst(innerWidth / 2, innerHeight * .35, 160), 350);
    }
    startHero();
  }

  $("#enterBtn").addEventListener("click", () => openSite(false));
  $("#replayBtn").addEventListener("click", () => { store.del(SEEN_KEY); location.reload(); });

  function initSand() {
    const cv = $("#sand"), ctx = cv.getContext("2d");
    const gcv = $("#grains"), g = gcv.getContext("2d");
    const bar = $("#digBar"), pct = $("#digPct"), meter = $(".gate__meter");
    const GRID = 24;               // coverage grid cell (css px)
    const THRESHOLD = 0.58;        // reveal when this much is cleared
    let W = 0, H = 0, cols = 0, rows = 0, cleared, clearedCount = 0, total = 1;
    let brush = 34, done = false, last = null, grains = [], graf = 0;

    function paintSand() {
      const d = devicePixelRatio || 1;
      W = innerWidth; H = innerHeight;
      cv.width = gcv.width = Math.round(W * d); cv.height = gcv.height = Math.round(H * d);
      ctx.setTransform(d, 0, 0, d, 0, 0); g.setTransform(d, 0, 0, d, 0, 0);
      brush = Math.max(28, Math.min(W, H) * .085);

      // base gradient
      const gr = ctx.createLinearGradient(0, 0, W * .3, H);
      gr.addColorStop(0, "#F1D9A8"); gr.addColorStop(.5, "#E5C089"); gr.addColorStop(1, "#D6A867");
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = gr; ctx.fillRect(0, 0, W, H);

      // dune ripples
      ctx.lineCap = "round";
      for (let y = -20; y < H + 40; y += 22) {
        ctx.beginPath();
        const amp = 6 + Math.random() * 6, ph = Math.random() * 6;
        for (let x = 0; x <= W; x += 12) ctx.lineTo(x, y + Math.sin(x / 55 + ph) * amp);
        ctx.strokeStyle = `rgba(160, 110, 55, ${.08 + Math.random() * .08})`; ctx.lineWidth = 2; ctx.stroke();
        ctx.beginPath();
        for (let x = 0; x <= W; x += 12) ctx.lineTo(x, y + 3 + Math.sin(x / 55 + ph) * amp);
        ctx.strokeStyle = "rgba(255, 245, 220, .18)"; ctx.lineWidth = 1.5; ctx.stroke();
      }
      // grain speckles
      const n = Math.min(14000, (W * H) / 18);
      const tones = ["#B98A4E", "#F7E7C4", "#C99A5B", "#FFF4DA", "#A87B44"];
      for (let i = 0; i < n; i++) {
        ctx.fillStyle = tones[i % tones.length]; ctx.globalAlpha = .25 + Math.random() * .5;
        ctx.fillRect(Math.random() * W, Math.random() * H, 1 + Math.random() * 1.6, 1 + Math.random() * 1.6);
      }
      ctx.globalAlpha = 1;

      // hint text + doodles
      ctx.textAlign = "center"; ctx.fillStyle = "rgba(90, 55, 30, .75)";
      ctx.font = `700 ${Math.min(42, W * .09)}px Caveat, cursive`;
      ctx.fillText(C.gate?.hint || "Brush away the sand ✋", W / 2, H * .2);
      ctx.font = `600 ${Math.min(22, W * .05)}px "DM Sans", sans-serif`;
      ctx.fillStyle = "rgba(90, 55, 30, .55)";
      ctx.fillText("something's buried here… 🏺", W / 2, H * .2 + 36);
      ctx.font = `${Math.min(46, W * .1)}px serif`;
      [["🐚", .14, .72], ["🌵", .86, .62], ["🦂", .8, .88], ["🐪", .18, .4]].forEach(([e, x, y]) => ctx.fillText(e, W * x, H * y));

      // coverage grid
      cols = Math.ceil(W / GRID); rows = Math.ceil(H / GRID);
      cleared = new Uint8Array(cols * rows); clearedCount = 0; total = cols * rows;
    }

    function markCleared(x, y) {
      const r = brush;
      const c0 = Math.max(0, Math.floor((x - r) / GRID)), c1 = Math.min(cols - 1, Math.floor((x + r) / GRID));
      const r0 = Math.max(0, Math.floor((y - r) / GRID)), r1 = Math.min(rows - 1, Math.floor((y + r) / GRID));
      for (let cy = r0; cy <= r1; cy++) for (let cx = c0; cx <= c1; cx++) {
        const mx = cx * GRID + GRID / 2, my = cy * GRID + GRID / 2;
        if ((mx - x) ** 2 + (my - y) ** 2 <= r * r) {
          const i = cy * cols + cx; if (!cleared[i]) { cleared[i] = 1; clearedCount++; }
        }
      }
    }

    function dig(x, y) {
      ctx.globalCompositeOperation = "destination-out";
      ctx.lineCap = ctx.lineJoin = "round"; ctx.lineWidth = brush * 2;
      ctx.beginPath();
      if (last) { ctx.moveTo(last.x, last.y); ctx.lineTo(x, y); ctx.stroke(); }
      ctx.arc(x, y, brush, 0, Math.PI * 2); ctx.fill();
      // mark coverage along the segment
      const steps = last ? Math.ceil(Math.hypot(x - last.x, y - last.y) / (brush / 2)) : 1;
      for (let s = 1; s <= steps; s++) {
        const t = s / steps; markCleared(last ? last.x + (x - last.x) * t : x, last ? last.y + (y - last.y) * t : y);
      }
      spray(x, y);
      last = { x, y };
      update();
    }

    function update() {
      const p = Math.min(1, clearedCount / total / THRESHOLD);
      const shown = Math.round(p * 100);
      bar.style.width = shown + "%"; pct.textContent = shown; meter.setAttribute("aria-valuenow", shown);
      if (!done && clearedCount / total >= THRESHOLD) finish();
    }

    function spray(x, y) {
      if (reduceMotion) return;
      for (let i = 0; i < 5; i++) {
        grains.push({ x: x + (Math.random() - .5) * brush, y: y + (Math.random() - .5) * brush, vx: (Math.random() - .5) * 5, vy: -2 - Math.random() * 3, life: 1, r: 1 + Math.random() * 2.2, c: Math.random() < .5 ? "#C99A5B" : "#E5C089" });
      }
      if (grains.length > 400) grains.splice(0, grains.length - 400);
      if (!graf) graf = requestAnimationFrame(animGrains);
    }
    function animGrains() {
      g.clearRect(0, 0, W, H);
      grains = grains.filter((p) => p.life > 0);
      for (const p of grains) {
        p.vy += .3; p.x += p.vx; p.y += p.vy; p.life -= .03;
        g.globalAlpha = Math.max(0, p.life); g.fillStyle = p.c; g.fillRect(p.x, p.y, p.r, p.r);
      }
      g.globalAlpha = 1;
      graf = grains.length ? requestAnimationFrame(animGrains) : 0;
    }

    function finish() {
      done = true;
      bar.style.width = "100%"; pct.textContent = 100;
      gate.classList.add("is-found");
      confetti.burst(innerWidth / 2, innerHeight / 2, 90);
      try { navigator.vibrate && navigator.vibrate([30, 40, 60]); } catch {}
      setTimeout(() => $("#enterBtn").focus({ preventScroll: true }), 500);
    }

    // pointer handling
    const pos = (e) => { const r = cv.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    let down = false;
    cv.addEventListener("pointerdown", (e) => { down = true; last = null; try { cv.setPointerCapture(e.pointerId); } catch {} const p = pos(e); dig(p.x, p.y); });
    cv.addEventListener("pointermove", (e) => {
      // mouse users can brush just by hovering with the button held; touch always has `down`
      if (!down) return;
      const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
      for (const ev of evs.length ? evs : [e]) { const p = pos(ev); dig(p.x, p.y); }
    });
    const up = () => { down = false; last = null; };
    cv.addEventListener("pointerup", up); cv.addEventListener("pointercancel", up); cv.addEventListener("pointerleave", up);

    // auto-dig (skip button)
    $("#skipBtn").addEventListener("click", () => {
      if (done) return;
      let t = 0;
      const sweep = () => {
        if (done) return;
        const rowsN = 7, y = (Math.floor(t / 22) + .5) * (H / rowsN);
        const prog = (t % 22) / 21, dir = Math.floor(t / 22) % 2;
        const x = (dir ? 1 - prog : prog) * W;
        if (t % 22 === 0) last = null;
        dig(x, y); t++;
        if (t < rowsN * 22 + 4) requestAnimationFrame(sweep); else finish();
      };
      sweep();
    });

    // redraw on resize only if barely dug (avoid wiping progress on mobile URL-bar resize)
    let rt;
    addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(() => {
        if (done) return;
        if (Math.abs(innerWidth - W) > 40 || clearedCount / total < .05) { paintSand(); update(); }
      }, 200);
    });

    // fonts affect the hint text — repaint once they're ready
    paintSand();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { if (clearedCount === 0) paintSand(); });
  }

  /* =========================================================
     HERO: letter drop, countdown, camel
     ========================================================= */
  let heroStarted = false;
  function startHero() {
    if (heroStarted) return; heroStarted = true;
    const t = $(".hero__title");
    let i = 0;
    t.innerHTML = (C.tripName || "").split(" ").map((w) => `<span class="word">${[...w].map((ch) => `<span class="ch" style="animation-delay:${.35 + i++ * .04}s">${esc(ch)}</span>`).join("")}</span>`).join(" ");
    t.setAttribute("aria-label", C.tripName || "");
    runCountdown();
  }

  function runCountdown() {
    const start = new Date(C.start).getTime(), end = new Date(C.end).getTime();
    const els = { d: $('[data-cd="d"]'), h: $('[data-cd="h"]'), m: $('[data-cd="m"]'), s: $('[data-cd="s"]') };
    const msg = $("#cdMsg");
    const set = (el, v) => { const s = String(v).padStart(2, "0"); if (el.textContent !== s) { el.textContent = s; el.classList.remove("tick"); void el.offsetWidth; el.classList.add("tick"); } };
    function tick() {
      const now = Date.now();
      if (isNaN(start)) { msg.textContent = "dates coming soon ✨"; return; }
      if (now >= start) {
        ["d", "h", "m", "s"].forEach((k) => set(els[k], 0));
        msg.textContent = now <= end ? "IT'S HAPPENING, HABIBTI!! 🎉" : "what a trip. we'll never recover 💛";
        return;
      }
      let diff = Math.floor((start - now) / 1000);
      set(els.d, Math.floor(diff / 86400)); diff %= 86400;
      set(els.h, Math.floor(diff / 3600)); diff %= 3600;
      set(els.m, Math.floor(diff / 60)); set(els.s, diff % 60);
      setTimeout(tick, 1000);
    }
    tick();
  }

  const camelLines = ["Yalla! 🐪", "Bride coming through!", "Sunscreen?? ☀️", "Mabrouk! 💍", "Spit-free zone 😇", "Dune it! 🏜️"];
  let camelI = 0, camelT;
  $("#camel").addEventListener("click", (e) => {
    const say = $("#camelSay");
    say.textContent = camelLines[camelI++ % camelLines.length];
    say.classList.add("show");
    clearTimeout(camelT); camelT = setTimeout(() => say.classList.remove("show"), 1600);
    const r = e.currentTarget.getBoundingClientRect();
    confetti.burst(r.left + r.width / 2, r.top, 24);
  });

  /* =========================================================
     SQUAD flip cards
     ========================================================= */
  const squadGrid = $("#squadGrid");
  const squadEmojis = ["💃", "✨", "🌵", "🏺", "🌅", "🐪", "💖", "🌙", "🪩", "🍉", "🌸", "🦋", "🥂", "🌴", "🎀", "⭐", "🍓", "🐚", "🌻", "💫", "🫶"];
  const backLines = ["Bride Tribe 💛", "Fayoum-ready ✨", "Dune & done 🏜️", "Here for the henna 🌿", "Pottery pro (soon) 🏺", "Lake Qarun, here we come 🛶"];
  (C.squad || []).forEach((p, i) => {
    const b = document.createElement("button");
    const role = p.role || "Bride Tribe";
    b.type = "button";
    b.className = "card reveal" + (i === 0 ? " card--bride" : "") + (p.role ? " card--vip" : "");
    b.style.transitionDelay = (i % 3) * 60 + "ms";
    b.setAttribute("aria-label", `${p.name}, ${role}. Tap to flip.`);
    b.innerHTML = `
      <div class="card__inner">
        <div class="card__face card__face--front">
          <div class="card__avatar">${p.photo ? `<img src="${esc(p.photo)}" alt="" loading="lazy">` : esc(p.emoji || squadEmojis[i % squadEmojis.length])}</div>
          <div class="card__name">${esc(p.name)}</div>
          <div class="card__role">${esc(role)}</div>
        </div>
        <div class="card__face card__face--back">
          <div class="hand">${esc(p.name)}</div>
          <div class="card__fact">${esc(p.fact || backLines[i % backLines.length])}</div>
        </div>
      </div>`;
    b.addEventListener("click", () => b.classList.toggle("is-flipped"));
    squadGrid.appendChild(b);
  });

  /* =========================================================
     ITINERARY
     ========================================================= */
  const tabs = $("#dayTabs"), panel = $("#dayPanel");
  const days = C.itinerary || [];
  function showDay(i, focus) {
    $$(".daytab", tabs).forEach((t, j) => { t.setAttribute("aria-selected", j === i); t.tabIndex = j === i ? 0 : -1; });
    const d = days[i];
    panel.setAttribute("aria-labelledby", "daytab-" + i);
    panel.innerHTML = `
      <div class="day__head"><span class="day__emoji">${esc(d.emoji)}</span><h3 class="day__title">${esc(d.title)}</h3></div>
      ${d.dress ? `<p class="day__dress">👗 Dress code: <b>${esc(d.dress)}</b></p>` : ""}
      <ol class="timeline">
        ${(d.items || []).map((it, k) => `
          <li class="stop" style="animation-delay:${k * 70}ms">
            <div class="stop__dot">${esc(it.emoji || "•")}</div>
            <div class="stop__body">
              ${it.time ? `<div class="stop__time">${esc(it.time)}</div>` : ""}
              <p class="stop__title">${esc(it.title)}</p>
              ${it.note ? `<p class="stop__note">${esc(it.note)}</p>` : ""}
              ${it.dress ? `<span class="tag">👗 ${esc(it.dress)}</span>` : ""}
              ${it.warn ? `<span class="tag tag--warn">⚠️ ${esc(it.warn)}</span>` : ""}
            </div>
          </li>`).join("")}
      </ol>`;
    if (focus) $$(".daytab", tabs)[i].focus();
  }
  days.forEach((d, i) => {
    const t = document.createElement("button");
    t.type = "button"; t.className = "daytab"; t.id = "daytab-" + i; t.setAttribute("role", "tab");
    t.innerHTML = `${esc(d.emoji)} ${esc(d.day)}<small>${esc(d.date)}</small>`;
    t.addEventListener("click", () => showDay(i));
    t.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") showDay((i + 1) % days.length, true);
      if (e.key === "ArrowLeft") showDay((i - 1 + days.length) % days.length, true);
    });
    tabs.appendChild(t);
  });
  if (days.length) showDay(0);

  /* =========================================================
     MAP pins
     ========================================================= */
  const NS = "http://www.w3.org/2000/svg";
  const pinsG = $("#pins"), card = $("#mapCard");
  (C.spots || []).forEach((s, i) => {
    const outer = document.createElementNS(NS, "g");
    outer.setAttribute("transform", `translate(${s.x} ${s.y})`);
    const pin = document.createElementNS(NS, "g");
    pin.setAttribute("class", "pin");
    pin.setAttribute("tabindex", "0");
    pin.setAttribute("role", "button");
    pin.setAttribute("aria-label", s.name);
    pin.innerHTML = `
      <circle class="pin__hit" r="22"></circle>
      <circle class="pin__pulse" r="15"></circle>
      <circle class="pin__bg" r="15"></circle>
      <text text-anchor="middle" dominant-baseline="central" y="1">${esc(s.emoji)}</text>`;
    const select = () => {
      $$(".pin", pinsG).forEach((p) => p.classList.remove("is-active"));
      pin.classList.add("is-active");
      card.innerHTML = `<p class="map__cardTitle">${esc(s.emoji)} ${esc(s.name)}</p><p class="map__cardBody">${esc(s.blurb)}</p>${s.maps ? `<a href="${esc(s.maps)}" target="_blank" rel="noopener">Open in Google Maps ↗</a>` : ""}`;
      card.classList.remove("pop"); void card.offsetWidth; card.classList.add("pop");
    };
    pin.addEventListener("click", select);
    pin.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(); } });
    outer.appendChild(pin); pinsG.appendChild(outer);
  });

  /* =========================================================
     FAQ
     ========================================================= */
  $("#faq").innerHTML = (C.info || []).map((f) => `
    <details class="reveal">
      <summary><span class="ic">${esc(f.icon)}</span>${esc(f.q)}</summary>
      <p>${esc(f.a)}</p>
    </details>`).join("");

  /* =========================================================
     PACKING (saved locally)
     ========================================================= */
  const PACK_KEY = "fayoum-bach-pack";
  const packed = store.get(PACK_KEY, {});
  const packList = $("#packList");
  let totalItems = 0;
  (C.packing || []).forEach((grp, gi) => {
    const div = document.createElement("div");
    div.className = "pack__group reveal";
    div.innerHTML = `<h3>${esc(grp.group)}</h3>` + grp.items.map((it, ii) => {
      totalItems++;
      const id = `p-${gi}-${ii}`;
      return `<label class="check"><input type="checkbox" data-k="${esc(grp.group + "::" + it)}" id="${id}" ${packed[grp.group + "::" + it] ? "checked" : ""}><span class="box"></span><span>${esc(it)}</span></label>`;
    }).join("");
    packList.appendChild(div);
  });
  let wasComplete = null;
  function updatePack(fromUser) {
    const n = $$("input[type=checkbox]", packList).filter((b) => b.checked).length;
    const complete = n === totalItems && totalItems > 0;
    $("#potFill").style.height = (totalItems ? (n / totalItems) * 100 : 0) + "%";
    $(".pack__progress p").innerHTML = `<b>${n}</b> / ${totalItems} ${complete ? "— packed & ready, habibti! 🎉" : "packed"}`;
    if (fromUser && complete && !wasComplete) confetti.burst(innerWidth / 2, innerHeight * .6, 140);
    wasComplete = complete;
  }
  packList.addEventListener("change", (e) => {
    const k = e.target.dataset.k; if (!k) return;
    if (e.target.checked) packed[k] = true; else delete packed[k];
    store.set(PACK_KEY, packed);
    updatePack(true);
  });
  updatePack(false);

  /* =========================================================
     Reveal on scroll + active dock item
     ========================================================= */
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((ents) => ents.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .15 });
    $$(".reveal").forEach((el) => io.observe(el));

    const links = $$(".dock a");
    const so = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle("is-here", a.getAttribute("href") === "#" + en.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    $$("header[id], section[id]").forEach((s) => so.observe(s));
  } else {
    $$(".reveal").forEach((el) => el.classList.add("in"));
  }

  /* ---------- boot: show the gate, or skip it for returning friends ---------- */
  if (store.get(SEEN_KEY, false)) {
    openSite(true);
  } else {
    document.body.classList.add("locked");
    initSand();
  }
})();
