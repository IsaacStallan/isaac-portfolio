// Contact form: posts to Formspree when an ID is set in content.js, otherwise opens a pre-filled email.
export function initContactForm(onSuccess) {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = form.querySelector('.form-status');
  const button = form.querySelector('button[type="submit"]');
  const btnText = button.querySelector('.btn__text');
  const f = form.elements;

  const setStatus = (msg, error = false) => {
    status.textContent = msg;
    status.classList.toggle('is-error', error);
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const checks = [
      [f.name, f.name.value.trim() !== '', 'your name'],
      [f.email, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.value.trim()), 'a valid email'],
      [f.message, f.message.value.trim() !== '', 'a short message'],
    ];
    const missing = checks.filter(([el, ok]) => {
      ok ? el.removeAttribute('aria-invalid') : el.setAttribute('aria-invalid', 'true');
      return !ok;
    });
    if (missing.length) {
      setStatus('Please add ' + missing.map((m) => m[2]).join(', ') + '.', true);
      missing[0][0].focus();
      return;
    }

    const data = {
      name: f.name.value.trim(),
      email: f.email.value.trim(),
      business: f.business.value.trim(),
      message: f.message.value.trim(),
    };

    if (form.action.includes('formspree.io')) {
      button.disabled = true;
      btnText.textContent = 'Sending…';
      try {
        const res = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(res.statusText);
        form.reset();
        btnText.textContent = 'Sent ✓';
        setStatus('Thanks! I’ll get back to you within one business day.');
        onSuccess && onSuccess();
      } catch {
        btnText.textContent = 'Send it';
        setStatus(`That didn’t send. Please email ${form.dataset.email} directly.`, true);
      } finally {
        button.disabled = false;
      }
      return;
    }

    const subject = `Website enquiry from ${data.name}${data.business ? ' (' + data.business + ')' : ''}`;
    const body = `${data.message}\n\n${data.name}\n${data.email}${data.business ? '\n' + data.business : ''}`;
    window.location.href = `mailto:${form.dataset.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setStatus('Opening your email app…');
    onSuccess && onSuccess();
  });
}

// Before/after slider driven by its (visually hidden) range input: mouse, touch and keyboard.
export function initBeforeAfter() {
  const ba = document.querySelector('.ba');
  if (!ba) return;
  const range = ba.querySelector('.ba__range');
  range.addEventListener('input', () => ba.style.setProperty('--pos', range.value + '%'));
}
