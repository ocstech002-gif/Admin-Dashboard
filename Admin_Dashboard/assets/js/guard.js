const isAuthPage = window.location.pathname.includes("/auth/");
const isLoggedIn = localStorage.getItem("saas_logged_in");

showLoader();

if (!isAuthPage && !isLoggedIn) {
  window.location.href = "/auth/login.html";
}

if (isAuthPage && isLoggedIn) {
  window.location.href = "/index.html";
}
