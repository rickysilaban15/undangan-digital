/* =================================================================
   WEDDING INVITATION — script.js
   Clean & reusable. Edit the CONFIG object below for each client.
   ================================================================= */

/* ---------- 1. CONFIG (the only part you usually edit) ---------- */
const CONFIG = {
  couple: {
    // Nama panggilan (dipakai untuk nama besar di cover, hero, footer)
    groom: "Wawan",
    bride: "Santi",
    // Monogram di hero & gorden
    monogram: "W & S",

    // Nama lengkap + orang tua (ditampilkan di bagian "Mempelai")
    groomFull: "Wawan Roy Agtus Sitinjak",
    groomParents: "Putra dari Bapak Mangatur Sitinjak<br />&amp; Ibu Martinal Nainggolan",
    brideFull: "Rosanti Marbun",
    brideParents: "Putri dari Bapak Perius Buaton<br />&amp; Ibu Mesri Samosir",
  },

  // Tanggal yang ditampilkan (teks bebas)
  displayDate: "Senin, 13 Juli 2026",

  // Baris singkat di bawah nama pada cover
  coverVenue: "07.00 WIB  |  Gereja Katolik St. Paulus, Huta Manggis",

  // Tanggal/waktu ISO untuk countdown (waktu lokal)
  // Format: "YYYY-MM-DDTHH:mm:ss"
  targetDate: "2026-07-13T07:00:00",

  ceremony: {
    date: "Senin, 13 Juli 2026",
    time: "07.00 WIB – selesai",
    placeLines: [
      "Gereja Katolik Stasi Santo Paulus, Huta Manggis",
      "Kampung Manggis, Tebing Syahbandar, Sumatra Utara",
    ],
    // URL ini cocok dengan titik pada peta embed di bawah (koordinat gereja).
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=3.356025351845643%2C99.27265707520176",
  },

  // Tautan formulir kehadiran (Google Form). Tombol RSVP akan membuka ini.
  rsvpUrl: "https://docs.google.com/forms/d/e/1FAIpQLSfZKZj7tfiwTCHLDEAuBYsfa8RA2pfngG33cIZmBtni3DEjJA/viewform?usp=sharing&ouid=117546022810231307022",

  defaultGuest: "Bapak / Ibu / Saudara/i",

  /* ---- HADIAH / AMPLOP DIGITAL ----
     Ganti nomor rekening & nomor WhatsApp di bawah dengan data asli.
     - number  : nomor rekening (boleh pakai spasi, akan dirapikan otomatis)
     - holder  : nama pemilik rekening
     - variant : "bca" | "mandiri" (untuk warna kartu)
     whatsapp.number : format internasional tanpa "+" (mis. 62812xxxx)        */
  gift: {
    note:
      "Doa restu Anda merupakan hadiah terindah bagi kami. Namun bila berkenan " +
      "memberikan tanda kasih, dapat melalui rekening berikut.",
    cards: [
      { bank: "BCA", variant: "bca", number: "1234567890", holder: "Wawan Roy Agtus Sitinjak" },
      { bank: "Mandiri", variant: "mandiri", number: "0987654321", holder: "Rosanti Marbun" },
    ],
    whatsapp: {
      number: "6282112814139",
      message: "Halo, saya ingin mengirim konfirmasi bukti transfer hadiah untuk pernikahan Wawan & Santi 🙏",
    },
  },

  /* ---- UCAPAN LIVE (Firebase Firestore) ----
     Cara mengaktifkan agar ucapan tampil real-time & dilihat semua tamu:
     1) Buat project di https://console.firebase.google.com
     2) Aktifkan "Firestore Database" (mode production / test)
     3) Buka Project Settings → Your apps → Web app → salin konfigurasinya
     4) Tempelkan nilai-nilai di bawah ini.
     Jika dibiarkan kosong, ucapan disimpan sementara di perangkat ini saja
     (localStorage) sebagai mode demo — tidak tersinkron antar tamu.        */
  firebase: {
    apiKey: "AIzaSyD1JrqR7Q0yNSTjPsV37DS0a2nuStyntlY",
    authDomain: "undangan-digital-87787.firebaseapp.com",
    projectId: "undangan-digital-87787",
    storageBucket: "undangan-digital-87787.firebasestorage.app",
    messagingSenderId: "407143897224",
    appId: "1:407143897224:web:bbfce0abaec8b76648e73d",
  },
};

