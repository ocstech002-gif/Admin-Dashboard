console.log("UserMaster JS Loaded......");

(function () {
  const isLoggedIn = localStorage.getItem("saas_logged_in");

  if (!isLoggedIn) {
    window.location.href = "/auth/login.html";
  }
})();
let table;
let editRow = null;

$(document).ready(function () {

  /* -------- data table initialize ---------- */

  table = $("#usersTable").DataTable({
    pageLength: 5,
    lengthChange: false,
    ordering: true,
    info: true,
    autoWidth: false,
    dom: "rtip" ,

columnDefs: [
    { orderable: false, targets: 4 }, 
    { width: "25%", targets: 0 },
    { width: "30%", targets: 1 },
    { width: "15%", targets: 2 },
    { width: "15%", targets: 3 },
    { width: "15%", targets: 4 }
  ]

  });


  $("#usersTable tbody tr").each(function () {
  const row = table.row(this);

  const data = row.data();

  const actions = `
  <div class="text-end">
    <button class="btn btn-sm btn-light edit-btn">
      <i class="bi bi-pencil"></i>
    </button>
    <button class="btn btn-sm btn-light text-danger delete-btn">
      <i class="bi bi-trash"></i>
    </button>
    </div>
  `;

  data[4] = actions; 
  row.data(data).draw(false);
});

  /* -------- text search ------  */


  $("#userSearch").on("keyup", function () {
    table.search(this.value).draw();
  });

  /* --- drop down filter ------ */
  $("#statusFilter").on("change", function () {
    table.column(3).search(this.value).draw();
  });


function openAddUserModal() {
  editRow = null;
  clearForm();
  $("#addUserModal .modal-title").text("Add User");
}

  /* ----- ADD / UPDATE USER --------- */



  function saveUser() {
  const name = $("#userName").val().trim();
  const email = $("#userEmail").val().trim();
  const role = $("#userRole").val();
  const status = $("#userStatus").val();

  if (!name || !email) {
    alert("Name & Email required");
    return;
  }

  const statusBadge =
    status === "Active"
      ? '<span class="badge bg-success">Active</span>'
      : '<span class="badge bg-warning">Pending</span>';

  const actionButtons = `
  <div class="text-end">
    <button class="btn btn-sm btn-light edit-btn">
      <i class="bi bi-pencil"></i>
    </button>
    <button class="btn btn-sm btn-light text-danger delete-btn">
      <i class="bi bi-trash"></i>
    </button>
    </div>
  `;

  const rowData = [name, email, role, statusBadge, actionButtons];

  if (editRow) {
    table.row(editRow).data(rowData).draw(false);
  } else {
    table.row.add(rowData).draw(false);
  }

  bootstrap.Modal.getInstance(
    document.getElementById("addUserModal")
  ).hide();

  clearForm();
  editRow = null;
}


/* user save  */

   $("#saveUserBtn").on("click", saveUser);


/* user edit  */

   $("#usersTable tbody").on("click", ".edit-btn", function () {
  editRow = $(this).closest("tr");

  const data = table.row(editRow).data();

  $("#userName").val(data[0]);
  $("#userEmail").val(data[1]);
  $("#userRole").val(data[2]);
  $("#userStatus").val(data[3].includes("Active") ? "Active" : "Pending");

  $("#addUserModal .modal-title").text("Edit User");

  new bootstrap.Modal(document.getElementById("addUserModal")).show();
});

  /*  user delete  */

  $("#usersTable").on("click", ".delete-btn", function () {

    if (confirm("Delete this user?")) {
      table.row($(this).closest("tr")).remove().draw();
    }
  });

});

/* clear form  */

function clearForm() {
  $("#userName").val("");
  $("#userEmail").val("");
  $("#userRole").val("User");
  $("#userStatus").val("Active");
}


/* clear on modal close */

$("#addUserModal").on("hidden.bs.modal", function () {
  clearForm();
  editRow = null;
});


