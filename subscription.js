(function () {
  const isLoggedIn = localStorage.getItem("saas_logged_in");

  if (!isLoggedIn) {
    window.location.href = "/auth/login.html";
  }
})();
const planButtons = document.querySelectorAll(".select-plan");

const CURRENT_PLAN_KEY = "saas_current_plan";


if (!localStorage.getItem(CURRENT_PLAN_KEY)) {
  localStorage.setItem(CURRENT_PLAN_KEY, "Free");
}

// planButtons.forEach(btn => {
//   btn.addEventListener("click", () => {
//     const selectedPlan = btn.dataset.plan;

//     if (confirm(`Switch to ${selectedPlan} plan?`)) {
//       localStorage.setItem(CURRENT_PLAN_KEY, selectedPlan);
//       alert("Subscription updated!");
//       window.location.reload();
//     }
//   });
// });


const currentPlan = localStorage.getItem(CURRENT_PLAN_KEY);

planButtons.forEach(btn => {
  if (btn.dataset.plan === currentPlan) {
    btn.innerText = "Current Plan";
    btn.classList.remove("btn-primary", "btn-dark");
    btn.classList.add("btn-outline-success");
    btn.disabled = true;
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("billingToggle");
  const prices = document.querySelectorAll(".price");
  const monthlyLabel = document.getElementById("monthlyLabel");
  const yearlyLabel = document.getElementById("yearlyLabel");

  toggle.addEventListener("change", () => {
    const isYearly = toggle.checked;

    prices.forEach(price => {
      const amount = isYearly
        ? price.dataset.yearly
        : price.dataset.monthly;

      price.style.transform = "scale(0.9)";
      setTimeout(() => {
        price.textContent = `$${amount}`;
        price.style.transform = "scale(1)";
      }, 150);
    });

    monthlyLabel.classList.toggle("active", !isYearly);
    yearlyLabel.classList.toggle("active", isYearly);
  });
});


document.addEventListener("DOMContentLoaded", () => {

  const CURRENT_PLAN_KEY = "saas_current_plan";
  const BILLING_KEY = "saas_billing_cycle";
  const buttons = document.querySelectorAll(".select-plan");
  const billingToggle = document.getElementById("billingToggle");
  const modalEl = document.getElementById("upgradeModal");
const prices = document.querySelectorAll(".price");
  if (!modalEl) return;

  const modal = new bootstrap.Modal(modalEl);
  let selectedPlan = null;

  if (!localStorage.getItem(CURRENT_PLAN_KEY)) {
    localStorage.setItem(CURRENT_PLAN_KEY, "Free");
  }

  if (!localStorage.getItem(BILLING_KEY)) {
  localStorage.setItem(BILLING_KEY, "monthly");
}
  const savedBilling = localStorage.getItem(BILLING_KEY);
  billingToggle.checked = savedBilling === "yearly";
 updatePrices(billingToggle.checked);

 
  billingToggle.addEventListener("change", () => {
    const billing = billingToggle.checked ? "yearly" : "monthly";
    localStorage.setItem(BILLING_KEY, billing);
    updatePrices(billingToggle.checked);
  });

  const currentPlan = localStorage.getItem(CURRENT_PLAN_KEY);

  buttons.forEach(btn => {
    btn.disabled = false;
    btn.classList.remove("btn-outline-success");
    btn.innerText = "Upgrade";

    if (btn.dataset.plan === currentPlan) {
      btn.innerText = "Current Plan";
      btn.disabled = true;
      btn.classList.add("btn-outline-success");
    }
  });

  
  buttons.forEach(btn => {
    btn.addEventListener("click", () => {

      if (btn.disabled) return;

      const card = btn.closest(".pricing-card");
      const priceEl = card.querySelector(".price");

      const isYearly = billingToggle.checked;
      const price = isYearly
        ? priceEl.dataset.yearly
        : priceEl.dataset.monthly;

      selectedPlan = btn.dataset.plan;

      document.getElementById("selectedPlanName").innerText = selectedPlan;
      document.getElementById("selectedPlanBilling").innerText =
        isYearly ? "Yearly" : "Monthly";

      document.getElementById("selectedPlanPrice").innerText = `$${price}`;

      modal.show();
    });
  });

  document.getElementById("confirmUpgrade").addEventListener("click", () => {
    localStorage.setItem(CURRENT_PLAN_KEY, selectedPlan);
     const billing = billingToggle.checked ? "yearly" : "monthly";
    localStorage.setItem(BILLING_KEY, billing);
        modal.hide();
    location.reload();
  });

});
function updatePrices(isYearly) {
  document.querySelectorAll(".price").forEach(price => {
    const amount = isYearly
      ? price.dataset.yearly
      : price.dataset.monthly;

    price.classList.add("switching");
    setTimeout(() => {
      price.textContent = `$${amount}`;
      price.classList.remove("switching");
    }, 150);
  });
}
function updatePlanButtons() {
  const currentPlan = localStorage.getItem(CURRENT_PLAN_KEY);
  const buttons = document.querySelectorAll(".select-plan");

  buttons.forEach(btn => {
    const plan = btn.dataset.plan;

    btn.innerText = "Upgrade";
    btn.disabled = false;
    btn.className = "btn btn-outline-primary select-plan";

    if (plan === currentPlan) {
      btn.innerText = "Current Plan";
      btn.disabled = true;
      btn.classList.remove("btn-outline-primary");
      btn.classList.add("btn-primary", "current-plan");
    }
  });
}