"use strict";

/*======================================================
    VARIABLES GLOBALES
======================================================*/

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => document.querySelectorAll(selector);

const body = document.body;
const header = $("header");

/*======================================================
    INICIALIZACIÓN
    (antes estas llamadas estaban comentadas y las
    funciones ni siquiera existían: la barra de progreso,
    el resaltado del link activo y el efecto de scroll del
    header nunca se ejecutaban aunque el CSS ya los soportaba)
======================================================*/
document.addEventListener("DOMContentLoaded", () => {

    createProgressBar();

    setActiveMenu();

    initNavbar();

    initHamburgerMenu();

});

/*==================================================
  BARRA DE PROGRESO DE SCROLL
==================================================*/

function createProgressBar() {

    const bar = document.createElement("div");

    bar.className = "progress-bar";

    document.body.appendChild(bar);

    const updateProgress = () => {

        const scrollTop = window.scrollY;

        const docHeight =
            document.documentElement.scrollHeight - window.innerHeight;

        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

        bar.style.width = progress + "%";

    };

    window.addEventListener("scroll", updateProgress, { passive: true });

    updateProgress();

}

/*==================================================
  LINK ACTIVO SEGÚN LA PÁGINA ACTUAL
==================================================*/

function setActiveMenu() {

    const currentFile =
        window.location.pathname.split("/").pop() || "index.html";

    $$(".menu a").forEach(link => {

        const linkFile = link.getAttribute("href").split("/").pop();

        if (linkFile === currentFile) {

            link.classList.add("active");
            link.setAttribute("aria-current", "page");

        }

    });

}

/*==================================================
  EFECTO DE SCROLL EN EL HEADER
==================================================*/

function initNavbar() {

    if (!header) {
        return;
    }

    const toggleHeaderScroll = () => {

        if (window.scrollY > 40) {

            header.classList.add("header-scroll");

        } else {

            header.classList.remove("header-scroll");

        }

    };

    window.addEventListener("scroll", toggleHeaderScroll, { passive: true });

    toggleHeaderScroll();

}

/*==================================================
  MENÚ HAMBURGUESA
==================================================*/

function initHamburgerMenu() {

    const nav = $("#nav");
    const hamburger = $(".hamburger");

    if (!nav || !hamburger) {
        return;
    }

    const closeMenu = () => {

        nav.classList.remove("nav-open");
        hamburger.classList.remove("is-active");
        hamburger.setAttribute("aria-expanded", "false");
        hamburger.setAttribute("aria-label", "Abrir menú");

    };

    const openMenu = () => {

        nav.classList.add("nav-open");
        hamburger.classList.add("is-active");
        hamburger.setAttribute("aria-expanded", "true");
        hamburger.setAttribute("aria-label", "Cerrar menú");

    };

    hamburger.addEventListener("click", () => {

        if (nav.classList.contains("nav-open")) {

            closeMenu();

        } else {

            openMenu();

        }

    });

    // Cerrar al hacer click en un link del menú
    nav.querySelectorAll(".menu a").forEach(link => {

        link.addEventListener("click", closeMenu);

    });

    // Cerrar con la tecla Escape
    document.addEventListener("keydown", (e) => {

        if (e.key === "Escape") {
            closeMenu();
        }

    });

    // Si se agranda la ventana y vuelve a vista de escritorio, cerrar el menú
    window.addEventListener("resize", () => {

        if (window.innerWidth > 900) {
            closeMenu();
        }

    });

}


/*==================================================
  REVEAL ANIMATIONS
==================================================*/

const revealElements = document.querySelectorAll(`
    .destacado-card,
    .servicio,
    .galeria article,
    .mision-vision article,
    .dato,
    .mapa,
    .formulario,
    .reserva-bar,
    .valores li
`);

const prefersReducedMotion =
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (prefersReducedMotion) {

    revealElements.forEach(element => element.classList.add("visible"));

} else {

    const revealObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.15
    });

    revealElements.forEach(element => {

        element.classList.add("reveal");
        revealObserver.observe(element);

    });

}


/*==================================================
  HERO PARALLAX
==================================================*/

const hero = document.querySelector(".bienvenida");

