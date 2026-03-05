

(function () {
  const isLoggedIn = localStorage.getItem("saas_logged_in");

  if (!isLoggedIn) {
    window.location.href = "pages/auth/login.html";
  }
const userEmail = document.getElementById("userEmail");

  if (userEmail) {
    const email = localStorage.getItem("saas_user_email");

    if (email) {
      userEmail.textContent = email;
    } else {
      userEmail.textContent = "Guest";
    }
  }


})();

const usermail = localStorage.getItem("saas_user_email");
const toggleBtn = document.getElementById("toggleSidebar");
const sidebar = document.querySelector(".sidebar");

toggleBtn.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");
});
var revenueOptions = {
  chart: { type: 'line', height: 280 },
  series: [{
    name: 'Revenue',
    data: [1200, 1900, 3000, 2500, 4200, 3800, 5200]
  }],
  xaxis: {
    categories: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  }
};

new ApexCharts(
  document.querySelector("#revenueChart"),
  revenueOptions
).render();


var subOptions = {
  chart: { type: 'donut', height: 280 },
  labels: ['Basic', 'Pro', 'Enterprise'],
  series: [55, 30, 15]
};

new ApexCharts(
  document.querySelector("#subscriptionChart"),
  subOptions
).render();

const themeBtn = document.getElementById("themeToggle");

themeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

});


const menuLinks = document.querySelectorAll(".menu a");
const currentPage = window.location.pathname.split("/").pop();

menuLinks.forEach(link => {
  const parentLi = link.closest("li");

  parentLi.classList.remove("active");

  if (link.getAttribute("href") === currentPage) {
    parentLi.classList.add("active");
  }
});


var revenueOptions = {
  chart: {
    type: 'line',
    height: 280,
    foreColor: '#cbd5e1',
    background: 'transparent'
  },
  theme: {
    mode: document.body.classList.contains('dark') ? 'dark' : 'light'
  },
  grid: {
    borderColor: '#1e293b'
  },
  stroke: {
    width: 3
  },
  series: [{
    name: 'Revenue',
    data: [1200, 1900, 3000, 2500, 4200, 3800, 5200]
  }],
  xaxis: {
    categories: ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  }
};

var subOptions = {
  chart: {
    type: 'donut',
    height: 280,
    foreColor: '#cbd5e1'
  },
  theme: {
    mode: document.body.classList.contains('dark') ? 'dark' : 'light'
  },
  labels: ['Basic', 'Pro', 'Enterprise'],
  series: [55, 30, 15]
};

