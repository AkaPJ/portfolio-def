export function initNavbarScroll() {
    const links = document.querySelectorAll('.scroll-link');
    const contact = document.querySelector('.botoncontact');

    links.forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault()
            const target = document.querySelector(this.getAttribute('href'))
            target.scrollIntoView({ behavior: 'smooth' })
        })
    })

    contact.addEventListener('click', function(event) {
        event.preventDefault()
        const target = document.querySelector(this.getAttribute('href'))
        target.scrollIntoView({ behavior: 'smooth' })
    })
}