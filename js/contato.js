const contactForm = document.querySelector('#contact-form');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const name = document.querySelector('#fname').value.trim();

  contactForm.reset();
  alert(`Muito obrigado por entrar em contato ${name}`);
});
