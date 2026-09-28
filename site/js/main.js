const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];

const menuBtn = $(".menu-btn");
const overlay = $("#overlay");
const closeBtn = $(".overlay-close");
function toggleMenu(open) {
  overlay?.classList.toggle("open", open);
  document.body.classList.toggle("menu-open", open);
}
menuBtn?.addEventListener("click", () => toggleMenu(true));
closeBtn?.addEventListener("click", () => toggleMenu(false));
overlay?.addEventListener("click", (e) => {
  if (e.target === overlay) toggleMenu(false);
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    toggleMenu(false);
    $("#lightbox")?.classList.remove("open");
  }
});

const lightbox = $("#lightbox");
const lightboxImg = $("#lightbox img");
$$("[data-zoom]").forEach((el) => {
  el.addEventListener("click", () => {
    const src = el.dataset.zoom || el.querySelector("img")?.src;
    if (!src) return;
    lightboxImg.src = src;
    lightbox.classList.add("open");
  });
});
lightbox?.addEventListener("click", () => lightbox.classList.remove("open"));

$$(".flow-step").forEach((btn) => {
  btn.addEventListener("click", () => {
    const wrap = btn.closest(".flow")?.parentElement || document;
    $$(".flow-step", wrap).forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    const panel = wrap.querySelector(`#${btn.dataset.target}`) || document.getElementById(btn.dataset.target);
    if (panel) {
      $$(".flow-detail", wrap).forEach((p) => { p.hidden = true; });
      panel.hidden = false;
    }
  });
});

const io = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.querySelectorAll(".bar i[data-w]").forEach((bar) => {
      bar.style.width = bar.dataset.w;
    });
  });
}, { threshold: 0.35 });
$$("[data-bars]").forEach((el) => io.observe(el));

const sections = $$("[data-section]");
const subLinks = $$(".subnav a");
$$("[data-tabs]").forEach((root) => {
  const nav = root.querySelector(":scope > .seg-nav");
  if (!nav) return;
  const btns = [...nav.querySelectorAll("[data-tab]")];
  const panes = [...root.querySelectorAll(":scope > [data-pane]")];
  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.toggle("is-active", b === btn));
      panes.forEach((p) => {
        p.hidden = p.dataset.pane !== btn.dataset.tab;
        if (p.hidden) return;
        p.querySelectorAll(".bar i[data-w]").forEach((bar) => {
          bar.style.width = bar.dataset.w;
        });
      });
    });
  });
});

if (sections.length && subLinks.length) {
  const sio = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      const id = e.target.id;
      subLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
    });
  }, { rootMargin: "-40% 0px -50% 0px" });
  sections.forEach((s) => sio.observe(s));
}

$$("h1").forEach((h) => {
  if (h.classList.contains("opener-title") || h.closest("[data-opener]")) return;
  if (h.querySelector(".ch")) return;
  h.innerHTML = h.innerHTML.replace(/(<br\s*\/?>)|([^<\n])/gi, (m, br, ch) => {
    if (br) return br;
    if (ch === " ") return " ";
    return `<span class="ch">${ch}</span>`;
  });
  [...h.querySelectorAll(".ch")].forEach((el, i) => {
    el.style.animationDelay = `${i * 0.035}s`;
  });
});

$$(".stat .value").forEach((el, i) => {
  el.style.opacity = "0";
  el.style.transform = "translateY(10px)";
  el.style.transition = "opacity .7s cubic-bezier(0.22,1,0.36,1), transform .7s cubic-bezier(0.22,1,0.36,1)";
  el.dataset.stagger = String(i);
});

const rio = new IntersectionObserver((entries) => {
  entries.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add("in");
    if (e.target.classList.contains("stat")) {
      const v = e.target.querySelector(".value");
      if (v) {
        const delay = Number(v.dataset.stagger || 0) % 4 * 80;
        setTimeout(() => {
          v.style.opacity = "1";
          v.style.transform = "translateY(0)";
        }, delay);
      }
    }
    rio.unobserve(e.target);
  });
}, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

$$("h2, h3, .stat, .work-item, .card, .map-card, .orig-flow, .shot, .problem, .action-board, .quote").forEach((el) => {
  if (el.closest("[data-opener]")) return;
  rio.observe(el);
});

(function setupOpener() {
  const opener = document.querySelector("[data-opener]");
  if (!opener) return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const title = opener.querySelector("[data-opener-title]");
  const ghost = opener.querySelector("[data-opener-ghost]");
  const kicker = opener.querySelector("[data-opener-kicker]");
  const sub = opener.querySelector("[data-opener-sub]");
  const body = opener.querySelector("[data-opener-body]");
  const meta = opener.querySelector("[data-opener-meta]");
  const line = opener.querySelector("[data-opener-line]");
  const lineBits = line ? [...line.children] : [];
  let cur = 0;
  let raf = 0;

  function paint(p) {
    const scale = 1 + p * 1.85;
    if (title) title.style.transform = `translate3d(${-p * 14}vw, ${-p * 28}vh, 0) scale(${scale})`;
    if (ghost) ghost.style.transform = `translate3d(${p * 6}vw, ${-p * 10}vh, 0) scale(${1 + p * 2.35})`;
    if (kicker) kicker.style.transform = `translate3d(${-p * 36}vw, ${-p * 22}vh, 0)`;
    if (sub) sub.style.transform = `translate3d(${p * 10}vw, ${-p * 8}vh, 0)`;
    if (body) body.style.transform = `translate3d(${-p * 8}vw, ${p * 14}vh, 0)`;
    if (meta) meta.style.transform = `translate3d(${p * 4}vw, ${p * 22}vh, 0)`;
    if (line) line.style.transform = `translate3d(${-p * 6}vw, ${p * 8}vh, 0)`;
    lineBits.forEach((bit, i) => {
      const dir = i === 1 ? 1 : -1;
      bit.style.transform = `translate3d(${dir * p * (16 + i * 10)}vw, ${(i - 1) * p * 12}vh, 0) scale(${1 + p * (0.35 + i * 0.2)})`;
    });
  }

  function loop() {
    raf = 0;
    const total = Math.max(1, opener.offsetHeight - window.innerHeight);
    const target = Math.min(1, Math.max(0, -opener.getBoundingClientRect().top / total));
    cur += (target - cur) * 0.075;
    paint(cur);
    if (Math.abs(target - cur) > 0.0005) raf = requestAnimationFrame(loop);
  }

  function kick() {
    if (!raf) raf = requestAnimationFrame(loop);
  }

  window.addEventListener("scroll", kick, { passive: true });
  window.addEventListener("resize", kick);
  paint(0);
})();
