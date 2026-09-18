const USERS = [
    { username: "Faozan", password: "katakuri88", role: "Admin" },
    { username: "Anton", password: "015576", role: "User" },
    { username: "Risma", password: "031059", role: "User" },
    { username: "Neng", password: "013180", role: "User" }
    { username: "Crista", password: "19310", role: "User" }
];

let decimalPrecision = 2;
let inputMode = "auto";
let clockInterval;
const SESSION_DURATION = 4 * 60 * 60 * 1000;


// ========================================
// THEME
// ========================================

function updateThemeUI() {
    const isDark = document.body.classList.contains("dark-mode");

    const themeIcon = document.getElementById("themeIcon");
    const themeText = document.getElementById("themeText");
    const themeDescription = document.getElementById("themeDescription");

    if (!themeIcon || !themeText || !themeDescription) return;

    if (isDark) {
        themeIcon.textContent = "☀";
        themeText.textContent = "Light Mode";
        themeDescription.textContent = "Switch to light appearance";
    } else {
        themeIcon.textContent = "☾";
        themeText.textContent = "Dark Mode";
        themeDescription.textContent = "Switch to dark appearance";
    }
}

function toggleTheme() {
    document.body.classList.toggle("dark-mode");

    const isDark = document.body.classList.contains("dark-mode");

    localStorage.setItem(
        "plyAdhesionTheme",
        isDark ? "dark" : "light"
    );

    updateThemeUI();
}

function loadTheme() {
    const savedTheme = localStorage.getItem("plyAdhesionTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark-mode");
    }

    updateThemeUI();
}


// ========================================
// SIDEBAR
// ========================================

function openSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    overlay.classList.remove("hidden");

    requestAnimationFrame(() => {
        sidebar.classList.add("sidebar-open");
        overlay.classList.add("sidebar-overlay-open");
    });
}

function closeSidebar() {
    const sidebar = document.getElementById("sidebar");
    const overlay = document.getElementById("sidebarOverlay");

    sidebar.classList.remove("sidebar-open");
    overlay.classList.remove("sidebar-overlay-open");

    setTimeout(() => {
        if (!sidebar.classList.contains("sidebar-open")) {
            overlay.classList.add("hidden");
        }
    }, 450);
}

function toggleSidebar() {
    const sidebar = document.getElementById("sidebar");

    if (sidebar.classList.contains("sidebar-open")) {
        closeSidebar();
    } else {
        openSidebar();
    }
}

// ========================================
// DECIMAL PRECISION
// ========================================

function setDecimal(decimal) {
    decimalPrecision = decimal;

    const btn1 = document.getElementById("decimal1Btn");
    const btn2 = document.getElementById("decimal2Btn");

    btn1.classList.remove("sidebar-decimal-active");
    btn2.classList.remove("sidebar-decimal-active");

    if (decimal === 1) {
        btn1.classList.add("sidebar-decimal-active");
    } else {
        btn2.classList.add("sidebar-decimal-active");
    }

    if (inputMode === "manual") {
        updateManualPrecision();
    }

    closeSidebar();
}

function updateManualPrecision() {
    const inputs = document.querySelectorAll(".manual-value");

    inputs.forEach(input => {
        const rawValue = input.dataset.rawValue || "";
        input.value = formatManualValue(rawValue);
    });

    updateManualAverage();
}


// ========================================
// INPUT MODE
// ========================================

