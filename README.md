# Rocky Mountain Nightlights

Static website for Rocky Mountain Nightlights (permanent architectural lighting, landscape lighting, and seasonal Christmas & holiday lighting), with a quote request form.

- `index.html`: page content (services, pricing, add-ons, quote form)
- `styles.css`: styling
- `script.js`: form validation and submission
- `images/`: photos

## Receiving quote requests

**Netlify (easiest):** deploy this folder to Netlify. The form is already set up for Netlify Forms.
Submissions appear under *Forms* in the Netlify dashboard, where you can turn on email notifications.

**Any other host (GitHub Pages, etc.):** create a free form at https://formspree.io, then paste its
endpoint into `FORM_ENDPOINT` at the top of `script.js`.

## Local preview

    python3 -m http.server 8000

Then open http://localhost:8000. The form can't be submitted during a local preview.