/* ---------- 2. SMALL DOM HELPERS -------------------------------- */
const $ = (sel) => document.querySelector(sel);
const setText = (id, text) => { const el = document.getElementById(id); if (el) el.textContent = text; };
const setHtml = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
const setAttr = (id, attr, val) => { const el = document.getElementById(id); if (el) el.setAttribute(attr, val); };

/* ---------- 3. POPULATE CONTENT FROM CONFIG --------------------- */
function applyConfig() {
  const { couple } = CONFIG;

  ["cover-groom", "hero-groom", "footer-groom", "curtain-groom"].forEach((id) => setText(id, couple.groomFull));
  ["cover-bride", "hero-bride", "footer-bride", "curtain-bride"].forEach((id) => setText(id, couple.brideFull));

  document.title = `${couple.groom} & ${couple.bride} — The Wedding Of`;

  // Couple full names + parents
  setText("groom-full", couple.groomFull);
  setHtml("groom-parents", couple.groomParents);
  setText("bride-full", couple.brideFull);
  setHtml("bride-parents", couple.brideParents);

  // Cover + hero dates
  setText("cover-date", CONFIG.displayDate);
  setText("cover-venue", CONFIG.coverVenue);
  setText("hero-date", CONFIG.displayDate);

  // Ceremony
  setText("ceremony-date", CONFIG.ceremony.date);
  setHtml("ceremony-time", CONFIG.ceremony.time);
  setHtml("ceremony-place", CONFIG.ceremony.placeLines.join("<br />"));
  setAttr("ceremony-map", "href", CONFIG.ceremony.mapsUrl);

  // RSVP
  setAttr("rsvp-link", "href", CONFIG.rsvpUrl);
}

/* ---------- 4. GUEST NAME FROM URL (?to=Nama%20Tamu) ------------ */
function applyGuestName() {
  const params = new URLSearchParams(window.location.search);
  const raw = params.get("to");
  const guest = raw ? decodeURIComponent(raw.replace(/\+/g, " ")).trim() : "";
  setText("guest-name", guest || CONFIG.defaultGuest);
}

/* ---------- 5. SMOOTH SCROLL ----------------------------------- */
/* Smooth scroll native browser (CSS scroll-behavior). Paling ringan. */

/* ---------- 6. REVEAL ON SCROLL (IntersectionObserver) ---------- */
/* Animasi berulang: muncul saat masuk layar, reset saat keluar layar,
   sehingga animasi jalan lagi tiap kali di-scroll ulang.            */
let revealObserver = null;
function initReveal() {
  const items = document.querySelectorAll("[data-aos]");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const el = entry.target;
        if (entry.isIntersecting) {
          const delay = parseInt(el.getAttribute("data-aos-delay") || "0", 10);
          el.style.transitionDelay = delay ? `${delay}ms` : "";
          el.classList.add("is-visible");
        } else {
          // hanya reset bila benar-benar keluar dari viewport (atas/bawah)
          el.style.transitionDelay = "";
          el.classList.remove("is-visible");
        }
      });
    },
    { threshold: 0, rootMargin: "0px 0px -12% 0px" }
  );
  items.forEach((el) => revealObserver.observe(el));
}

/* Daftarkan elemen [data-aos] yang dibuat dinamis agar ikut dianimasikan */
function observeReveal(scope) {
  const els = (scope || document).querySelectorAll("[data-aos]");
  if (revealObserver) {
    els.forEach((el) => revealObserver.observe(el));
  } else {
    els.forEach((el) => el.classList.add("is-visible"));
  }
}

