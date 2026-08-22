// ========================================
// USERS
// ========================================

const USERS = [
    {
        username: "Faozan",
        password: "katakuri88",
        role: "Admin"
    },
    {
        username: "Anton",
        password: "015576",
        role: "User"
    },
    {
        username: "Risma",
        password: "031059",
        role: "User"
    },
    {
        username: "Neng",
        password: "013180",
        role: "User"
    }
];


// ========================================
// SETTINGS
// ========================================

let decimalPrecision = 2;
let inputMode = "auto";

let manualValues = [
    "",
    "",
    "",
    "",
    ""
];

const INACTIVE_BUTTON_CLASS =
    "rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm font-semibold text-slate-600 transition active:scale-[0.98]";

const ACTIVE_BUTTON_CLASS =
    "rounded-xl bg-slate-800 px-3 py-3 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98]";


// ========================================
// DECIMAL PRECISION
// ========================================

function setDecimal(decimal) {
    decimalPrecision = decimal;

    const btn1 = document.getElementById("decimal1Btn");
    const btn2 = document.getElementById("decimal2Btn");

    btn1.className = INACTIVE_BUTTON_CLASS;
    btn2.className = INACTIVE_BUTTON_CLASS;

    if (decimal === 1) {
        btn1.className = ACTIVE_BUTTON_CLASS;
    } else {
        btn2.className = ACTIVE_BUTTON_CLASS;
    }

    if (inputMode === "manual") {
        renderManualInputs();
        calculateManualInput();
    }
}


// ========================================
// INPUT MODE
// ========================================

function setInputMode(mode) {
    inputMode = mode;

    const autoBtn = document.getElementById("autoModeBtn");
    const manualBtn = document.getElementById("manualModeBtn");
    const generateBtn = document.getElementById("generateBtn");

    autoBtn.className = INACTIVE_BUTTON_CLASS;
    manualBtn.className = INACTIVE_BUTTON_CLASS;

    if (mode === "auto") {
        autoBtn.className = ACTIVE_BUTTON_CLASS;

        document.getElementById("sampleA").classList.remove("hidden");
        document.getElementById("sampleB").classList.remove("hidden");
        document.getElementById("manualInputArea").classList.add("hidden");

        generateBtn.classList.remove("hidden");
        generateBtn.textContent = "GENERATE";
    } else {
        manualBtn.className = ACTIVE_BUTTON_CLASS;

        document.getElementById("sampleA").classList.add("hidden");
        document.getElementById("sampleB").classList.add("hidden");
        document.getElementById("manualInputArea").classList.remove("hidden");

        generateBtn.classList.add("hidden");

        renderManualInputs();
        calculateManualInput();
    }
}


// ========================================
// MANUAL INPUT
// ========================================

function renderManualInputs() {
    const container = document.getElementById("manualValuesContainer");

    container.innerHTML = "";

    manualValues.forEach((value, index) => {
        const input = document.createElement("input");

        input.type = "text";
        input.inputMode = "decimal";
        input.autocomplete = "off";
        input.value = value;

        input.placeholder =
            decimalPrecision === 1 ? "0.0" : "0.00";

        input.className =
            "manual-value-input h-14 w-full rounded-2xl border border-slate-300 bg-white px-4 text-center text-lg font-semibold text-slate-700 shadow-sm outline-none transition focus:border-slate-700 focus:ring-2 focus:ring-slate-200";

        input.addEventListener("input", function () {
            let inputValue = this.value;

            inputValue = inputValue.replace(/,/g, ".");
            inputValue = inputValue.replace(/[^0-9.]/g, "");

            const parts = inputValue.split(".");

            if (parts.length > 2) {
                inputValue =
                    parts[0] +
                    "." +
                    parts.slice(1).join("");
            }

            this.value = inputValue;
            manualValues[index] = inputValue;

            calculateManualInput();
        });

        input.addEventListener("keydown", function (event) {
            if (event.key === "Enter") {
                event.preventDefault();

                const inputs =
                    document.querySelectorAll(".manual-value-input");

                const nextInput = inputs[index + 1];

                if (nextInput) {
                    nextInput.focus();
                }
            }
        });

        container.appendChild(input);
    });
}


function clearManualValues() {
    manualValues = [
        "",
        "",
        "",
        "",
        ""
    ];

    renderManualInputs();
    calculateManualInput();

    const firstInput =
        document.querySelector(".manual-value-input");

    if (firstInput) {
        firstInput.focus();
    }
}


function calculateManualInput() {
    const error =
        document.getElementById("manualError");

    const averageElement =
        document.getElementById("manualAverage");

    const values = manualValues
        .filter(value => value !== "" && value !== ".")
        .map(value => Number(value));

    if (values.length === 0) {
        averageElement.textContent = "-";
        error.classList.add("hidden");
        return;
    }

    if (values.some(value => !Number.isFinite(value))) {
        error.textContent =
            "Pastikan semua nilai menggunakan format angka yang benar.";

        error.classList.remove("hidden");
        averageElement.textContent = "-";
        return;
    }

    const average =
        values.reduce((total, value) => total + value, 0)
        / values.length;

    averageElement.textContent =
        average.toFixed(decimalPrecision);

    error.classList.add("hidden");
}


