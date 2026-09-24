// Where quote requests are sent.
// Leave empty when hosting on Netlify: Netlify Forms picks up the form automatically.
// To use Formspree (or a similar service) on any other host, paste its endpoint here,
// e.g. "https://formspree.io/f/abcdwxyz".
const FORM_ENDPOINT = "";

const PHONE_DISPLAY = "720.776.5331";
const PHONE_LINK = "tel:+17207765331";

document.getElementById("year").textContent = new Date().getFullYear();

const form = document.getElementById("quote-form");
const statusEl = form.querySelector(".form-status");
const serviceSelect = document.getElementById("service");

// "Quote ... Lighting" buttons preselect the matching lighting type.
document.querySelectorAll("[data-service]").forEach((btn) => {
  btn.addEventListener("click", () => {
    serviceSelect.value = btn.dataset.service;
  });
});

function validate() {
  let firstInvalid = null;
  form.querySelectorAll("[required]").forEach((input) => {
    const field = input.closest(".field");
    const ok = input.value.trim() !== "" && input.checkValidity();
    field.classList.toggle("invalid", !ok);
    if (!ok && !firstInvalid) firstInvalid = input;
  });
  if (firstInvalid) firstInvalid.focus();
  return !firstInvalid;
}

form.addEventListener("input", (e) => {
  const field = e.target.closest(".field.invalid");
  if (field && e.target.checkValidity() && e.target.value.trim() !== "") {
    field.classList.remove("invalid");
  }
});

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  statusEl.className = "form-status";
  statusEl.textContent = "";

  if (!validate()) {
    statusEl.classList.add("error");
    statusEl.textContent = "Please fill in the highlighted fields.";
    return;
  }

  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  button.textContent = "Sending…";

  const data = new FormData(form);

  try {
    let res;
    if (FORM_ENDPOINT) {
      res = await fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data,
      });
    } else {
      res = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(data).toString(),
      });
    }
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    const name = (data.get("name") || "").toString().trim().split(" ")[0];
    form.innerHTML = `
      <div class="form-success">
        <h3>Thank you${name ? ", " + escapeHtml(name) : ""}!</h3>
        <p>Your quote request is on its way. We'll be in touch shortly.</p>
        <p>Need us sooner? Call <a href="${PHONE_LINK}">${PHONE_DISPLAY}</a>.</p>
      </div>`;
  } catch (err) {
    statusEl.classList.add("error");
    statusEl.innerHTML = `Sorry, something went wrong sending your request. Please call us at <a href="${PHONE_LINK}">${PHONE_DISPLAY}</a>.`;
    button.disabled = false;
    button.textContent = "Send My Quote Request";
  }
});

function escapeHtml(str) {
  return str.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}