function setInputMode(mode) {
    inputMode = mode;

    const autoBtn = document.getElementById("autoModeBtn");
    const manualBtn = document.getElementById("manualModeBtn");
    const generateBtn = document.getElementById("generateBtn");
    const sampleA = document.getElementById("sampleA");
    const sampleB = document.getElementById("sampleB");
    const manualArea = document.getElementById("manualInputArea");
    const pageTitle = document.getElementById("pageModeTitle");
    const pageDescription = document.getElementById("pageModeDescription");

    autoBtn.classList.remove("sidebar-menu-active");
    manualBtn.classList.remove("sidebar-menu-active");

    clearAllValues();

    if (mode === "auto") {
        autoBtn.classList.add("sidebar-menu-active");

        pageTitle.textContent = "Auto Generate";
        pageDescription.textContent =
            "Automatically generate testing values.";

        generateBtn.classList.remove("hidden");
        generateBtn.textContent = "GENERATE";

        sampleA.classList.remove("hidden");
        sampleB.classList.remove("hidden");
        manualArea.classList.add("hidden");
    } else {
        manualBtn.classList.add("sidebar-menu-active");

        pageTitle.textContent = "Manual Input";
        pageDescription.textContent =
            "Enter your own testing values.";

        generateBtn.classList.add("hidden");

        sampleA.classList.add("hidden");
        sampleB.classList.add("hidden");
        manualArea.classList.remove("hidden");

        renderManualMode();
    }

    closeSidebar();
}


// ========================================
// CLEAR AUTO VALUES
// ========================================

function clearAllValues() {
    document.getElementById("A_dry").innerHTML = "";
    document.getElementById("A_wet").innerHTML = "";
    document.getElementById("B_dry").innerHTML = "";
    document.getElementById("B_wet").innerHTML = "";
}


// ========================================
// MANUAL INPUT
// ========================================

function formatManualValue(digits) {
    if (!digits) {
        return decimalPrecision === 1 ? "0.0" : "0.00";
    }

    const divisor = Math.pow(10, decimalPrecision);
    const value = Number(digits) / divisor;

    return value.toFixed(decimalPrecision);
}

function renderManualMode() {
    const container = document.getElementById("manualValuesContainer");

    if (!container) return;

    container.innerHTML = "";

    for (let i = 0; i < 5; i++) {
        const input = document.createElement("input");

        input.type = "text";
        input.inputMode = "numeric";
        input.autocomplete = "off";
        input.dataset.rawValue = "";

        input.value = decimalPrecision === 1 ? "0.0" : "0.00";

        input.className =
            "manual-value h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 text-center text-base font-semibold text-slate-600 shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200";

        input.addEventListener("input", handleManualInput);

        input.addEventListener("focus", function () {
            this.select();
        });

        container.appendChild(input);
    }

    updateManualAverage();
}

function handleManualInput(event) {
    const input = event.target;

    let digits = input.value.replace(/\D/g, "");

    digits = digits.slice(0, 5);

    input.dataset.rawValue = digits;
    input.value = formatManualValue(digits);

    updateManualAverage();
}

function updateManualAverage() {
    const inputs = document.querySelectorAll(".manual-value");
    const values = [];

    inputs.forEach(input => {
        const rawValue = input.dataset.rawValue || "";

        if (rawValue !== "") {
            const divisor = Math.pow(10, decimalPrecision);
            values.push(Number(rawValue) / divisor);
        }
    });

    const averageEl = document.getElementById("manualAverage");

    if (!averageEl) return;

    if (values.length === 0) {
        averageEl.textContent = "-";
        return;
    }

    const average =
        values.reduce((total, value) => total + value, 0) /
        values.length;

    averageEl.textContent =
        average.toFixed(decimalPrecision);
}

function clearManualValues() {
    const inputs = document.querySelectorAll(".manual-value");
    const averageEl = document.getElementById("manualAverage");

    inputs.forEach(input => {
        input.dataset.rawValue = "";
        input.value = decimalPrecision === 1 ? "0.0" : "0.00";
    });

    if (averageEl) {
        averageEl.textContent = "-";
    }

    if (inputs.length > 0) {
        inputs[0].focus();
    }
}


// ========================================
// LOGIN TOAST
// ========================================

function showLoginToast(user) {
    const toast = document.getElementById("loginToast");
    const message = document.getElementById("loginToastMessage");

    if (!toast || !message) return;

    message.textContent =
        `Selamat datang, ${user.username}!`;

    toast.classList.remove(
        "-translate-y-5",
        "opacity-0"
    );

    toast.classList.add(
        "translate-y-0",
        "opacity-100"
    );

    setTimeout(() => {
        toast.classList.remove(
            "translate-y-0",
            "opacity-100"
        );

        toast.classList.add(
            "-translate-y-5",
            "opacity-0"
        );
    }, 3000);
}