/* Cek elemen yang sudah terlihat di layar (dipanggil setelah cover dibuka) */
function refreshReveal() {
  document.querySelectorAll("[data-aos]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.top < window.innerHeight * 0.9 && r.bottom > 0) el.classList.add("is-visible");
  });
}

/* ---------- 7. SWIPER GALLERY ----------------------------------- */
function initSwiper() {
  if (typeof Swiper === "undefined") return;
  new Swiper(".gallery__swiper", {
    loop: true,
    autoplay: { delay: 3500, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
    navigation: { nextEl: ".swiper-button-next", prevEl: ".swiper-button-prev" },
  });
}

/* ---------- 8. COUNTDOWN TIMER ---------------------------------- */
function initCountdown() {
  const target = new Date(CONFIG.targetDate).getTime();
  if (Number.isNaN(target)) return;
  const pad = (n) => String(n).padStart(2, "0");

  function tick() {
    let diff = target - Date.now();
    if (diff < 0) diff = 0;
    setText("cd-days", pad(Math.floor(diff / 86400000)));
    setText("cd-hours", pad(Math.floor((diff % 86400000) / 3600000)));
    setText("cd-minutes", pad(Math.floor((diff % 3600000) / 60000)));
    setText("cd-seconds", pad(Math.floor((diff % 60000) / 1000)));
  }
  tick();
  setInterval(tick, 1000);
}

/* ---------- 9. BACKGROUND MUSIC (local audio file) ------------- */
const music = {
  audio: null,
  btn: null,

  init() {
    this.audio = $("#bg-music");
    this.btn = $("#music-toggle");
    if (!this.audio || !this.btn) return;
    this.btn.addEventListener("click", () => this.toggle());
  },

  play() {
    if (!this.audio) return;
    const p = this.audio.play();
    if (p && p.then) {
      p.then(() => this.btn.classList.add("is-playing"))
        .catch(() => { /* diblokir browser -> tamu bisa tekan tombol */ });
    } else {
      this.btn.classList.add("is-playing");
    }
  },

  pause() {
    if (this.audio) this.audio.pause();
    this.btn.classList.remove("is-playing");
  },

  toggle() {
    if (!this.audio) return;
    if (this.audio.paused) this.play();
    else this.pause();
  },
};

/* ---------- 10. COVER + CURTAIN REVEAL + GSAP ------------------- */
function initOpening() {
  const cover = $("#opening");
  const openBtn = $("#open-invitation");
  const curtain = $("#curtain");

  document.body.classList.add("is-locked");

  // Cover entrance animation (ringan)
  if (typeof gsap !== "undefined") {
    gsap.from('[data-cover="text"]', {
      y: 24, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power2.out", delay: 0.2,
    });
  }

  if (!openBtn) return;

  openBtn.addEventListener("click", () => {
    music.play();
    revealWithCurtain(cover, curtain);
  });
}

function revealWithCurtain(cover, curtain) {
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    document.body.classList.remove("is-locked");
    window.scrollTo(0, 0);
    if (cover) cover.style.display = "none";
    if (curtain) { curtain.style.visibility = "hidden"; curtain.style.pointerEvents = "none"; }
    refreshReveal();   // tampilkan elemen yang sudah di viewport
    animateHero();
  };

  if (typeof gsap === "undefined" || !curtain) {
    if (cover) cover.style.opacity = "0";
    setTimeout(finish, 300);
    return;
  }

  const left = curtain.querySelector(".curtain__panel--left");
  const right = curtain.querySelector(".curtain__panel--right");
  const crest = curtain.querySelector(".curtain__crest");
  curtain.style.visibility = "visible";

  // Posisi awal: panel menutup penuh layar, monogram tersembunyi
  gsap.set([left, right], { xPercent: 0 });
  gsap.set(crest, { xPercent: -50, yPercent: -50, opacity: 0, scale: 0.8, rotate: -4 });

  // Total durasi ± 3 detik: tutup -> tahan (waktu baca) -> buka seperti jendela
  const tl = gsap.timeline({ onComplete: finish });

  tl
    // 1) Monogram muncul anggun saat tirai tertutup (0 - 0.6s)
    .to(crest, { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: "back.out(1.6)" }, 0)
    // Sembunyikan cover di balik tirai yang tertutup
    .call(() => { if (cover) cover.style.display = "none"; }, null, 0.1)
    // 2) Tahan lebih lama agar tamu sempat membaca nama (0.6 - 1.9s) lalu memudar
    .to(crest, { opacity: 0, scale: 0.92, duration: 0.5, ease: "power2.in" }, 1.9)
    // 3) Tirai membuka ke samping seperti jendela (1.9 - 3.0s)
    .to(left, { xPercent: -100, duration: 1.1, ease: "power3.inOut" }, 1.9)
    .to(right, { xPercent: 100, duration: 1.1, ease: "power3.inOut" }, 1.9);

  // Pengaman: apa pun yang terjadi, buka kunci scroll maksimal 3.4 detik
  setTimeout(finish, 3400);
}