// ========================================
// LOGIN
// ========================================

function handleLogin(event) {
    event.preventDefault();

    const usernameInput =
        document.getElementById("username");

    const passwordInput =
        document.getElementById("password");

    const loginBtn =
        document.getElementById("loginBtn");

    const loginError =
        document.getElementById("loginError");

    const username =
        usernameInput.value.trim();

    const password =
        passwordInput.value;

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
        const user = USERS.find(user =>
            user.username === username &&
            user.password === password
        );

        if (user) {
            localStorage.setItem(
                "loggedUser",
                JSON.stringify(user)
            );

            showApp(user);

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
    const loginPage =
        document.getElementById("loginPage");

    const appPage =
        document.getElementById("appPage");

    loginPage.classList.add("hidden");
    appPage.classList.remove("hidden");
    appPage.classList.add("flex");

    const userText =
        `👤 ${user.username} (${user.role})`;

    document.getElementById("userDisplay").textContent =
        userText;

    document.getElementById("mobileUserDisplay").textContent =
        userText;

    startClock();
}


// ========================================
// LOGOUT
// ========================================

function handleLogout() {
    localStorage.removeItem("loggedUser");

    const loginPage =
        document.getElementById("loginPage");

    const appPage =
        document.getElementById("appPage");

    appPage.classList.add("hidden");
    appPage.classList.remove("flex");

    loginPage.classList.remove("hidden");

    document.getElementById("password").value = "";
}


// ========================================
// CLOCK
// ========================================

let clockInterval;

function startClock() {
    clearInterval(clockInterval);

    function updateClock() {
        const now = new Date();

        const timeText =
            now.toLocaleString("id-ID", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit"
            });

        document.getElementById("clock").textContent =
            timeText;

        document.getElementById("mobileClock").textContent =
            timeText;
    }

    updateClock();

    clockInterval =
        setInterval(updateClock, 1000);
}


// ========================================
// RANDOM VALUE
// ========================================

function randomValue(min, max) {
    return Number(
        (
            Math.random() * (max - min) + min
        ).toFixed(decimalPrecision)
    );
}


// ========================================
// LOADING SKELETON
// ========================================

function showSkeleton(id) {
    const container =
        document.getElementById(id);

    container.innerHTML = "";

    for (let i = 0; i < 6; i++) {
        const box =
            document.createElement("div");

        box.className =
            "h-11 animate-pulse rounded-xl bg-slate-200";

        if (i === 5) {
            box.classList.add("mt-2");
        }

        container.appendChild(box);
    }
}


// ========================================
// CREATE AUTO VALUES
// ========================================

function createBoxes(dryId, wetId) {
    const dryEl =
        document.getElementById(dryId);

    const wetEl =
        document.getElementById(wetId);

    dryEl.innerHTML = "";
    wetEl.innerHTML = "";

    const dryValues = [];
    const wetValues = [];

    for (let i = 0; i < 5; i++) {
        const wet =
            randomValue(4.15, 4.40);

        const dry =
            randomValue(wet + 0.05, 4.70);

        dryValues.push(dry);
        wetValues.push(wet);

        const dryBox =
            document.createElement("div");

        dryBox.className =
            "flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm";

        dryBox.textContent =
            dry.toFixed(decimalPrecision);

        dryEl.appendChild(dryBox);


        const wetBox =
            document.createElement("div");

        wetBox.className =
            "flex h-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-sm font-semibold text-slate-700 shadow-sm";

        wetBox.textContent =
            wet.toFixed(decimalPrecision);

        wetEl.appendChild(wetBox);
    }

    const avgDry =
        dryValues.reduce(
            (total, value) => total + value,
            0
        ) / dryValues.length;

    const avgWet =
        wetValues.reduce(
            (total, value) => total + value,
            0
        ) / wetValues.length;


    const dryAverage =
        document.createElement("div");

    dryAverage.className =
        "mt-2 flex h-11 items-center justify-center rounded-xl bg-slate-800 text-sm font-bold text-white shadow-sm";

    dryAverage.textContent =
        avgDry.toFixed(decimalPrecision);

    dryEl.appendChild(dryAverage);


    const wetAverage =
        document.createElement("div");

    wetAverage.className =
        "mt-2 flex h-11 items-center justify-center rounded-xl bg-slate-800 text-sm font-bold text-white shadow-sm";

    wetAverage.textContent =
        avgWet.toFixed(decimalPrecision);

    wetEl.appendChild(wetAverage);
}


// ========================================
// GENERATE / CALCULATE
// ========================================

function handleGenerate() {
    const btn = document.getElementById("generateBtn");

    if (btn.disabled || inputMode !== "auto") {
        return;
    }

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


// ========================================
// SESSION CHECK
// ========================================

window.onload = function () {
    const saved =
        localStorage.getItem("loggedUser");

    if (saved) {
        try {
            const user = JSON.parse(saved);
            showApp(user);
        } catch (error) {
            localStorage.removeItem("loggedUser");
        }
    }
};