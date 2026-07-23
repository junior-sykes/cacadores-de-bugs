/* ==========================================================================
   Caçadores de Bugs e Erros - JavaScript
   Interactive functionality, category filtering & Netlify Form handler
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initCategoryFilters();
  initNetlifyForm();
  initDealCTAs();
});

/* Mobile Menu Toggle */
function initMobileMenu() {
  const toggleBtn = document.getElementById('mobile-menu-btn');
  const navMenu = document.getElementById('nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('open');
      const isOpen = navMenu.classList.contains('open');
      toggleBtn.setAttribute('aria-expanded', isOpen);
      toggleBtn.innerHTML = isOpen ? '✕' : '☰';
    });

    // Close menu when clicking links
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        toggleBtn.innerHTML = '☰';
        toggleBtn.setAttribute('aria-expanded', 'false');
      });
    });
  }
}

/* Category Filter Logic */
function initCategoryFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const dealCards = document.querySelectorAll('.deal-card');

  if (filterBtns.length === 0 || dealCards.length === 0) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const selectedCategory = btn.getAttribute('data-category');

      // Update active button state
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      // Filter deal cards
      dealCards.forEach(card => {
        const cardCategory = card.getAttribute('data-category');
        if (selectedCategory === 'todos' || cardCategory === selectedCategory) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}

/* Netlify Forms Submissions via AJAX */
function initNetlifyForm() {
  const leadForm = document.getElementById('alertas-form');
  const successMessage = document.getElementById('form-success');

  if (!leadForm) return;

  leadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = leadForm.querySelector('.btn-submit-lead');
    const originalBtnText = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<span>Enviando...</span>`;

    const formData = new FormData(leadForm);

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formData).toString()
      });

      if (response.ok) {
        leadForm.reset();
        leadForm.style.display = 'none';
        if (successMessage) {
          successMessage.style.display = 'block';
        }
        showToast('Inscrição realizada com sucesso! Você receberá nossos alertas VIP.');
      } else {
        throw new Error('Falha no envio');
      }
    } catch (err) {
      console.error('Erro ao enviar formulário:', err);
      showToast('Ocorreu um erro ao cadastrar. Tente novamente.');
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }
  });
}

/* Toast Notification Helper */
function showToast(message) {
  let toastContainer = document.querySelector('.toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>🎯</span> <div>${message}</div>`;

  toastContainer.appendChild(toast);

  setTimeout(() => toast.classList.add('show'), 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* Deal CTA Links Handler */
function initDealCTAs() {
  const dealButtons = document.querySelectorAll('.btn-deal-cta');

  dealButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      const storeName = btn.getAttribute('data-store') || 'loja parceira';
      showToast(`Redirecionando para a ${storeName}... Aproveite o cupom!`);
    });
  });
}
