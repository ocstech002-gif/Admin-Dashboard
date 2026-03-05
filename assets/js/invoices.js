console.log("InvoiceMaster JS Loaded.....");

(function () {
  const isLoggedIn = localStorage.getItem("saas_logged_in");

  if (!isLoggedIn) {
    window.location.href = "/auth/login.html";
  }
})();

let table;
let gstRate = 0;
let editRow = null;
if (typeof html2pdf === "undefined") {
  console.error("html2pdf not loaded...!!!!!!!!!!");
} else {
  console.log("html2pdf loaded...");
}
$(document).ready(function () {

  /* ================= DATATABLE INIT ================= */
  table = $("#invoiceTable").DataTable({
    pageLength: 5,
    lengthChange: false,
    ordering: true,
    info: true,
    dom: "rtip", 
      language: {
      search: "",
      searchPlaceholder: "Search invoice..."
    },
    columnDefs: [
      { orderable: false, targets: -1 } // Action column
    ]
  });


  /* ================= GLOBAL SEARCH ================= */
  $("#invoiceSearch").on("keyup", function () {
    table.search(this.value).draw();
  });

  /* ================= STATUS FILTER ================= */
  $("#statusFilter").on("change", function () {
    const value = this.value;

    if (value === "") {
      table.column(5).search("").draw();
    } else {
      table.column(5).search(value).draw();
    }
  });

  /* ================= FIX EXISTING ROW ACTIONS ================= */
  addActionButtonsToExistingRows();

  /* ================= VIEW INVOICE ================= */
  $("#invoiceTable tbody").on("click", ".view-btn", function () {
    const row = table.row($(this).closest("tr")).data();

    alert(
      `Invoice No: ${row[0]}\nCustomer: ${row[1]}\nAmount: ${row[3]}`
    );
  });

});

/* ================= ACTION BUTTONS ================= */
function addActionButtonsToExistingRows() {
  $("#invoiceTable tbody tr").each(function () {

    const row = table.row(this);
    const data = row.data();

    const actions = `
      <td class="text-end">
        <button class="btn btn-sm btn-light view-btn">
          <i class="bi bi-eye"></i>
        </button>
        <button class="btn btn-sm btn-light text-primary download-btn">
          <i class="bi bi-download"></i>
        </button>
         <button class="btn btn-sm btn-light edit-btn">
      <i class="bi bi-pencil"></i>
    </button>
    <button class="btn btn-sm btn-light text-danger delete-btn">
      <i class="bi bi-trash"></i>
    </button>
      </td>
    `;

    data[6] = actions;
    row.data(data).draw(false);
  });
}


function invoiceActionButtons() {
  return `
    <div class="text-end">
      <button class="btn btn-sm btn-light view-btn">
        <i class="bi bi-eye"></i>
      </button>
      <button class="btn btn-sm btn-light text-primary download-btn">
        <i class="bi bi-download"></i>
      </button>
      <button class="btn btn-sm btn-light edit-btn">
        <i class="bi bi-pencil"></i>
      </button>
      <button class="btn btn-sm btn-light text-danger delete-btn">
        <i class="bi bi-trash"></i>
      </button>
    </div>
  `;
}

/* ------ edit invoice click open form --------*/

$("#invoiceTable tbody").on("click", ".edit-btn", function () {
  editRow = $(this).closest("tr");
  const data = table.row(editRow).data();

  $("#invoiceNo").val(data[0]);
  $("#customerName").val(data[1]);
  
  $("#invoiceDate").val(
  $("<div>").html(data[2]).text().trim()
);

$("#invoiceAmount").val(
  $("<div>").html(data[3]).text().trim()
);
$("#invoiceGstRate").val(
  parseInt(data[4]) || 0
);
  $("#invoiceStatus").val(
    data[5].includes("Paid") ? "Paid" : "Pending"
  );

  $("#addInvoiceModal").modal("show");
});

/* -------- Save Button/ Edit Button---------- */
  
