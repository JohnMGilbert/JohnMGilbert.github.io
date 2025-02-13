document.addEventListener("DOMContentLoaded", function () {
    const toggleButton = document.getElementById("dark-mode-toggle");
    const body = document.body;
    const themeStylesheet = document.getElementById("theme-stylesheet");

    if (!toggleButton) {
        console.error("Dark mode toggle button not found!");
        // return;
    }

    console.log("Dark mode button found!");

    let storedTheme = localStorage.getItem("dark-mode");
    console.log("Stored Theme in LocalStorage:", storedTheme);

    if (storedTheme === "enabled") {
        body.classList.add("dark");
        themeStylesheet.href = "/assets/css/dark-mode.css"; // Switch to dark theme
    }

    toggleButton.addEventListener("click", function () {
        body.classList.toggle("dark");

        if (body.classList.contains("dark")) {
            localStorage.setItem("dark-mode", "enabled");
            themeStylesheet.href = "/assets/css/dark-mode.css"; // Switch to dark mode
            console.log("Dark mode enabled!");
        } else {
            localStorage.setItem("dark-mode", "disabled");
            themeStylesheet.href = "/assets/css/style.css"; // Switch back to light mode
            console.log("Dark mode disabled!");
        }
    });
});
