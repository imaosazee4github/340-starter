const toggle = document.getElementById("menu-toggle")
const nav = document.getElementById("nav-list")

if (toggle && nav) {
  toggle.addEventListener("click", () => {
    nav.classList.toggle("active")
})
}
  const togglePassword = document.querySelector("#togglePassword")
  const password = document.querySelector("#account_password")


  if (togglePassword && password) {
    togglePassword.addEventListener("click", function () {
    const type = password.getAttribute("type") === "password" ? "text" : "password"
    password.setAttribute("type", type)

    // Optional: change icon
    this.textContent = type === "password" ? "👁" : "🙈"
  })

  }