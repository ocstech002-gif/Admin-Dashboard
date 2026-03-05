const loader = document.getElementById("pageLoader");

function showLoader() {
  if (loader) {
    loader.style.display = "flex";
  }
}

function hideLoader() {
  if (loader) {
    setTimeout(() => {
      loader.style.display = "none";
    }, 300);
  }
}

window.addEventListener("load", hideLoader);
