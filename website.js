console.log("script loaded");


document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.getElementById("mobile-menu");
  const navContainer = document.getElementById("nav-container");

  if (!menuBtn || !navContainer) {
    console.log("Menu elements not found. Check the IDs.");
    return;
  }

  function setMenuOpen(isOpen) {
    navContainer.classList.toggle("active", isOpen);
    menuBtn.innerHTML = isOpen ? "&times;" : "&#9776;";
    menuBtn.setAttribute("aria-expanded", isOpen);
  }

  // Toggle the menu when the hamburger is clicked
  menuBtn.addEventListener("click", function (e) {
    e.preventDefault(); // stop href="#" from jumping to the top
    setMenuOpen(!navContainer.classList.contains("active"));
  });

  // Close after any nav button is tapped
  navContainer.addEventListener("click", function (e) {
    if (e.target.closest("button")) setMenuOpen(false);
  });

  // Close when tapping outside the header
  document.addEventListener("click", function (e) {
    if (!e.target.closest("header")) setMenuOpen(false);
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
  office: 28000, construction: 45000, pest: 20000
};
const PER_BEDROOM = 5000;
const PER_BATHROOM = 4000;

const bedButtons = document.querySelectorAll("#bedrooms button");
const bathButtons = document.querySelectorAll("#bathrooms button");
const cleanSelect = document.getElementById("clean");
const totalEl = document.getElementById("totalPrice");

function getSelected(buttons) {
  const sel = Array.from(buttons).find(b => b.getAttribute("aria-pressed") === "true");
  return sel ? Number(sel.dataset.value) || 0 : 0;
}

function calculate() {
  const total = (BASE_PRICE[cleanSelect.value] || 0)
    + getSelected(bedButtons) * PER_BEDROOM
    + getSelected(bathButtons) * PER_BATHROOM;
  totalEl.textContent = "Total: ₦" + total.toLocaleString();
}

function setupGroup(buttons) {
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {
      buttons.forEach(b => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      calculate();
    });
  });
}

setupGroup(bedButtons);
setupGroup(bathButtons);
cleanSelect.addEventListener("change", calculate);
