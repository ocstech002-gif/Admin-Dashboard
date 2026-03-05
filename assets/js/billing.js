(function () {
  const isLoggedIn = localStorage.getItem("saas_logged_in");

  if (!isLoggedIn) {
    window.location.href = "/auth/login.html";
  }
})();
let table;
let editRow = null;

$(document).ready(function () {

  /* -------- DataTable initialize ---------- */
  var table = $("#billingTable").DataTable({
    pageLength: 7,
    lengthChange: false,
    ordering: true,
    info: true,
    autoWidth: false,
    dom: "rtip",

    columnDefs: [
      { orderable: false, targets: 4 }, // Actions column
      { width: "25%", targets: 0 },
      { width: "30%", targets: 1 },
      { width: "15%", targets: 2 },
      { width: "15%", targets: 3 },
      { width: "15%", targets: 4 }
    ]
  });

  /* -------- text search ------ */
  $("#userSearch").on("keyup", function () {
    table.search(this.value).draw();
  });

 
  $("#statusFilter").on("change", function () {
    table.column(5).search(this.value).draw();
  });

});

document.addEventListener("DOMContentLoaded", () => {
  const tableBody = document.getElementById("billingTableBody");
  if (!tableBody) return;

  tableBody.innerHTML = "";

  let plan = localStorage.getItem("saas_plan");
  plan = plan ? JSON.parse(plan) : null;

  if (!plan) {
    plan = {
      name: "Free",
      billing: "Monthly",
      price: "$0"
    };
  }

  const startDate = new Date();
  const endDate = new Date(startDate);

  if (plan.billing === "Yearly") {
    endDate.setFullYear(endDate.getFullYear() + 1);
  } else {
    endDate.setMonth(endDate.getMonth() + 1);
  }

  const formatDate = d =>
    d.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });

  const row = document.createElement("tr");
  row.innerHTML = `
    <td>${plan.name}</td>
    <td>${plan.billing}</td>
    <td>${plan.price}</td>
    <td>${formatDate(startDate)}</td>
    <td>${formatDate(endDate)}</td>
    <td><span class="badge bg-success">Active</span></td>
    <td class="text-end">
      <button class="btn btn-sm btn-light">
        <i class="bi bi-eye"></i>
      </button>
    </td>
  `;

  tableBody.appendChild(row);
});

function goToPlans() {
  window.location.href = "/pages/subscriptions/plans.html";
}