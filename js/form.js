export function validarForm() {
    const form = document.getElementById('formulario')
    if (!form) return
    const feedbackEl = document.getElementById('form-feedback')

    form.addEventListener('submit', async (event) => {
        event.preventDefault()

        const nombre = form.nombre.value.trim()
        const apellido = form.apellido.value.trim()
        const email = form.email.value.trim()
        const mensaje = form.mensaje.value.trim()

        if (!nombre || !apellido || !email || !mensaje) {
            mostrarMensaje('Por favor, completa todos los campos.', 'error', feedbackEl)
            return
        }

        if (!validarEmail(email)) {
            mostrarMensaje('El email no es válido.', 'error', feedbackEl)
            return
        }

        const data = {nombre, apellido, email, mensaje}

        try {
            const res = await fetch('/enviar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
            const json = await res.json()
             if (json.ok) {
                mostrarMensaje('Formulario enviado correctamente.', 'success', feedbackEl)
                form.reset()
            } else {
                mostrarMensaje('Error al enviar el formulario.', 'error', feedbackEl)
            }
        } catch (error) {
            mostrarMensaje('Error al enviar el formulario.', 'error', feedbackEl)
            return
        }

        mostrarMensaje('Formulario enviado correctamente.', 'success', feedbackEl)
        form.reset()
    })
}

function validarEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return re.test(email)
}

function mostrarMensaje(texto, tipo, elemento) {
    if (!elemento) return
    elemento.textContent = texto
    elemento.style.color = tipo === 'error' ? 'red' : 'green'
}