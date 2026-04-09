const toggle = document.getElementById("menu-toggle")
const nav = document.getElementById("nav-list")

toggle.addEventListener("click", () => {
    nav.classList.toggle("active")
})

