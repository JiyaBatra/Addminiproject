// Create butterfly cursor (desktop only)
document.documentElement.classList.add("js-ready");

const cursor = document.querySelector(".cursor");
const supportsFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (cursor && supportsFinePointer) {
    document.addEventListener("mousemove", (e) => {
        // Move butterfly
        cursor.style.left = e.pageX + "px";
        cursor.style.top = e.pageY + "px";

        // Create sparkle
        const sparkle = document.createElement("div");
        sparkle.classList.add("sparkle");

        sparkle.style.left = e.pageX + "px";
        sparkle.style.top = e.pageY + "px";

        document.body.appendChild(sparkle);

        // Remove sparkle after animation
        setTimeout(() => {
            sparkle.remove();
        }, 800);
    });
}

// Floating decorative butterflies
function createFloatingButterfly() {
    const floatButterfly = document.createElement("div");
    floatButterfly.innerHTML = "🦋";
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

if (supportsFinePointer) {
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
