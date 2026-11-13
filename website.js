console.log("script loaded");


document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.getElementById("mobile-menu");
  const navContainer = document.getElementById("nav-container");
  const closeBtn = document.getElementById("close-btn");
  const overlay = document.getElementById("overlay");

  if (!menuBtn || !navContainer) {
    console.log("Menu elements not found. Check the IDs.");
    return;
  }

  function setMenuOpen(isOpen) {
    navContainer.classList.toggle("active", isOpen);
    if (overlay) overlay.classList.toggle("active", isOpen);
    menuBtn.setAttribute("aria-expanded", isOpen);
  }

  // Open the right-side panel from the hamburger
  menuBtn.addEventListener("click", function (e) {
    e.preventDefault(); // stop href="#" from jumping to the top
    setMenuOpen(true);
  });

  // Close with the × button inside the panel
  if (closeBtn) {
    closeBtn.addEventListener("click", () => setMenuOpen(false));
  }

  // Close when the dimmed background is tapped
  if (overlay) {
    overlay.addEventListener("click", () => setMenuOpen(false));
  }

  // Close after a nav button is tapped
  navContainer.addEventListener("click", function (e) {
    if (e.target.closest("button:not(.close-btn)")) setMenuOpen(false);
  });

  // Close with the Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") setMenuOpen(false);
  });

  // Close when the user scrolls more than 30px
  let lastScroll = window.scrollY;
  window.addEventListener("scroll", function () {
    if (Math.abs(window.scrollY - lastScroll) > 30) {
      setMenuOpen(false);
      lastScroll = window.scrollY;
    }
  });
});

// ---- Prices (change these to your real rates) ----
const BASE_PRICE = {
  standard: 20000, deep: 25000,
  office: 25000, construction: 45000, pest: 40000
};
const SERVICE_LABEL = {
  standard: "Basic Cleaning", deep: "Deep Cleaning",
  office: "Office Cleaning", construction: "Post-Construction",
  pest: "Pest Control (fumigating)"
};
const PER_BEDROOM = 5000;
const PER_BATHROOM = 15000;
const WHATSAPP_NUMBER = "2349037940259";

const bedRow = document.getElementById("bedrooms");
const bathRow = document.getElementById("bathrooms");
const serviceButtons = document.querySelectorAll("#services button");
const totalEl = document.getElementById("totalPrice");
const bookBtn = document.getElementById("bookBtn");
const ctaHint = document.getElementById("ctaHint");

function getSelected(row) {
  return row.querySelector('.choice[aria-pressed="true"]');
}

function getSelectedServices() {
  return Array.from(serviceButtons).filter(b => b.getAttribute("aria-pressed") === "true");
}

function calculate() {
  const bed = getSelected(bedRow);
  const bath = getSelected(bathRow);
  const services = getSelectedServices();
  const hasSize = Boolean(bed || bath);

  // Each selected service adds its own price
  const servicesTotal = services.reduce((sum, b) => sum + (BASE_PRICE[b.dataset.service] || 0), 0);

  // Bedrooms and bathrooms add on top when chosen
  const sizeTotal = (bed ? Number(bed.dataset.value) * PER_BEDROOM : 0)
    + (bath ? Number(bath.dataset.value) * PER_BATHROOM : 0);

  const total = servicesTotal + sizeTotal;

  totalEl.textContent = "Total: ₦" + total.toLocaleString();
  updateBookButton(bed, bath, services, total, hasSize);
}

function updateBookButton(bed, bath, services, total, hasSize) {
  const ready = hasSize && services.length > 0;
  bookBtn.setAttribute("aria-disabled", String(!ready));
  ctaHint.classList.toggle("hidden", ready);

  if (!ready) {
    bookBtn.removeAttribute("href");
    return;
  }

  const lines = [
    "Hello Deeluxe CleanPro, I'd like to book a service.",
    "",
    "Bedrooms: " + (bed ? bed.textContent.trim() : "Not selected"),
    "Bathrooms: " + (bath ? bath.textContent.trim() : "Not selected"),
    "Services: " + services.map(b => SERVICE_LABEL[b.dataset.service]).join(", "),
    "Estimated total: ₦" + total.toLocaleString()
  ];

  bookBtn.href = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines.join("\n"));
  bookBtn.target = "_blank";
  bookBtn.rel = "noopener";
}

function closeMenus() {
  document.querySelectorAll(".more-menu").forEach(m => (m.hidden = true));
  document.querySelectorAll(".more-trigger").forEach(t => t.setAttribute("aria-expanded", "false"));
}

function selectChoice(row, btn) {
  row.querySelectorAll(".choice").forEach(b => b.setAttribute("aria-pressed", "false"));
  btn.setAttribute("aria-pressed", "true");
}

function setupRow(row) {
  row.addEventListener("click", function (e) {
    const option = e.target.closest(".option");
    const choice = e.target.closest(".choice");

    // A number picked from the 4+ or 3+ dropdown
    if (option) {
      const trigger = option.closest(".more-wrap").querySelector(".more-trigger");
      trigger.dataset.value = option.dataset.value;
      trigger.textContent = option.textContent.trim();
      selectChoice(row, trigger);
      closeMenus();
      calculate();
      return;
    }

    if (!choice) return;

    // The 4+ or 3+ button opens or closes its dropdown
    if (choice.classList.contains("more-trigger")) {
      const menu = choice.parentElement.querySelector(".more-menu");
      const willOpen = menu.hidden;
      closeMenus();
      selectChoice(row, choice);
      menu.hidden = !willOpen;
      choice.setAttribute("aria-expanded", String(willOpen));
      calculate();
      return;
    }

    closeMenus();
    selectChoice(row, choice);
    calculate();
  });
}

setupRow(bedRow);
setupRow(bathRow);

// Tapping outside a dropdown or pressing Escape closes it
document.addEventListener("click", function (e) {
  if (!e.target.closest(".more-wrap")) closeMenus();
});

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") closeMenus();
});

// Services toggle on and off independently
serviceButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    const isOn = btn.getAttribute("aria-pressed") === "true";
    btn.setAttribute("aria-pressed", String(!isOn));
    calculate();
  });
});

// Reset everything on load, and when the page is restored from the back/forward cache
function resetForm() {
  document.querySelectorAll("#bedrooms .choice, #bathrooms .choice").forEach(b => {
    b.setAttribute("aria-pressed", "false");
  });
  serviceButtons.forEach(b => b.setAttribute("aria-pressed", "false"));

  // Restore the 4+ and 3+ buttons to their original labels
  document.querySelectorAll(".more-trigger").forEach(t => {
    t.dataset.value = t.dataset.defaultValue;
    t.textContent = t.dataset.defaultLabel;
    t.setAttribute("aria-expanded", "false");
  });

  closeMenus();
  calculate();
}

// Save the original 4+ and 3+ values once
document.querySelectorAll(".more-trigger").forEach(t => {
  t.dataset.defaultValue = t.dataset.value;
  t.dataset.defaultLabel = t.textContent.trim();
});

window.addEventListener("pageshow", resetForm);