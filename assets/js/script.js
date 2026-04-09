document.addEventListener("DOMContentLoaded", async () => {
    await injectSharedHeader();
    highlightActiveNav();
    updateFooterYear();
});

async function injectSharedHeader() {
    const placeholder = document.getElementById("header-placeholder");

    if (!placeholder) {
        return;
    }

    try {
        const response = await fetch("/header.html");

        if (!response.ok) {
            throw new Error(`Unable to load shared header: ${response.status}`);
        }

        placeholder.innerHTML = await response.text();
    } catch (error) {
        console.error(error);
    }
}

function highlightActiveNav() {
    const currentPath = window.location.pathname.replace(/\/+$/, "") || "/index.html";
    const navLinks = document.querySelectorAll(".nav-link");

    navLinks.forEach((link) => {
        const href = new URL(link.href, window.location.origin).pathname.replace(/\/+$/, "");
        const isProjectsSubpage =
            currentPath.startsWith("/pages/project/") && link.dataset.nav === "projects";
        const isCurrent = href === currentPath || (currentPath === "/" && href === "/index.html");

        link.classList.toggle("is-active", isCurrent || isProjectsSubpage);
    });
}

function updateFooterYear() {
    const footerYear = document.getElementById("footer-year");

    if (footerYear) {
        footerYear.textContent = new Date().getFullYear();
    }
}