if (hero && !prefersReducedMotion) {

    hero.addEventListener("mousemove", e => {

        const rect = hero.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width - .5;
        const y = (e.clientY - rect.top) / rect.height - .5;

        hero.style.backgroundPosition =
            `${50 + x * 3}% ${50 + y * 3}%`;

        hero.querySelectorAll("h1,p,button").forEach((item, index) => {

            item.style.transform =
                `translate(${x * 12 * (index + 1)}px,
                           ${y * 12 * (index + 1)}px)`;

        });

    });

    hero.addEventListener("mouseleave", () => {

        hero.style.backgroundPosition = "center";

        hero.querySelectorAll("h1,p,button").forEach(item => {

            item.style.transform = "";

        });

    });

}


/*==================================================
  CONTADORES
==================================================*/

const counters = document.querySelectorAll(".dato h3");

const counterObserver = new IntersectionObserver(entries => {

    entries.forEach(entry => {

        if (entry.isIntersecting) {

            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);

        }

    });

}, {
    threshold: .6
});

counters.forEach(counter => {

    counterObserver.observe(counter);

});


function animateCounter(element) {

    const original = element.textContent.trim();

    if (original.includes("/")) {
        return;
    }

    if (prefersReducedMotion) {
        return;
    }

    const target = parseInt(original.replace(/\D/g, ""));

    if (isNaN(target)) {
        return;
    }

    let current = 0;

    const duration = 1800;

    const increment = target / (duration / 16);

    const timer = setInterval(() => {

        current += increment;

        if (current >= target) {

            current = target;
            clearInterval(timer);

        }

        if (original.includes("+")) {

            element.textContent =
                Math.floor(current).toLocaleString("es-AR") + "+";

        } else {

            element.textContent =
                Math.floor(current).toLocaleString("es-AR");

        }

    }, 16);

}

/*==================================================
  BARRA DE RESERVAS
==================================================*/

const checkIn = $("#checkin");
const checkOut = $("#checkout");
const reservaForm = document.querySelector(".reserva-bar");

if (checkIn && checkOut) {

    const hoy = new Date();

    const formato = (fecha) => {
        const y = fecha.getFullYear();
        const m = String(fecha.getMonth() + 1).padStart(2, "0");
        const d = String(fecha.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    };

    checkIn.min = formato(hoy);
    checkIn.value = formato(hoy);

    const manana = new Date();
    manana.setDate(hoy.getDate() + 1);

    checkOut.min = formato(manana);
    checkOut.value = formato(manana);

    checkIn.addEventListener("change", () => {

        const entrada = new Date(checkIn.value);
        entrada.setDate(entrada.getDate() + 1);

        checkOut.min = formato(entrada);

        if (checkOut.value <= checkIn.value) {
            checkOut.value = formato(entrada);
        }

    });

}

if (reservaForm) {

    reservaForm.addEventListener("submit", (e) => {

        e.preventDefault();

        const reservaBtn = reservaForm.querySelector(".btn-reserva");

        showToast("Buscando disponibilidad...");

        reservaBtn.disabled = true;
        reservaBtn.textContent = "Buscando...";

        setTimeout(() => {

            reservaBtn.disabled = false;
            reservaBtn.textContent = "Ver disponibilidad";

            showToast("No hay conexión con el motor de reservas.");

        }, 1800);

    });

}


/*==================================================
  FORMULARIO DE CONTACTO
==================================================*/

const form = document.querySelector("#contact-form");

if (form) {

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const telRegex = /^[0-9+\s()-]{6,}$/;

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const nombre = document.querySelector("#nombre");
        const telefono = document.querySelector("#telefono");
        const email = document.querySelector("#email");
        const comentarios = document.querySelector("#comments");

        if (
            nombre.value.trim() === "" ||
            telefono.value.trim() === "" ||
            email.value.trim() === "" ||
            comentarios.value.trim() === ""
        ) {

            showToast("Completá todos los campos.");

            return;

        }

        if (!telRegex.test(telefono.value.trim())) {

            showToast("Revisá el número de teléfono ingresado.");
            telefono.focus();

            return;

        }

        if (!emailRegex.test(email.value.trim())) {

            showToast("Revisá el email ingresado.");
            email.focus();

            return;

        }

        const boton = document.querySelector("#btnEnviar");

        boton.value = "Enviando...";
        boton.disabled = true;

        setTimeout(() => {

            boton.value = "Enviar";
            boton.disabled = false;

            showToast("¡Consulta enviada correctamente!");

            form.reset();

        }, 1600);

    });

}


