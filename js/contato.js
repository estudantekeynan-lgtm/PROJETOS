const contactForm = document.querySelector('#contact-form');

contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.querySelector('#fname').value.trim();

    alert(`Muito obrigado por entrar em contato, ${name}!`);

    contactForm.reset();
});