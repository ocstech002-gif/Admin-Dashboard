console.log("Auth JS Loaded...");

/* ------------------ demo user cred ----------------------- */
const DEMO_USER = {
  email: "admin@saas.com",
  password: "123456"
};

/* -------------------- toggle password ------------------------- */

document.querySelectorAll(".toggle-password").forEach(btn => {
  btn.addEventListener("click", function () {
    const input = this.previousElementSibling;
    input.type = input.type === "password" ? "text" : "password";

    this.innerHTML =
      input.type === "password"
        ? '<i class="bi bi-eye"></i>'
        : '<i class="bi bi-eye-slash"></i>';
  });
});

/* --------------------------- login save ------------------------------ */


const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();
    const errorBox = document.getElementById("loginError");

    if (!email || !password) {
      showError("Email and password are required");
      return;
    }

    const users = JSON.parse(localStorage.getItem("saas_users")) || [];

    const matchedUser = users.find(
      user => user.email === email && user.password === password
    );

   
    if (
      email === DEMO_USER.email &&
      password === DEMO_USER.password  ||
      matchedUser
    ) {
      
      localStorage.setItem("saas_logged_in", "true");
      localStorage.setItem("saas_user_email", email);

      window.location.href = "/index.html";
    }   
    else {
      showError("Invalid login credentials");
    }

    function showError(msg) {
      errorBox.textContent = msg;
      errorBox.classList.remove("d-none");
    }
  });
}

/*------------------------ logout app ------------------------------- */


document.addEventListener("click", function (e) {

  const logoutBtn = e.target.closest("[data-logout]");

  if (!logoutBtn) return;

  e.preventDefault();

  if (!confirm("Are you sure you want to Logout?")) return;

  showLoader();

  localStorage.removeItem("saas_logged_in");
  localStorage.removeItem("saas_user_email");

  setTimeout(() => {
    window.location.href = "/pages/auth/login.html";
  }, 700);
});


/*---------------------------- Register submit -------------------------------- */

const registerForm = document.getElementById("registerForm");

if (registerForm) {
  registerForm.addEventListener("submit", function (e) {
    e.preventDefault();

    showLoader();

    const name = registerForm.querySelector("input[type='text']").value.trim();
    const email = registerForm.querySelector("input[type='email']").value.trim();
    const password = registerForm.querySelector("input[type='password']").value.trim();

    if (!name || !email || !password) {
      hideLoader();
      alert("All fields are required");
      return;
    }

    if (password.length < 6) {
      hideLoader();
      alert("Password must be at least 6 characters");
      return;
    }

    const users = JSON.parse(localStorage.getItem("saas_users")) || [];

users.push({
  name: name,
  email: email,
  password: password
});

localStorage.setItem("saas_users", JSON.stringify(users));
    setTimeout(() => {
      localStorage.setItem("saas_user_name", name);
      localStorage.setItem("saas_user_email", email);
      localStorage.setItem("saas_registered", true);

      hideLoader();
      alert("Registration successful! Please login.");

      window.location.href = "login.html";
    }, 1200);
  });
}


/* ---------------------- forgot pwd----------------------------- */

const forgotForm = document.getElementById("forgotForm");

if (forgotForm) {
  forgotForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("forgotEmail").value;

    if (!email) {
      alert("Please enter email");
      return;
    }

    localStorage.setItem("reset_email", email);

    alert("Password reset link sent to your email");

    window.location.href = "reset-password.html";
  });
}



/* -----------------reset password ------------------------ */

const resetForm = document.getElementById("resetForm");

if (resetForm) {
  resetForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const newPass = document.getElementById("newPassword").value;
    const confirmPass = document.getElementById("confirmPassword").value;

    if (newPass.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (newPass !== confirmPass) {
      alert("Passwords do not match");
      return;
    }

    alert("Password updated successfully");

    localStorage.removeItem("reset_email");

    window.location.href = "login.html";
  });
}