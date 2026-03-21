function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        });
}

// compontents
loadComponent("nav-placeholder", "components/nav.html");
loadComponent("footer-placeholder", "components/footer.html");
loadComponent("head-placeholder", "components/head.html");