/*==================================================
  EFECTO RIPPLE
==================================================*/

const rippleButtons = document.querySelectorAll(`
button,
.btn-reserva,
input[type="submit"],
input[type="reset"],
.whatsapp-float
`);

rippleButtons.forEach(button => {

    // Solo forzamos "relative" si el elemento no tiene ya su propio
    // posicionamiento (fixed/absolute/sticky), para no romper el
    // position:fixed del botón de WhatsApp ni el de "volver arriba".
    const currentPosition = getComputedStyle(button).position;

    if (currentPosition === "static") {
        button.style.position = "relative";
    }

    button.style.overflow = "hidden";

    button.addEventListener("click", function (e) {

        if (prefersReducedMotion) {
            return;
        }

        const circle = document.createElement("span");

        circle.className = "ripple";

        const size = Math.max(this.clientWidth, this.clientHeight);

        circle.style.width = size + "px";
        circle.style.height = size + "px";

        circle.style.left = (e.offsetX - size / 2) + "px";
        circle.style.top = (e.offsetY - size / 2) + "px";

        this.appendChild(circle);

        setTimeout(() => {

            circle.remove();

        }, 650);

    });

});


/*==================================================
  TOAST
==================================================*/

function showToast(message) {

    let toast = document.querySelector(".toast");

    if (!toast) {

        toast = document.createElement("div");

        toast.className = "toast";
        toast.setAttribute("role", "status");
        toast.setAttribute("aria-live", "polite");

        document.body.appendChild(toast);

    }

    toast.textContent = message;

    toast.classList.add("show");

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {

        toast.classList.remove("show");

    }, 2600);

}


/*==================================================
  BOTÓN VOLVER ARRIBA
==================================================*/

const backTop = document.createElement("button");

backTop.innerHTML = "↑";
backTop.type = "button";
backTop.setAttribute("aria-label", "Volver arriba");

backTop.className = "back-top";

document.body.appendChild(backTop);

window.addEventListener("scroll", () => {

    if (window.scrollY > 500) {

        backTop.classList.add("show");

    } else {

        backTop.classList.remove("show");

    }

}, { passive: true });

backTop.addEventListener("click", () => {

    window.scrollTo({

        top: 0,
        behavior: prefersReducedMotion ? "auto" : "smooth"

    });

});


/*==================================================
  LAZY LOADING DE IMÁGENES
==================================================*/

document.querySelectorAll("img").forEach(img => {

    if (!img.hasAttribute("loading")) {

        img.loading = "lazy";

    }

});


/*==================================================
  EFECTO 3D EN TARJETAS
==================================================*/

const cards = document.querySelectorAll(
    ".destacado-card, .servicio, .galeria article"
);

if (!prefersReducedMotion) {

    cards.forEach(card => {

        card.addEventListener("mousemove", e => {

            const rect = card.getBoundingClientRect();

            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const rotateY = ((x / rect.width) - 0.5) * 10;
            const rotateX = ((y / rect.height) - 0.5) * -10;

            card.style.transform =
                `perspective(900px)
                 rotateX(${rotateX}deg)
                 rotateY(${rotateY}deg)
                 translateY(-8px)`;

        });

        card.addEventListener("mouseleave", () => {

            card.style.transform = "";

        });

    });

}


/*==================================================
  ANIMACIÓN DEL LOGO
==================================================*/

const logo = document.querySelector(".logo");

if (logo && !prefersReducedMotion) {

    logo.addEventListener("mouseenter", () => {

        logo.animate([

            { transform: "rotate(0deg) scale(1)" },
            { transform: "rotate(-4deg) scale(1.08)" },
            { transform: "rotate(4deg) scale(1.08)" },
            { transform: "rotate(0deg) scale(1)" }

        ], {

            duration: 450,
            easing: "ease-out"

        });

    });

}


/*==================================================
  AÑO AUTOMÁTICO EN FOOTER
==================================================*/

const footerYear = document.querySelector("footer .footer-year");

if (footerYear) {

    footerYear.textContent =
        `© ${new Date().getFullYear()} Loitel Hoteles - Todos los derechos reservados.`;

}


/*==================================================
  PRELOADER
==================================================*/

window.addEventListener("load", () => {

    document.body.classList.add("loaded");

});