const registerUrl = 'http://192.168.0.248:8080/auth/register';
const loginUrl = 'http://192.168.0.248:8080/auth/login';

let isLoggedIn = false;

function register() {
    const email = document.getElementById('email').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const errorMessage = document.getElementById('errorMessage');

    const request = new Request(registerUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "email": email,
            "username": username,
            "password": password
        })
    });

    fetch(request)
        .then(response => response.json())
        .then(response => {
            console.log(response);
            if(response.error) {
                errorMessage.innerHTML = response.message;
                errorMessage.classList.remove('d-none');
            } else if(response.success) {
                console.log(response.success);

                login();
            }
        })
        .catch(error => console.log(error));
}

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const errorMessage = document.getElementById('errorMessage');

    const request = new Request(loginUrl, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "username": username,
            "password": password
        })
    });

    fetch(request)
        .then(response => response.json())
        .then(response => {
            if(response.error) {
                errorMessage.innerHTML = response.message;
                errorMessage.classList.remove('d-none');
            } else if (response.jwt) {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('id', response.id);
                localStorage.setItem('username', username);
                localStorage.setItem('jwt', response.jwt);

                if (username === 'admin') {
                    window.location.replace('admin.html');
                } else {
                    window.location.replace('index.html');
                }
            }
        });
}

const registerButton = document.getElementById('register');
if(registerButton) {
    registerButton.addEventListener('click', event => {
        event.preventDefault();
        register();
    });
}

const loginButton = document.getElementById('login');
if(loginButton) {
    loginButton.addEventListener('click', event => {
        event.preventDefault();
        login();
    });
}
