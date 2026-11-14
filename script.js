
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const changingText = document.getElementById("changingText");
const backTop = document.getElementById("backTop");

// Mobile navigation
menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

document.querySelectorAll("#navLinks a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  });
});

// Smooth reveal animation when sections enter the screen
const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries, currentObserver) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        currentObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealElements.forEach((element) => observer.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("visible"));
}

// Animated hero text
const phrases = [
  "meaningful insights.",
  "clear visual stories.",
  "smarter decisions."
];

let phraseIndex = 0;
let characterIndex = phrases[0].length;
let deleting = true;

function typeText() {
  const phrase = phrases[phraseIndex];

  if (deleting) {
    characterIndex--;
    changingText.textContent = phrase.slice(0, characterIndex);

    if (characterIndex <= 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
    setTimeout(typeText, 35);
  } else {
    const nextPhrase = phrases[phraseIndex];
    characterIndex++;
    changingText.textContent = nextPhrase.slice(0, characterIndex);

    if (characterIndex >= nextPhrase.length) {
      deleting = true;
      setTimeout(typeText, 1800);
    } else {
      setTimeout(typeText, 65);
    }
  }
}

if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  setTimeout(typeText, 1800);
}

// Project category filters
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const selectedFilter = button.dataset.filter;

    filterButtons.forEach((item) => {
      item.classList.toggle("active", item === button);
    });

    projectCards.forEach((card) => {
      const shouldShow =
        selectedFilter === "all" ||
        card.dataset.category === selectedFilter;

      card.classList.toggle("is-hidden", !shouldShow);

      if (shouldShow) {
        card.classList.remove("visible");
        requestAnimationFrame(() => {
          card.classList.add("visible");
        });
      }
    });
  });
});

// Back-to-top button
window.addEventListener("scroll", () => {
  backTop.classList.toggle("visible", window.scrollY > 400);
}, { passive: true });

backTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Share portfolio (works best after the site is published)
const shareBtn = document.getElementById("shareBtn");
const shareStatus = document.getElementById("shareStatus");

shareBtn.addEventListener("click", async () => {
  const shareData = {
    title: "Sneha Sharma | Data Analyst Portfolio",
    text: "Explore my portfolio, skills and projects.",
    url: window.location.href
  };

  if (window.location.protocol === "file:") {
    shareStatus.textContent =
      "Publish your portfolio online first, then share its public link.";
    return;
  }

  try {
    if (navigator.share) {
      await navigator.share(shareData);
      shareStatus.textContent = "Share menu opened.";
    } else if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(shareData.url);
      shareStatus.textContent = "Portfolio link copied!";
    } else {
      shareStatus.textContent = "Copy the website address from your browser.";
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      shareStatus.textContent = "Please copy the website address from your browser.";
    }
  }
});

// Automatic footer year
document.getElementById("year").textContent = new Date().getFullYear();