$("#saveInvoiceBtn").on("click", function () {

  const invoiceNo = $("#invoiceNo").val().trim();
  const customer = $("#customerName").val().trim();
  
  const date = $("#invoiceDate").val();
  const amount = $("#invoiceAmount").val();
  gstRate = parseInt($("#invoiceGstRate").val()) || 0;
  const status = $("#invoiceStatus").val();

  if (!invoiceNo || !customer || !amount) {
    alert("Invoice No, Customer & Amount required");
    return;
  }

  const statusBadge =
    status === "Paid"
      ? '<span class="badge bg-success">Paid</span>'
      : '<span class="badge bg-warning">Pending</span>';

  if (editRow) {
    table.row(editRow).data([
      invoiceNo,
      customer,
      date,
      amount,
        gstRate ,
      statusBadge,
    
      invoiceActionButtons()
    ]).draw(false);

    editRow = null;
  } else {
    table.row.add([
      invoiceNo,
      customer,
      date,
      amount,
       gstRate ,
      statusBadge,
     
      invoiceActionButtons()
    ]).draw(false);
  }

  $("#addInvoiceModal").modal("hide");
  $("#addInvoiceModal").modal("hide");
  clearInvoiceForm();
});


/* -----------delete invoice ------*/

$("#invoiceTable tbody").on("click", ".delete-btn", function () {

  if (confirm("Delete this invoice?")) {
    table.row($(this).closest("tr")).remove().draw(false);
  }
});

function calculateGst(amount, gstPercent) { 
  const gstAmount = (amount * gstPercent) / 100; 
  const total = amount + gstAmount; 
  return { gstAmount: gstAmount.toFixed(2), total: total.toFixed(2) }; 
}
/* view invoice */

function viewInvoice(data) {

  $("#viewInvoiceNo").text(data[0]);
  $("#viewCustomerName").text(data[1]);
  $("#viewInvoiceDate").text(data[2]);

  const amount = parseFloat(
    data[3].replace("₹", "").replace(/,/g, "")
  );

  $("#viewInvoiceAmount").text(data[3]);
  $("#viewInvoiceSubtotal").text("₹" + amount);

  const gstPercent = parseFloat(
    $("<div>").html(data[4]).text().replace("%", "")
  ) || 0;

  $("#viewInvoiceGST").text(data[4]);

  const gstCalc = calculateGst(amount, gstPercent);
  $("#viewInvoiceTotal").text("₹" + gstCalc.total);

  if (data[5].includes("Paid")) {
    $("#viewInvoiceStatus")
      .text("Paid")
      .css("background", "#198754");
  } else {
    $("#viewInvoiceStatus")
      .text("Pending")
      .css("background", "#ffc107");
  }

  $("#viewInvoiceModal").modal("show");
};

$("#invoiceTable tbody").on("click", ".view-btn", function () {

    const row = $(this).closest("tr");
  const data = table.row(row).data();

  viewInvoice(data);
});

// DOWNLOAD PDF

function downloadInvoicePdf() {

  const invoiceNo = $("#viewInvoiceNo").text();
  const element = document.getElementById("invoicePdfContent");

  const options = {
    margin: 15,
    filename: invoiceNo + ".pdf",
    image: { type: "jpeg", quality: 1 },
    html2canvas: { scale: 3 },
    jsPDF: { unit: "mm", format: "a4", orientation: "portrait" }
  };

  html2pdf().set(options).from(element).save();
};

$("#downloadInvoicePdf").on("click", function () {
  downloadInvoicePdf();
});


$("#invoiceTable tbody").on("click", ".download-btn", function () {

  const row = $(this).closest("tr");
  const data = table.row(row).data();

  viewInvoice(data);     
  downloadInvoicePdf(); 
});



/* --------- clear form ------------ */
function clearInvoiceForm() {
  $("#invoiceNo").val("");
  $("#customerName").val("");
  $("#invoiceDate").val("");
  $("#invoiceAmount").val("");
  $("#invoiceGstRate").val("");
  
  $("#invoiceStatus").val("Paid");
  editRow = null;
}

/* --------- clear form on close click ================= */
$("#addInvoiceModal").on("hidden.bs.modal", function () {
  clearInvoiceForm();
});

