// Create butterfly cursor (desktop only)
document.documentElement.classList.add("js-ready");

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const isLowEndDevice = (() => {
    const memory = Number(navigator.deviceMemory || 0);
    const cores = Number(navigator.hardwareConcurrency || 0);
    return (memory > 0 && memory <= 4) || (cores > 0 && cores <= 4);
})();

const cursor = document.querySelector(".cursor");
const sparkleContainer = document.querySelector(".sparkle-container");
const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (cursor && supportsFinePointer) {
    const cursorState = {
        currentX: window.innerWidth / 2,
        currentY: window.innerHeight / 2,
        targetX: window.innerWidth / 2,
        targetY: window.innerHeight / 2,
        frameId: 0,
        lastSparkleAt: 0,
        butterflyTimer: 0
    };

    const setCursorTransform = (x, y) => {
        cursor.style.transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) translate(-50%, -50%)`;
    };

    const renderCursor = () => {
        cursorState.currentX += (cursorState.targetX - cursorState.currentX) * 0.24;
        cursorState.currentY += (cursorState.targetY - cursorState.currentY) * 0.24;
        setCursorTransform(cursorState.currentX, cursorState.currentY);

        const done =
            Math.abs(cursorState.targetX - cursorState.currentX) < 0.2 &&
            Math.abs(cursorState.targetY - cursorState.currentY) < 0.2;

        if (done) {
            cursorState.frameId = 0;
            return;
        }

        cursorState.frameId = requestAnimationFrame(renderCursor);
    };

    const queueCursorFrame = () => {
        if (!cursorState.frameId) {
            cursorState.frameId = requestAnimationFrame(renderCursor);
        }
    };

    const spawnSparkle = (x, y) => {
        if (!sparkleContainer || prefersReducedMotion.matches) {
            return;
        }

        if (sparkleContainer.childElementCount >= (isLowEndDevice ? 10 : 18)) {
            sparkleContainer.firstElementChild?.remove();
        }

        const sparkle = document.createElement("div");
        sparkle.className = "sparkle";

        const size = (Math.random() * 7 + 9).toFixed(2);
        sparkle.style.width = `${size}px`;
        sparkle.style.height = `${size}px`;
        sparkle.style.left = `${x - Number(size) / 2}px`;
        sparkle.style.top = `${y - Number(size) / 2}px`;
        sparkle.style.animationDuration = `${(Math.random() * 220 + 620).toFixed(0)}ms`;
        sparkleContainer.appendChild(sparkle);

        sparkle.addEventListener("animationend", () => {
            sparkle.remove();
        }, { once: true });
    };

    const createFloatingButterfly = () => {
        if (prefersReducedMotion.matches || document.hidden) {
            return;
        }

        const floatButterfly = document.createElement("div");
        floatButterfly.innerHTML = "&#129419;";
        floatButterfly.style.position = "fixed";
        floatButterfly.style.left = `${Math.random() * window.innerWidth}px`;
        floatButterfly.style.bottom = "-30px";
        floatButterfly.style.fontSize = `${isLowEndDevice ? 16 : 20}px`;
        floatButterfly.style.opacity = isLowEndDevice ? "0.38" : "0.56";
        floatButterfly.style.pointerEvents = "none";
        floatButterfly.style.zIndex = "9997";
        floatButterfly.style.willChange = "transform, opacity";
        floatButterfly.style.animation = `floatUp ${isLowEndDevice ? 10 : 8}s linear forwards`;
        document.body.appendChild(floatButterfly);

        floatButterfly.addEventListener("animationend", () => {
            floatButterfly.remove();
        }, { once: true });
    };

    const scheduleFloatingButterfly = () => {
        window.clearTimeout(cursorState.butterflyTimer);

        if (prefersReducedMotion.matches) {
            return;
        }

        cursorState.butterflyTimer = window.setTimeout(() => {
            createFloatingButterfly();
            scheduleFloatingButterfly();
        }, isLowEndDevice ? 5200 : 3400);
    };

    setCursorTransform(cursorState.currentX, cursorState.currentY);

    window.addEventListener("pointermove", (event) => {
        cursorState.targetX = event.clientX;
        cursorState.targetY = event.clientY;
        queueCursorFrame();

        if (event.timeStamp - cursorState.lastSparkleAt > (isLowEndDevice ? 95 : 60)) {
            spawnSparkle(event.clientX, event.clientY);
            cursorState.lastSparkleAt = event.timeStamp;
        }
    }, { passive: true });

    window.addEventListener("pointerdown", () => {
        cursor.classList.add("is-pressed");
    }, { passive: true });

    window.addEventListener("pointerup", () => {
        cursor.classList.remove("is-pressed");
    }, { passive: true });

    window.addEventListener("blur", () => {
        cursor.classList.remove("is-pressed");
    });

    document.addEventListener("visibilitychange", () => {
        if (document.hidden) {
            window.clearTimeout(cursorState.butterflyTimer);
            return;
        }

        scheduleFloatingButterfly();
    });

    scheduleFloatingButterfly();
}

// Add float animation dynamically
const style = document.createElement("style");
style.innerHTML = `
@keyframes floatUp {
    from { transform: translateY(0); }
    to { transform: translateY(-110vh); }
}`;
document.head.appendChild(style);

// Main website header navigation toggle
const homeHeader = document.querySelector(".home-header");
const homeNavToggle = document.querySelector(".home-nav-toggle");
const homeNavLinks = document.querySelectorAll(".home-nav a");
const isHomePage = document.body.classList.contains("home-page");

if (homeHeader && homeNavToggle) {
    const closeNav = () => {
        homeHeader.classList.remove("nav-open");
        homeNavToggle.setAttribute("aria-expanded", "false");
    };

    homeNavToggle.addEventListener("click", () => {
        const isOpen = homeHeader.classList.toggle("nav-open");
        homeNavToggle.setAttribute("aria-expanded", String(isOpen));
    });

    homeNavLinks.forEach((link) => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 900) {
                closeNav();
            }
        });
    });

    document.addEventListener("click", (event) => {
        if (homeHeader.classList.contains("nav-open") && !homeHeader.contains(event.target)) {
            closeNav();
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            closeNav();
        }
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 900) {
            closeNav();
        }
    });
}

// Typography animation controller (load + scroll + stagger)
const applyMotionDefaults = () => {
    const defaults = [
        { selector: ".hero h2:not([data-motion])", motion: "stagger", on: "load", stagger: "letters" },
        { selector: ".hero p:not([data-motion])", motion: "slide", on: "load" },
        { selector: ".projects > h2:not([data-motion])", motion: "stagger", on: "scroll", stagger: "words" },
        { selector: ".contribute-hero h1:not([data-motion])", motion: "stagger", on: "load", stagger: "letters" },
        { selector: ".panel h2:not([data-motion]), .steps-panel h2:not([data-motion])", motion: "slide", on: "scroll" },
        { selector: ".step-title:not([data-motion])", motion: "fade", on: "scroll" },
        { selector: ".page-header h1:not([data-motion])", motion: "stagger", on: "load", stagger: "words" },
        { selector: ".guideline-page section h2:not([data-motion])", motion: "slide", on: "scroll" },
        { selector: ".rule-card h3:not([data-motion])", motion: "fade", on: "scroll" }
    ];

    defaults.forEach(({ selector, motion, on, stagger }) => {
        document.querySelectorAll(selector).forEach((element) => {
            element.setAttribute("data-motion", motion);
            element.setAttribute("data-motion-on", on);
            if (stagger) {
                element.setAttribute("data-stagger", stagger);
            }
        });
    });
};

const normalizeDelay = (value) => {
    if (!value) {
        return "0ms";
    }

    const delay = value.trim();
    if (delay.endsWith("ms") || delay.endsWith("s")) {
        return delay;
    }

    const asNumber = Number(delay);
    return Number.isFinite(asNumber) ? `${asNumber}ms` : "0ms";
};

const splitForStagger = (text, mode) => {
    if (mode === "words") {
        return text.split(/(\s+)/);
    }
    return Array.from(text);
};

const prepareStaggerText = (element) => {
    if (element.dataset.motionPrepared === "true") {
        return;
    }

    const originalText = element.textContent;
    if (!originalText || !originalText.trim()) {
        return;
    }

    const staggerMode = element.getAttribute("data-stagger") || "letters";
    const units = splitForStagger(originalText, staggerMode);

    element.setAttribute("aria-label", originalText.trim());
    element.textContent = "";

    let index = 0;
    units.forEach((unit) => {
        const span = document.createElement("span");
        span.className = "motion-char";
        span.setAttribute("aria-hidden", "true");

        if (/^\s+$/.test(unit)) {
            span.classList.add("space");
            span.textContent = unit;
        } else {
            span.style.setProperty("--char-index", String(index));
            span.textContent = unit;
            index += 1;
        }

        element.appendChild(span);
    });

    element.dataset.motionPrepared = "true";
};

const initTypographyMotion = () => {
    applyMotionDefaults();

    const targets = Array.from(document.querySelectorAll("[data-motion]"));
    if (!targets.length) {
        return;
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    targets.forEach((element) => {
        const delay = normalizeDelay(element.getAttribute("data-motion-delay"));
        element.style.setProperty("--motion-delay", delay);

        if (element.getAttribute("data-motion") === "stagger" && !prefersReducedMotion) {
            prepareStaggerText(element);
        }
    });

    if (prefersReducedMotion) {
        targets.forEach((element) => element.classList.add("is-visible"));
        return;
    }

    const reveal = (element) => element.classList.add("is-visible");

    const loadTargets = targets.filter((element) => element.getAttribute("data-motion-on") !== "scroll");
    const scrollTargets = targets.filter((element) => element.getAttribute("data-motion-on") === "scroll");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            loadTargets.forEach((element, index) => {
                window.setTimeout(() => reveal(element), index * 120);
            });
        });
    });

    if (!scrollTargets.length) {
        return;
    }

    if (!("IntersectionObserver" in window)) {
        scrollTargets.forEach(reveal);
        return;
    }

    const observer = new IntersectionObserver(
        (entries, activeObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    reveal(entry.target);
                    activeObserver.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.24,
            rootMargin: "0px 0px -10% 0px"
        }
    );

    scrollTargets.forEach((element) => observer.observe(element));
};

initTypographyMotion();

document.body.classList.toggle("low-end-3d", isLowEndDevice);
initThreeDEffects();
initScrollReveal();

// Footer year sync
document.querySelectorAll(".footer-year").forEach((yearNode) => {
    yearNode.textContent = String(new Date().getFullYear());
});

function initThreeDEffects() {
    const root = document.documentElement;
    const starNodes = initStarfield();
    const sceneNodes = Array.from(document.querySelectorAll(".home-page [data-depth]"));
    const heroPanel = document.querySelector(".hero-panel");
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");

    const resetScene = () => {
        root.style.setProperty("--fx-scene-x", "0px");
        root.style.setProperty("--fx-scene-y", "0px");
        root.style.setProperty("--fx-header-rotate-x", "0deg");
        root.style.setProperty("--fx-header-rotate-y", "0deg");
        root.style.setProperty("--fx-panel-shift-x", "0px");
        root.style.setProperty("--fx-panel-shift-y", "0px");
        root.style.setProperty("--fx-panel-rotate-x", "0deg");
        root.style.setProperty("--fx-panel-rotate-y", "0deg");

        sceneNodes.forEach((node) => {
            const layerZ = node.style.getPropertyValue("--layer-z") || "0px";
            node.style.transform = `translate3d(0px, 0px, ${layerZ})`;
        });

        starNodes.forEach((node) => {
            node.style.transform = "translate3d(0px, 0px, 0px)";
        });
    };

    const resetHeroCard = () => {
        root.style.setProperty("--fx-hero-rotate-x", "0deg");
        root.style.setProperty("--fx-hero-rotate-y", "0deg");
        root.style.setProperty("--fx-hero-shift-x", "0px");
        root.style.setProperty("--fx-hero-shift-y", "0px");
        root.style.setProperty("--fx-hero-spot-x", "50%");
        root.style.setProperty("--fx-hero-spot-y", "50%");
    };

    resetScene();
    resetHeroCard();
    initTiltCards();

    if (!finePointer.matches || prefersReducedMotion.matches) {
        return;
    }

    const maxSceneX = isLowEndDevice ? 7 : 14;
    const maxSceneY = isLowEndDevice ? 5 : 10;
    const sceneState = {
        currentX: 0,
        currentY: 0,
        targetX: 0,
        targetY: 0,
        frameId: 0
    };

    const renderScene = () => {
        sceneState.currentX += (sceneState.targetX - sceneState.currentX) * 0.11;
        sceneState.currentY += (sceneState.targetY - sceneState.currentY) * 0.11;

        root.style.setProperty("--fx-scene-x", `${(sceneState.currentX * 1.2).toFixed(2)}px`);
        root.style.setProperty("--fx-scene-y", `${(sceneState.currentY * 0.9).toFixed(2)}px`);
        root.style.setProperty("--fx-header-rotate-x", `${(sceneState.currentY * -0.8).toFixed(2)}deg`);
        root.style.setProperty("--fx-header-rotate-y", `${(sceneState.currentX * 1.2).toFixed(2)}deg`);
        root.style.setProperty("--fx-panel-shift-x", `${(sceneState.currentX * 2.4).toFixed(2)}px`);
        root.style.setProperty("--fx-panel-shift-y", `${(sceneState.currentY * 1.6).toFixed(2)}px`);
        root.style.setProperty("--fx-panel-rotate-x", `${(sceneState.currentY * -0.65).toFixed(2)}deg`);
        root.style.setProperty("--fx-panel-rotate-y", `${(sceneState.currentX * 0.95).toFixed(2)}deg`);

        sceneNodes.forEach((node) => {
            const depthFactor = Number(node.style.getPropertyValue("--depth-factor")) || 1;
            const layerZ = node.style.getPropertyValue("--layer-z") || "0px";
            node.style.transform = `translate3d(${(sceneState.currentX * maxSceneX * depthFactor).toFixed(2)}px, ${(sceneState.currentY * maxSceneY * depthFactor).toFixed(2)}px, ${layerZ})`;
        });

        starNodes.forEach((node) => {
            const depthFactor = Number(node.style.getPropertyValue("--star-depth")) || 0.4;
            node.style.transform = `translate3d(${(sceneState.currentX * maxSceneX * depthFactor).toFixed(2)}px, ${(sceneState.currentY * maxSceneY * depthFactor).toFixed(2)}px, 0px)`;
        });

        const done =
            Math.abs(sceneState.targetX - sceneState.currentX) < 0.002 &&
            Math.abs(sceneState.targetY - sceneState.currentY) < 0.002;

        if (done) {
            sceneState.frameId = 0;
            return;
        }

        sceneState.frameId = requestAnimationFrame(renderScene);
    };

    const queueSceneFrame = () => {
        if (!sceneState.frameId) {
            sceneState.frameId = requestAnimationFrame(renderScene);
        }
    };

    window.addEventListener("pointermove", (event) => {
        if (prefersReducedMotion.matches) {
            return;
        }

        sceneState.targetX = (event.clientX / Math.max(window.innerWidth, 1) - 0.5) * 2;
        sceneState.targetY = (event.clientY / Math.max(window.innerHeight, 1) - 0.5) * 2;
        queueSceneFrame();
    }, { passive: true });

    const resetPointerScene = () => {
        sceneState.targetX = 0;
        sceneState.targetY = 0;
        queueSceneFrame();
    };

    window.addEventListener("blur", resetPointerScene);
    document.addEventListener("mouseleave", resetPointerScene);

    if (isHomePage && heroPanel) {
        const heroCard = heroPanel.querySelector(".hero-glass-card");
        if (!heroCard) {
            return;
        }

        heroPanel.addEventListener("pointermove", (event) => {
            if (prefersReducedMotion.matches) {
                resetHeroCard();
                return;
            }

            const rect = heroCard.getBoundingClientRect();
            const relativeX = (event.clientX - rect.left) / rect.width;
            const relativeY = (event.clientY - rect.top) / rect.height;
            const centeredX = (relativeX - 0.5) * 2;
            const centeredY = (relativeY - 0.5) * 2;
            const maxTilt = isLowEndDevice ? 3 : 5;

            root.style.setProperty("--fx-hero-rotate-x", `${(-centeredY * maxTilt).toFixed(2)}deg`);
            root.style.setProperty("--fx-hero-rotate-y", `${(centeredX * maxTilt).toFixed(2)}deg`);
            root.style.setProperty("--fx-hero-shift-x", `${(centeredX * 4).toFixed(2)}px`);
            root.style.setProperty("--fx-hero-shift-y", `${(centeredY * 2.5).toFixed(2)}px`);
            root.style.setProperty("--fx-hero-spot-x", `${(relativeX * 100).toFixed(2)}%`);
            root.style.setProperty("--fx-hero-spot-y", `${(relativeY * 100).toFixed(2)}%`);
        });

        heroPanel.addEventListener("pointerleave", resetHeroCard);
    }

    const handleMotionPreferenceChange = (event) => {
        if (!event.matches) {
            return;
        }

        resetScene();
        resetHeroCard();
    };

    if (typeof prefersReducedMotion.addEventListener === "function") {
        prefersReducedMotion.addEventListener("change", handleMotionPreferenceChange);
    } else if (typeof prefersReducedMotion.addListener === "function") {
        prefersReducedMotion.addListener(handleMotionPreferenceChange);
    }
}

function initTiltCards() {
    const selectors = [
        ".project-card",
        ".panel.card-shell",
        ".steps-panel.card-shell",
        ".projects-hero",
        ".mini-projects",
        ".contribute-hero",
        ".about-hero",
        ".contact-hero",
        ".site-footer",
        ".page-header",
        ".alert-box",
        ".highlight-pill",
        ".flow-section",
        ".objective-section",
        ".faq-section",
        ".faq-section details",
        ".rule-card",
        ".contact-info-card",
        ".contact-form-card",
        ".about-copy .card",
        ".auth-container"
    ];
    const cards = Array.from(document.querySelectorAll(selectors.join(", ")));
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
    const maxTilt = isLowEndDevice ? 4.5 : 7.5;

    const resetCard = (card) => {
        card.style.setProperty("--fx-tilt-x", "0deg");
        card.style.setProperty("--fx-tilt-y", "0deg");
        card.style.setProperty("--fx-lift", "0px");
        card.style.setProperty("--fx-spot-x", "50%");
        card.style.setProperty("--fx-spot-y", "50%");
        card.style.setProperty("--fx-auth-rotate-x", "0deg");
        card.style.setProperty("--fx-auth-rotate-y", "0deg");
        card.style.setProperty("--fx-auth-lift", "0px");
    };

    cards.forEach(resetCard);

    if (!finePointer.matches || prefersReducedMotion.matches) {
        return;
    }

    cards.forEach((card) => {
        card.addEventListener("pointermove", (event) => {
            if (prefersReducedMotion.matches) {
                resetCard(card);
                return;
            }

            const rect = card.getBoundingClientRect();
            const relativeX = (event.clientX - rect.left) / rect.width;
            const relativeY = (event.clientY - rect.top) / rect.height;
            const centeredX = (relativeX - 0.5) * 2;
            const centeredY = (relativeY - 0.5) * 2;
            const isLargePanel = card.matches(".projects-hero, .mini-projects, .contribute-hero, .about-hero, .contact-hero, .site-footer, .page-header, .alert-box, .flow-section, .objective-section, .faq-section");
            const cardTilt = isLargePanel ? maxTilt * 0.72 : maxTilt;
            const lift = isLargePanel ? "-1.5px" : "-3px";

            if (card.classList.contains("auth-container")) {
                card.style.setProperty("--fx-auth-rotate-x", `${(-centeredY * maxTilt * 1.18).toFixed(2)}deg`);
                card.style.setProperty("--fx-auth-rotate-y", `${(centeredX * maxTilt * 1.18).toFixed(2)}deg`);
                card.style.setProperty("--fx-auth-lift", "-4px");
            } else {
                card.style.setProperty("--fx-tilt-x", `${(-centeredY * cardTilt).toFixed(2)}deg`);
                card.style.setProperty("--fx-tilt-y", `${(centeredX * cardTilt).toFixed(2)}deg`);
                card.style.setProperty("--fx-lift", lift);
            }

            card.style.setProperty("--fx-spot-x", `${(relativeX * 100).toFixed(2)}%`);
            card.style.setProperty("--fx-spot-y", `${(relativeY * 100).toFixed(2)}%`);
        });

        card.addEventListener("pointerleave", () => {
            resetCard(card);
        });
    });

    const handleMotionPreferenceChange = (event) => {
        if (event.matches) {
            cards.forEach(resetCard);
        }
    };

    if (typeof prefersReducedMotion.addEventListener === "function") {
        prefersReducedMotion.addEventListener("change", handleMotionPreferenceChange);
    } else if (typeof prefersReducedMotion.addListener === "function") {
        prefersReducedMotion.addListener(handleMotionPreferenceChange);
    }
}

function initStarfield() {
    let field = document.querySelector(".fx-starfield");
    if (field) {
        return Array.from(field.querySelectorAll(".fx-star"));
    }

    field = document.createElement("div");
    field.className = "fx-starfield";

    const starCount = isLowEndDevice ? 14 : supportsFinePointer ? 26 : 16;
    for (let index = 0; index < starCount; index += 1) {
        const star = document.createElement("span");
        star.className = "fx-star";
        if (Math.random() > 0.68) {
            star.classList.add("is-bright");
        }

        const size = (Math.random() * 2.6 + 1.4).toFixed(2);
        const depth = (Math.random() * 0.9 + 0.2).toFixed(2);
        star.style.left = `${(Math.random() * 100).toFixed(2)}%`;
        star.style.top = `${(Math.random() * 100).toFixed(2)}%`;
        star.style.setProperty("--star-size", `${size}px`);
        star.style.setProperty("--star-depth", depth);
        star.style.setProperty("--star-opacity", `${(Math.random() * 0.36 + 0.34).toFixed(2)}`);
        star.style.setProperty("--star-twinkle", `${(Math.random() * 4 + 4).toFixed(2)}s`);
        star.style.setProperty("--star-delay", `${(Math.random() * 4).toFixed(2)}s`);
        field.appendChild(star);
    }

    document.body.prepend(field);
    return Array.from(field.querySelectorAll(".fx-star"));
}

function initScrollReveal() {
    const targets = Array.from(document.querySelectorAll([
        ".hero-panel",
        ".projects-hero",
        ".mini-projects",
        ".contribute-hero",
        ".panel.card-shell",
        ".steps-panel.card-shell",
        ".about-hero",
        ".about-copy .card",
        ".contact-hero",
        ".contact-info-card",
        ".contact-form-card",
        ".site-footer",
        ".page-header",
        ".alert-box",
        ".highlight-pill",
        ".flow-section",
        ".objective-section",
        ".faq-section",
        ".faq-section details",
        ".rule-card",
        ".auth-container"
    ].join(", ")));

    if (!targets.length) {
        return;
    }

    targets.forEach((target) => {
        if (!target.classList.contains("fx-reveal")) {
            target.classList.add("fx-reveal");
        }
    });

    if (prefersReducedMotion.matches || !("IntersectionObserver" in window)) {
        targets.forEach((target) => target.classList.add("is-revealed"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, activeObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const revealIndex = targets.indexOf(entry.target);
                window.setTimeout(() => {
                    entry.target.classList.add("is-revealed");
                }, Math.min(revealIndex % 6, 5) * 45);
                activeObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.18,
            rootMargin: "0px 0px -8% 0px"
        }
    );

    targets.forEach((target) => observer.observe(target));
}