// ========================================
// LOGIN
// ========================================

function handleLogin(e) {
    e.preventDefault();

    const usernameInput = document.getElementById("username");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("loginBtn");
    const loginError = document.getElementById("loginError");

    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    loginError.classList.add("hidden");

    usernameInput.classList.remove(
        "border-red-500",
        "ring-red-100"
    );

    passwordInput.classList.remove(
        "border-red-500",
        "ring-red-100"
    );

    loginBtn.disabled = true;
    loginBtn.textContent = "Checking...";

    setTimeout(() => {
        const user = USERS.find(
            u =>
                u.username === username &&
                u.password === password
        );

        if (user) {
            localStorage.setItem(
                "loggedUser",
                JSON.stringify(user)
            );

            localStorage.setItem(
                "loginTime",
                Date.now()
            );


            showApp(user);
            showLoginToast(user);

            loginBtn.disabled = false;
            loginBtn.textContent = "LOGIN";
        } else {
            loginError.classList.remove("hidden");

            usernameInput.classList.add(
                "border-red-500",
                "ring-red-100"
            );

            passwordInput.classList.add(
                "border-red-500",
                "ring-red-100"
            );

            loginBtn.disabled = false;
            loginBtn.textContent = "LOGIN";
        }
    }, 400);
}


// ========================================
// SHOW APPLICATION
// ========================================

function showApp(user) {
    const loginThemeToggle = document.getElementById("loginThemeToggle");
    const loginPage = document.getElementById("loginPage");
    const appPage = document.getElementById("appPage");

    loginPage.classList.add("hidden");

    if (loginThemeToggle) {
        loginThemeToggle.classList.add("hidden");
    }

    appPage.classList.remove("hidden");
    appPage.classList.add("flex");

    const userText =
        `${user.username} (${user.role})`;

    document.getElementById(
        "headerUserDisplay"
    ).textContent = userText;

    document.getElementById(
        "sidebarUserDisplay"
    ).textContent = userText;

    startClock();
}


// ========================================
// LOGOUT MODAL
// ========================================

function handleLogout() {
    closeSidebar();
    openLogoutModal();
}

function openLogoutModal() {
    const modal = document.getElementById("logoutModal");
    const modalCard = document.getElementById("logoutModalCard");

    if (!modal || !modalCard) return;

    modal.classList.remove("hidden");
    modal.classList.add("flex");

    requestAnimationFrame(() => {
        modalCard.classList.remove(
            "scale-95",
            "opacity-0"
        );

        modalCard.classList.add(
            "scale-100",
            "opacity-100"
        );
    });
}

function closeLogoutModal() {
    const modal = document.getElementById("logoutModal");
    const modalCard = document.getElementById("logoutModalCard");

    if (!modal || !modalCard) return;

    modalCard.classList.remove(
        "scale-100",
        "opacity-100"
    );

    modalCard.classList.add(
        "scale-95",
        "opacity-0"
    );

    setTimeout(() => {
        modal.classList.add("hidden");
        modal.classList.remove("flex");
    }, 200);
}

function confirmLogout() {
    closeLogoutModal();

    localStorage.removeItem("loggedUser");
    localStorage.removeItem("loginTime");

    const loginPage = document.getElementById("loginPage");
    const appPage = document.getElementById("appPage");
    const loginThemeToggle = document.getElementById("loginThemeToggle");

    appPage.classList.add("hidden");
    appPage.classList.remove("flex");

    loginPage.classList.remove("hidden");

    if (loginThemeToggle) {
        loginThemeToggle.classList.remove("hidden");
    }

    document.getElementById("password").value = "";

    clearInterval(clockInterval);
}

// ========================================
// CLOCK
// ========================================

function startClock() {
    clearInterval(clockInterval);

    function tick() {
        const now = new Date();

        const timeText = now.toLocaleString("id-ID", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit"
        });

        document.getElementById("headerClock").textContent =
            timeText;
    }

    tick();

    clockInterval = setInterval(tick, 1000);
}


// ========================================
// SESSION CHECK
// ========================================

