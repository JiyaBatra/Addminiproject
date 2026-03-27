// Create butterfly cursor (desktop only)
document.documentElement.classList.add("js-ready");

// ============ THEME TOGGLE FUNCTIONALITY ============
function initThemeToggle() {
    const themeToggle = document.getElementById("themeToggle");
    const htmlElement = document.documentElement;
    
    if (!themeToggle) {
        console.warn("Theme toggle button not found");
        return;
    }
    
    // Check for saved theme preference (default to light)
    const savedTheme = localStorage.getItem("theme") || "light";
    
    // Apply saved theme on page load
    if (savedTheme === "dark") {
        htmlElement.classList.add("dark-theme");
        updateThemeIcon();
    }
    
    // Toggle theme on button click
    themeToggle.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        const isDarkMode = htmlElement.classList.toggle("dark-theme");
        
        // Update localStorage
        try {
            localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        } catch (e) {
            console.warn("localStorage not available:", e);
        }
        
        updateThemeIcon();
    });
}

function updateThemeIcon() {
    const themeToggle = document.getElementById("themeToggle");
    const htmlElement = document.documentElement;
    
    if (!themeToggle) return;
    
    const isDark = htmlElement.classList.contains("dark-theme");
    const themeIcon = themeToggle.querySelector(".theme-icon");
    
    if (themeIcon) {
        themeIcon.textContent = isDark ? "☀️" : "🌙";
    }
}

// Initialize theme toggle when DOM is ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initThemeToggle);
} else {
    initThemeToggle();
}

const cursor = document.querySelector(".cursor");
const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (cursor && supportsFinePointer) {
    let lastSparkleAt = 0;

    document.addEventListener("mousemove", (e) => {
        const x = e.clientX;
        const y = e.clientY;

        // Move butterfly
        cursor.style.left = x + "px";
        cursor.style.top = y + "px";

        // Limit sparkle creation to reduce paint cost on fast mouse movement.
        if (e.timeStamp - lastSparkleAt > 48) {
            const sparkle = document.createElement("div");
            sparkle.classList.add("sparkle");

            sparkle.style.left = x - 7 + "px";
            sparkle.style.top = y - 7 + "px";

            document.body.appendChild(sparkle);

            setTimeout(() => {
                sparkle.remove();
            }, 800);

            lastSparkleAt = e.timeStamp;
        }
    });
}

// Floating decorative butterflies
function createFloatingButterfly() {
    const floatButterfly = document.createElement("div");
    floatButterfly.innerHTML = "&#129419;";
    floatButterfly.style.position = "fixed";
    floatButterfly.style.left = Math.random() * window.innerWidth + "px";
    floatButterfly.style.bottom = "-30px";
    floatButterfly.style.fontSize = "20px";
    floatButterfly.style.opacity = "0.6";
    floatButterfly.style.animation = "floatUp 8s linear forwards";
    document.body.appendChild(floatButterfly);

    setTimeout(() => {
        floatButterfly.remove();
    }, 8000);
}

if (cursor && supportsFinePointer) {
    setInterval(createFloatingButterfly, 3000);
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

// Footer year sync
document.querySelectorAll(".footer-year").forEach((yearNode) => {
    yearNode.textContent = String(new Date().getFullYear());
});

