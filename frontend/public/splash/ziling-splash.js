(function () {
  const DEFAULT_CYCLE = 5450;

  const template = `
    <div class="ziling-splash__field" aria-hidden="true"></div>
    <svg class="ziling-splash__motion" viewBox="0 0 680 680" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      <path class="trace back" data-start="0" data-end="1600" data-fade="3150" d="M 340 -30 V 90 H 294 V 168 H 312 V 226" />
      <path class="trace back" data-start="360" data-end="1900" data-fade="3220" d="M -30 344 H 96 V 304 H 204 V 324 H 248" />
      <path class="trace back" data-start="520" data-end="2060" data-fade="3260" d="M 710 332 H 588 V 296 H 480 V 324 H 432" />

      <path class="trace main" data-start="140" data-end="1780" data-fade="3000" d="M -24 132 H 78 Q 102 132 102 156 V 188 H 184 Q 212 188 212 216 V 252 H 258 Q 284 252 298 282" />
      <path class="trace main" data-start="300" data-end="1940" data-fade="3040" d="M 704 124 H 594 Q 570 124 570 148 V 186 H 494 Q 466 186 466 214 V 252 H 422 Q 396 252 382 282" />
      <path class="trace main" data-start="640" data-end="2240" data-fade="3100" d="M 72 704 V 552 Q 72 528 96 528 H 154 V 462 Q 154 438 178 438 H 244 V 404 H 286" />
      <path class="trace main" data-start="820" data-end="2420" data-fade="3120" d="M 612 704 V 558 Q 612 534 588 534 H 530 V 466 Q 530 442 506 442 H 440 V 404 H 394" />

      <path class="trace branch" data-start="760" data-end="1500" data-fade="3100" d="M 184 188 H 150 C 138 188 132 182 132 170 V 152 H 146" />
      <path class="trace branch" data-start="900" data-end="1640" data-fade="3140" d="M 494 186 H 528 C 540 186 546 180 546 168 V 148 H 534" />
      <path class="trace branch" data-start="1120" data-end="1900" data-fade="3240" d="M 154 462 H 126 C 114 462 108 468 108 480 V 516 H 150" />
      <path class="trace branch" data-start="1260" data-end="2040" data-fade="3280" d="M 530 466 H 558 C 570 466 576 472 576 484 V 520 H 530" />
      <path class="trace branch" data-start="860" data-end="1640" data-fade="3120" d="M 184 188 H 226 V 168 H 262" />
      <path class="trace branch" data-start="1000" data-end="1780" data-fade="3160" d="M 494 186 H 452 V 166 H 418" />
      <path class="trace branch" data-start="1200" data-end="2020" data-fade="3260" d="M 154 462 H 206 V 482 H 246" />
      <path class="trace branch" data-start="1340" data-end="2160" data-fade="3300" d="M 530 466 H 478 V 486 H 438" />

      <path class="injection" data-start="2140" data-end="3020" d="M 298 282 C 306 292 310 300 312 306" />
      <path class="injection" data-start="2220" data-end="3100" d="M 382 282 C 374 292 370 300 368 306" />
      <path class="injection" data-start="2360" data-end="3260" d="M 286 404 C 298 406 306 410 312 416" />
      <path class="injection" data-start="2440" data-end="3340" d="M 394 404 C 382 406 374 410 368 416" />
    </svg>

    <div class="ziling-splash__holo h1" data-start="820" data-end="3180" data-set="^_^|Q_Q|T_T|-_-|^o^|U_U" data-micro="=_=">
      <span class="main">^_^</span><span class="alt">Q_Q</span><span class="echo e1">T_T</span><span class="echo e2">-_-</span><span class="echo e3">^o^</span>
    </div>
    <div class="ziling-splash__holo h2" data-start="960" data-end="3260" data-set="(^_^)/|>_<|=_=|^.^|U_U|Q_Q" data-micro="^.^">
      <span class="main">(^_^)/</span><span class="alt">&gt;_&lt;</span><span class="echo e1">U_U</span><span class="echo e2">Q_Q</span><span class="echo e3">^.^</span>
    </div>
    <div class="ziling-splash__holo h3" data-start="1180" data-end="3380" data-set="^.^|T_T|Q_Q|U_U|-_-|=_=" data-micro="&gt;_&lt;">
      <span class="main">^.^</span><span class="alt">T_T</span><span class="echo e1">Q_Q</span><span class="echo e2">U_U</span><span class="echo e3">=_=</span>
    </div>
    <div class="ziling-splash__holo h4" data-start="1320" data-end="3460" data-set=">_<|^o^|-_-|Q_Q|=_=|^_^" data-micro="T_T">
      <span class="main">&gt;_&lt;</span><span class="alt">^o^</span><span class="echo e1">-_-</span><span class="echo e2">^_^</span><span class="echo e3">Q_Q</span>
    </div>

    <svg class="ziling-splash__logo" viewBox="0 0 1254 1254" aria-label="zicodo logo">
      <defs>
        <path id="ziling-eye-left" d="M 243 600 C 235 600 231 596 231 589 C 231 584 233 579 236 574 L 386 340 C 390 334 394 332 401 332 L 447 332 C 454 332 459 335 463 341 L 609 574 C 612 579 614 585 614 590 C 614 597 609 600 601 600 L 536 600 C 531 600 528 598 525 594 L 421 427 L 316 594 C 313 598 310 600 305 600 Z"/>
        <path id="ziling-eye-right-open" d="M 1011 600 C 1019 600 1023 596 1023 589 C 1023 584 1021 579 1018 574 L 868 340 C 864 334 860 332 853 332 L 807 332 C 800 332 795 335 791 341 L 645 574 C 642 579 640 585 640 590 C 640 597 645 600 653 600 L 718 600 C 723 600 726 598 729 594 L 833 427 L 938 594 C 941 598 944 600 949 600 Z"/>
        <path id="ziling-eye-right-blink" d="M 648 600 C 640 600 636 596 636 590 C 636 584 640 579 646 575 L 817 456 C 824 451 832 451 839 456 L 1010 575 C 1016 579 1020 584 1020 590 C 1020 596 1016 600 1008 600 L 941 600 C 936 600 932 598 928 595 L 829 526 L 731 595 C 727 598 723 600 718 600 Z"/>
        <path id="ziling-mouth-ring" d="M 627 637.5 A 154.5 154.5 0 1 1 627 946.5 A 154.5 154.5 0 1 1 627 637.5 M 627 711.5 A 80.5 80.5 0 1 0 627 872.5 A 80.5 80.5 0 1 0 627 711.5 Z"/>
        <clipPath id="ziling-logo-clip">
          <use href="#ziling-eye-left"/>
          <use href="#ziling-eye-left" transform="translate(1254 0) scale(-1 1)"/>
          <use href="#ziling-mouth-ring"/>
        </clipPath>
      </defs>
      <g class="logo-shell" fill-rule="evenodd" shape-rendering="geometricPrecision">
        <use href="#ziling-eye-left"/>
        <use href="#ziling-eye-left" transform="translate(1254 0) scale(-1 1)"/>
        <use href="#ziling-mouth-ring"/>
      </g>
      <g class="logo-fill" shape-rendering="geometricPrecision">
        <rect class="logo-fill-rect" x="180" y="980" width="900" height="0"/>
      </g>
      <g class="logo-complete" fill-rule="evenodd" shape-rendering="geometricPrecision">
        <use href="#ziling-eye-left"/>
        <use class="normal-right-eye" href="#ziling-eye-right-open"/>
        <use href="#ziling-mouth-ring"/>
      </g>
      <use class="logo-blink-eye" href="#ziling-eye-right-blink" fill-rule="evenodd" shape-rendering="geometricPrecision"/>
    </svg>
  `;

  function clamp01(value) {
    return Math.max(0, Math.min(1, value));
  }

  function easeOutCubic(value) {
    return 1 - Math.pow(1 - value, 3);
  }

  function smoothstep(edge0, edge1, value) {
    const p = clamp01((value - edge0) / (edge1 - edge0));
    return p * p * (3 - 2 * p);
  }

  function mount(target, options) {
    const settings = Object.assign({
      cycle: DEFAULT_CYCLE,
      loop: target.dataset.loop === "true",
      autoHide: target.dataset.autoHide === "true"
    }, options || {});

    target.classList.add("ziling-splash");
    target.setAttribute("role", target.getAttribute("role") || "img");
    target.setAttribute("aria-label", target.getAttribute("aria-label") || "zicodo opening splash animation");
    target.innerHTML = template;

    const traces = Array.from(target.querySelectorAll(".trace, .injection")).map((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
      return {
        path,
        length,
        start: Number(path.dataset.start),
        end: Number(path.dataset.end),
        fade: Number(path.dataset.fade || 3500),
        isInjection: path.classList.contains("injection")
      };
    });

    const holos = Array.from(target.querySelectorAll(".ziling-splash__holo")).map((el) => ({
      el,
      main: el.querySelector(".main"),
      alt: el.querySelector(".alt"),
      echoes: Array.from(el.querySelectorAll(".echo")),
      set: el.dataset.set.split("|"),
      start: Number(el.dataset.start),
      end: Number(el.dataset.end),
      active: false,
      lastIndex: -1
    }));

    const fillRect = target.querySelector(".logo-fill-rect");
    const logoFill = target.querySelector(".logo-fill");
    const logoComplete = target.querySelector(".logo-complete");
    const normalRightEye = target.querySelector(".normal-right-eye");
    const blinkRightEye = target.querySelector(".logo-blink-eye");

    let timelineStart = null;
    let rafId = 0;
    let finished = false;

    function render(t) {
      traces.forEach(({ path, length, start, end, fade, isInjection }) => {
        const draw = easeOutCubic(clamp01((t - start) / (end - start)));
        const erase = easeOutCubic(clamp01((t - fade) / (isInjection ? 780 : 980)));
        const base = isInjection ? 0.95 : 1;
        const opacity = draw <= 0 ? 0 : Math.max(0, base * (1 - clamp01((erase - 0.86) / 0.14)));
        path.style.strokeDashoffset = t < fade ? length * (1 - draw) : -length * erase;
        path.style.opacity = opacity.toFixed(3);
      });

      holos.forEach((holo) => {
        const visible = t >= holo.start && t <= holo.end;
        const grow = easeOutCubic(clamp01((t - holo.start) / 860));
        if (visible && !holo.active) {
          holo.el.classList.remove("is-out");
          holo.el.classList.add("is-active");
          holo.active = true;
        } else if (!visible && holo.active) {
          holo.el.classList.remove("is-active");
          holo.el.classList.add("is-out");
          holo.active = false;
          holo.lastIndex = -1;
        }

        holo.main.style.opacity = visible ? String(Math.min(0.9, grow * 1.15)) : "";
        holo.alt.style.opacity = visible ? String(Math.max(0, Math.min(0.48, (grow - 0.24) * 0.9))) : "";
        holo.echoes.forEach((echo, index) => {
          const threshold = 0.42 + index * 0.16;
          echo.style.visibility = visible && grow > threshold ? "visible" : "hidden";
        });

        if (visible) {
          const index = Math.floor((t - holo.start) / 105) % holo.set.length;
          if (index !== holo.lastIndex) {
            holo.main.textContent = holo.set[index];
            holo.alt.textContent = holo.set[(index + 2) % holo.set.length];
            holo.echoes.forEach((echo, echoIndex) => {
              echo.textContent = holo.set[(index + 3 + echoIndex) % holo.set.length];
            });
            holo.lastIndex = index;
          }
        }
      });

      const fillP = easeOutCubic(clamp01((t - 2140) / 1280));
      const fillFade = smoothstep(3560, 3820, t);
      const fillHeight = 720 * fillP;
      fillRect.setAttribute("y", String(980 - fillHeight));
      fillRect.setAttribute("height", String(fillHeight));
      logoFill.style.opacity = String(Math.max(0, Math.min(0.98, fillP) * (1 - fillFade)));

      const completeIn = smoothstep(3280, 3560, t);
      const finalOut = 1 - smoothstep(5150, settings.cycle, t);
      const completeOpacity = completeIn * finalOut;

      const blinkOpacity = smoothstep(4320, 4380, t) * (1 - smoothstep(4450, 4590, t));
      const openEyeOpacity = Math.pow(1 - blinkOpacity, 3);
      const closedEyeOpacity = Math.pow(blinkOpacity, 0.72);

      logoComplete.style.opacity = completeOpacity.toFixed(3);
      normalRightEye.style.opacity = openEyeOpacity.toFixed(3);
      blinkRightEye.style.opacity = (completeOpacity * closedEyeOpacity).toFixed(3);
    }

    function finish() {
      if (finished) return;
      finished = true;
      target.classList.add("is-finished");
      target.dispatchEvent(new CustomEvent("zilingSplashFinished", {
        bubbles: true,
        detail: { duration: settings.cycle }
      }));
      if (settings.autoHide) {
        target.hidden = true;
      }
    }

    function frame(now) {
      if (timelineStart === null) timelineStart = now;
      const elapsed = now - timelineStart;
      const t = settings.loop ? elapsed % settings.cycle : Math.min(elapsed, settings.cycle);
      render(t);

      if (!settings.loop && elapsed >= settings.cycle) {
        finish();
        return;
      }

      rafId = window.requestAnimationFrame(frame);
    }

    rafId = window.requestAnimationFrame(frame);

    return {
      destroy() {
        window.cancelAnimationFrame(rafId);
        target.innerHTML = "";
      },
      replay() {
        window.cancelAnimationFrame(rafId);
        timelineStart = null;
        finished = false;
        target.hidden = false;
        target.classList.remove("is-finished");
        rafId = window.requestAnimationFrame(frame);
      }
    };
  }

  window.ZiLingSplash = { mount };

  function autoMount() {
    document.querySelectorAll("[data-ziling-splash]").forEach((el) => {
      if (!el.__zilingSplash) {
        el.__zilingSplash = mount(el);
      }
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", autoMount, { once: true });
  } else {
    autoMount();
  }
})();