function checkSession() {
    const userData = localStorage.getItem("loggedUser");
    const loginTime = localStorage.getItem("loginTime");

    if (!userData || !loginTime) {
        return null;
    }

    const elapsedTime = Date.now() - Number(loginTime);

    if (elapsedTime >= SESSION_DURATION) {
        localStorage.removeItem("loggedUser");
        localStorage.removeItem("loginTime");

        return null;
    }

    try {
        return JSON.parse(userData);
    } catch (error) {
        localStorage.removeItem("loggedUser");
        localStorage.removeItem("loginTime");

        return null;
    }
}

window.onload = function () {
    loadTheme();

    const user = checkSession();

    if (!user) return;

    showApp(user);
};

// ========================================
// RANDOM VALUE
// ========================================

function randomValue(min, max) {
    return parseFloat(
        (
            Math.random() * (max - min) + min
        ).toFixed(decimalPrecision)
    );
}


// ========================================
// SKELETON LOADING
// ========================================

function showSkeleton(id) {
    const container = document.getElementById(id);

    container.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const div = document.createElement("div");

        div.className =
            "skeleton-box h-11 animate-pulse rounded-xl";

        if (i === 5) {
            div.classList.add("mt-2");
        }

        container.appendChild(div);
    }
}


// ========================================
// AUTO VALUE BOX
// ========================================

function createBoxes(dryId, wetId) {
    const dryEl = document.getElementById(dryId);
    const wetEl = document.getElementById(wetId);

    dryEl.innerHTML = "";
    wetEl.innerHTML = "";

    const dryValues = [];
    const wetValues = [];

    for (let i = 0; i < 5; i++) {
        const wet = randomValue(4.15, 4.40);
        const dry = randomValue(wet + 0.05, 4.70);

        dryValues.push(dry);
        wetValues.push(wet);

        const dryBox = document.createElement("div");

        dryBox.className =
            "value-box opacity-0 translate-y-3";

        dryBox.textContent =
            dry.toFixed(decimalPrecision);

        dryEl.appendChild(dryBox);

        requestAnimationFrame(() => {
            dryBox.classList.remove(
                "opacity-0",
                "translate-y-3"
            );

            dryBox.classList.add(
                "opacity-100",
                "translate-y-0"
            );
        });

        const wetBox = document.createElement("div");

        wetBox.className =
            "value-box opacity-0 translate-y-3";

        wetBox.textContent =
            wet.toFixed(decimalPrecision);

        wetEl.appendChild(wetBox);

        requestAnimationFrame(() => {
            wetBox.classList.remove(
                "opacity-0",
                "translate-y-3"
            );

            wetBox.classList.add(
                "opacity-100",
                "translate-y-0"
            );
        });
    }

    const avgDry =
        dryValues.reduce((a, b) => a + b, 0) /
        dryValues.length;

    const avgWet =
        wetValues.reduce((a, b) => a + b, 0) /
        wetValues.length;

    const dryAvgBox = document.createElement("div");

    dryAvgBox.className =
        "average-box mt-2 flex h-11 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm";

    dryAvgBox.textContent =
        avgDry.toFixed(decimalPrecision);

    dryEl.appendChild(dryAvgBox);

    const wetAvgBox = document.createElement("div");

    wetAvgBox.className =
        "average-box mt-2 flex h-11 items-center justify-center rounded-xl text-sm font-bold text-white shadow-sm";

    wetAvgBox.textContent =
        avgWet.toFixed(decimalPrecision);

    wetEl.appendChild(wetAvgBox);
}


// ========================================
// GENERATE
// ========================================

function handleGenerate() {
    if (inputMode !== "auto") return;

    const btn = document.getElementById("generateBtn");

    if (btn.disabled) return;

    btn.disabled = true;
    btn.textContent = "Processing...";

    showSkeleton("A_dry");
    showSkeleton("A_wet");
    showSkeleton("B_dry");
    showSkeleton("B_wet");

    setTimeout(() => {
        createBoxes("A_dry", "A_wet");
        createBoxes("B_dry", "B_wet");

        btn.disabled = false;
        btn.textContent = "GENERATE";
    }, 1000);
}