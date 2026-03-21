// ---------- Load Component Function ----------
function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;

            // Run post-load hooks for specific components
            if (id === "nav-placeholder") {
                initNavDropdowns();
            }
        });
}


// ---------- Components ----------
loadComponent("nav-placeholder", "components/nav.html");
loadComponent("footer-placeholder", "components/footer.html");
loadComponent("head-placeholder", "components/head.html");


// ---------- Navigation Dropdown Logic ----------
function initNavDropdowns() {
    // Desktop: hover handled by CSS, mobile: toggle click
    document.querySelectorAll('.dropdown-toggle').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            const menu = btn.nextElementSibling;
            if (!menu) return;
            menu.style.display = menu.style.display === 'block' ? 'none' : 'block';
        });
    });

    // Optional: close dropdown if clicking outside (nice UX)
    document.addEventListener('click', e => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            if (!menu.contains(e.target) && !menu.previousElementSibling.contains(e.target)) {
                menu.style.display = 'none';
            }
        });
    });
}