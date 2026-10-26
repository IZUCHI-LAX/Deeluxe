console.log("script loaded");

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
calculate(); // show a price on page load