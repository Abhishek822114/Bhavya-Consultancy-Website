  
// Mobile menu toggle (optional enhancement if you later add burger menu)
function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

// Jobs loader
async function loadJobs() {
  const container = document.getElementById('jobs-container');
  if (!container) return;
  try {
    const res = await fetch('assets/data/jobs.json');
    const jobs = await res.json();
    const rows = jobs.map(j => `
      <tr>
        <td><strong>${j.title}</strong><div class="small">${j.company}</div></td>
        <td>${j.location}</td>
        <td>${j.eligibility}</td>
        <td>₹${j.salary_min.toLocaleString()}–₹${j.salary_max.toLocaleString()}</td>
        <td><a class="btn btn-primary" href="contact.html?job=${encodeURIComponent(j.title)}">Apply</a></td>
      </tr>
    `).join('');
    container.innerHTML = `<table>
      <thead><tr><th>Role</th><th>Location</th><th>Eligibility</th><th>Salary</th><th>Action</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>`;
  } catch (e) {
    container.innerHTML = '<div class="notice">Could not load jobs. Please refresh.</div>';
  }
}

// Handle contact form (uses Formspree or mailto fallback)
function hookContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    // If action has FORM_ID, let it submit normally to Formspree
    if (form.action.includes('formspree.io/f/')) return;
    e.preventDefault();
    const name = form.querySelector('[name=name]').value;
    const email = form.querySelector('[name=email]').value;
    const phone = form.querySelector('[name=phone]').value;
    const msg = form.querySelector('[name=message]').value;
    const subject = 'Enquiry from Website';
    const body = `Name: ${name}%0D%0AEmail: ${email}%0D%0APhone: ${phone}%0D%0A%0D%0A${msg}`;
    window.location.href = `mailto:${form.dataset.mailto}?subject=${subject}&body=${body}`;
  });
}

// Pre-fill message if job param present
function prefillFromQuery() {
  const params = new URLSearchParams(window.location.search);
  const job = params.get('job');
  const msg = document.querySelector('textarea[name=message]');
  if (job && msg) {
    msg.value = `I would like to apply for: ${job}\nPlease guide me for next steps.`;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadJobs();
  hookContactForm();
  prefillFromQuery();
});
