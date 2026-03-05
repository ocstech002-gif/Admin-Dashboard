fetch("layouts/layout.html")
  .then(res => res.text())
  .then(html => {
    document.getElementById("layout").innerHTML = html;
  });