/* Animate hero contents in sequence after the reveal (ringan) */
function animateHero() {
  if (typeof gsap === "undefined") return;
  const items = gsap.utils.toArray("[data-hero]");
  gsap.from(items, { y: 24, opacity: 0, duration: 0.6, stagger: 0.08, ease: "power2.out" });
}

/* ---------- 11. BOOT -------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  applyConfig();
  applyGuestName();
  initReveal();
  initSwiper();
  initCountdown();
  music.init();
  initOpening();
  initWishes();
  initGift();
});

/* ================================================================ */
/* 12. UCAPAN LIVE (Firebase Firestore + fallback localStorage)     */
/* ================================================================ */
const wishes = {
  db: null,
  mode: "local",            // "firebase" | "local"
  els: {},
  items: [],                // semua ucapan di memori
  shown: 0,                 // berapa yang sedang tampil
  PAGE: 5,                  // jumlah per "muat lebih banyak"

  init() {
    this.els = {
      form: $("#wish-form"),
      name: $("#wish-name"),
      attend: $("#wish-attend"),
      message: $("#wish-message"),
      submit: $("#wish-submit"),
      status: $("#wish-status"),
      list: $("#wish-items"),
      count: $("#wish-count"),
      more: $("#wish-more"),
    };
    if (!this.els.form) return;

    // Prefill nama dari ?to= bila ada
    const guest = document.getElementById("guest-name");
    if (guest && this.els.name && !this.els.name.value) {
      const g = guest.textContent.trim();
      if (g && g !== CONFIG.defaultGuest) this.els.name.value = g;
    }

    this.setupBackend();
    this.els.form.addEventListener("submit", (e) => this.onSubmit(e));
    if (this.els.more) {
      this.els.more.addEventListener("click", () => {
        this.shown += this.PAGE;
        this.paint();
      });
    }
  },

  setupBackend() {
    const cfg = CONFIG.firebase || {};
    const configured = cfg.apiKey && cfg.projectId && typeof firebase !== "undefined";
    if (configured) {
      try {
        if (!firebase.apps.length) firebase.initializeApp(cfg);
        this.db = firebase.firestore();
        this.mode = "firebase";
        this.listenFirebase();
        return;
      } catch (err) {
        console.warn("Firebase gagal diinisialisasi, beralih ke mode lokal.", err);
      }
    }
    this.mode = "local";
    this.renderLocal();
  },

  /* ---- Firestore: realtime ---- */
  listenFirebase() {
    this.db
      .collection("wishes")
      .orderBy("createdAt", "desc")
      .limit(200)
      .onSnapshot(
        (snap) => {
          const items = [];
          snap.forEach((doc) => {
            const d = doc.data();
            items.push({
              name: d.name,
              attend: d.attend,
              message: d.message,
              ts: d.createdAt ? d.createdAt.toMillis() : Date.now(),
            });
          });
          this.render(items);
        },
        (err) => {
          console.warn("Gagal memuat ucapan dari Firestore.", err);
          this.mode = "local";
          this.renderLocal();
        }
      );
  },

  async saveFirebase(entry) {
    await this.db.collection("wishes").add({
      name: entry.name,
      attend: entry.attend,
      message: entry.message,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
  },

  /* ---- localStorage fallback ---- */
  KEY: "wedding_wishes",
  readLocal() {
    try { return JSON.parse(localStorage.getItem(this.KEY)) || []; }
    catch { return []; }
  },
  saveLocal(entry) {
    const list = this.readLocal();
    list.unshift({ ...entry, ts: Date.now() });
    localStorage.setItem(this.KEY, JSON.stringify(list.slice(0, 200)));
  },
  renderLocal() { this.render(this.readLocal()); },

  /* ---- Submit ---- */
  async onSubmit(e) {
    e.preventDefault();
    const name = this.els.name.value.trim();
    const attend = this.els.attend.value;
    const message = this.els.message.value.trim();
    if (!name || !message) return;

    const entry = { name, attend, message };
    this.els.submit.disabled = true;
    this.setStatus("Mengirim...", "");

    try {
      if (this.mode === "firebase") {
        await this.saveFirebase(entry);
      } else {
        this.saveLocal(entry);
        this.renderLocal();
      }
      this.els.message.value = "";
      this.setStatus("Terima kasih, ucapan Anda telah terkirim 💛", "ok");
    } catch (err) {
      console.warn(err);
      this.setStatus("Maaf, ucapan gagal dikirim. Coba lagi.", "err");
    } finally {
      this.els.submit.disabled = false;
    }
  },

  setStatus(text, type) {
    if (!this.els.status) return;
    this.els.status.textContent = text;
    this.els.status.className = "wish-form__status" + (type ? " is-" + type : "");
    if (type === "ok") {
      setTimeout(() => { this.els.status.textContent = ""; this.els.status.className = "wish-form__status"; }, 4000);
    }
  },

  /* ---- Render daftar ucapan (dengan pagination) ---- */
  render(items) {
    this.items = items || [];
    // Pertahankan jumlah yang sudah tampil saat ada data baru masuk
    if (this.shown < this.PAGE) this.shown = this.PAGE;
    this.paint();
  },

  paint() {
    const list = this.els.list;
    if (!list) return;
    const items = this.items;

    if (!items.length) {
      list.innerHTML = '<li class="wishes__empty">Belum ada ucapan. Jadilah yang pertama mengirim doa & restu.</li>';
      if (this.els.count) this.els.count.textContent = "";
      if (this.els.more) this.els.more.hidden = true;
      return;
    }

    if (this.els.count) this.els.count.textContent = `${items.length} Ucapan`;

    const shown = Math.min(this.shown, items.length);
    list.innerHTML = items.slice(0, shown).map((it) => {
      return `
        <li class="wish">
          <div class="wish__head">
            <span class="wish__avatar" aria-hidden="true">${this.initial(it.name)}</span>
            <div>
              <p class="wish__name">${this.esc(it.name)}</p>
              <p class="wish__meta">
                <span class="wish__badge">${this.esc(it.attend || "Masih Ragu")}</span>
                <span class="wish__time">${this.timeAgo(it.ts)}</span>
              </p>
            </div>
          </div>
          <p class="wish__msg">${this.esc(it.message)}</p>
        </li>`;
    }).join("");

    if (this.els.more) {
      const remaining = items.length - shown;
      this.els.more.hidden = remaining <= 0;
      const label = this.els.more.querySelector("span");
      if (label && remaining > 0) label.textContent = `Muat lebih banyak (${remaining})`;
    }
  },

  initial(name) {
    const n = (name || "?").trim();
    return n ? n.charAt(0).toUpperCase() : "?";
  },

  esc(str) {
    return String(str == null ? "" : str)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  },

  timeAgo(ts) {
    if (!ts) return "";
    const s = Math.floor((Date.now() - ts) / 1000);
    if (s < 60) return "baru saja";
    const m = Math.floor(s / 60);
    if (m < 60) return `${m} menit lalu`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h} jam lalu`;
    const d = Math.floor(h / 24);
    if (d < 30) return `${d} hari lalu`;
    return new Date(ts).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
  },
};

function initWishes() {
  wishes.init();
}

/* ================================================================ */
/* 13. HADIAH / AMPLOP DIGITAL (kartu rekening + copy + WhatsApp)    */
/* ================================================================ */
function initGift() {
  const cfg = CONFIG.gift;
  const wrap = document.getElementById("gift-cards");
  if (!cfg || !wrap) return;

  // Catatan
  setText("gift-note", cfg.note || "");

  // Render kartu
  wrap.innerHTML = (cfg.cards || []).map((c, i) => {
    const num = String(c.number || "").replace(/\s+/g, "");
    const grouped = num.replace(/(.{4})/g, "$1 ").trim();
    return `
      <article class="gcard gcard--${c.variant || "bca"}" data-aos="fade-up" data-aos-delay="${i * 120}">
        <span class="gcard__guilloche" aria-hidden="true"></span>
        <span class="gcard__sheen" aria-hidden="true"></span>

        <div class="gcard__top">
          <span class="gcard__bank">${escHtml(c.bank || "")}</span>
          <svg class="gcard__wave" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M8.5 7a7 7 0 0 1 0 10M12 4.5a11 11 0 0 1 0 15M5 9.2a3.5 3.5 0 0 1 0 5.6"
              fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>
          </svg>
        </div>

        <span class="gcard__chip" aria-hidden="true">
          <i></i><i></i><i></i>
        </span>

        <button type="button" class="gcard__number" data-copy="${escHtml(num)}" title="Klik untuk menyalin nomor rekening">
          <span class="gcard__digits">${escHtml(grouped)}</span>
          <span class="gcard__copy">
            <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
              <rect x="9" y="9" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/>
              <rect x="4" y="4" width="11" height="11" rx="2" fill="none" stroke="currentColor" stroke-width="1.7"/>
            </svg>
            <em>Salin</em>
          </span>
        </button>

        <div class="gcard__bottom">
          <div class="gcard__holderwrap">
            <small class="gcard__label">Pemilik Rekening</small>
            <p class="gcard__holder">${escHtml(c.holder || "")}</p>
          </div>
          <span class="gcard__logo">${escHtml(c.bank || "")}</span>
        </div>
      </article>`;
  }).join("");

  // Tombol copy
  wrap.querySelectorAll("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", () => copyText(btn.getAttribute("data-copy"), btn));
  });

  // Daftarkan kartu (dibuat dinamis) ke animasi reveal
  observeReveal(wrap);

  // WhatsApp konfirmasi
  const wa = cfg.whatsapp || {};
  const waEl = document.getElementById("gift-wa");
  if (waEl && wa.number) {
    const num = String(wa.number).replace(/[^\d]/g, "");
    const msg = encodeURIComponent(wa.message || "");
    waEl.setAttribute("href", `https://wa.me/${num}?text=${msg}`);
  } else if (waEl) {
    waEl.closest(".gift__confirm")?.setAttribute("hidden", "");
  }
}

function copyText(text, btn) {
  const done = () => {
    if (!btn) return;
    btn.classList.add("is-copied");
    const label = btn.querySelector(".gcard__copy em") || btn.querySelector("span");
    const original = label ? label.textContent : "";
    if (label) label.textContent = "Tersalin";
    setTimeout(() => {
      btn.classList.remove("is-copied");
      if (label) label.textContent = original;
    }, 1600);
  };

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
  } else {
    fallbackCopy(text, done);
  }
}

function fallbackCopy(text, done) {
  const ta = document.createElement("textarea");
  ta.value = text;
  ta.style.position = "fixed";
  ta.style.opacity = "0";
  document.body.appendChild(ta);
  ta.select();
  try { document.execCommand("copy"); done(); } catch (e) { /* noop */ }
  document.body.removeChild(ta);
}

/* helper escape (dipakai initGift) */
function escHtml(str) {
  return String(str == null ? "" : str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
