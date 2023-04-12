async function login(event) {
    event.preventDefault();
    const email = document.getElementById('form-email').value;
    const password = document.getElementById('form-password').value;

    api.post('/auth/login', {
        email,
        password,
    })
}