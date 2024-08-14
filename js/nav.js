fetch('navbar.html')
.then(res => res.text())
.then(text => {
    let oldElem = document.querySelector('script#replace_with_navbar');
    let newElem = document.createElement('div');

    newElem.innerHTML = text;

    oldElem.parentNode.replaceChild(newElem, oldElem);

    const account = document.getElementById('accountDropdown');

    if (localStorage.getItem('isLoggedIn') == 'true') {
        account.innerHTML = localStorage.getItem('username');
        const loginButton = document.getElementById('login');
        const signupButton = document.getElementById('signup');
        const myAccountButton = document.getElementById('account');
        const divider = document.getElementById('divider');
        const signoutButton = document.getElementById('signout');
        const cart = document.getElementById('cart');

        signoutButton.addEventListener('click', event => {
            event.preventDefault();
            signOut();
        });

        loginButton.classList.add('d-none');
        signupButton.classList.add('d-none');

        myAccountButton.classList.remove('d-none');
        divider.classList.remove('d-none');
        signoutButton.classList.remove('d-none');

        cart.classList.remove('d-none');

        if (localStorage.getItem('username') == 'admin') {
            const homeButton = document.getElementById('homeButton');
            const shopButton = document.getElementById('shopButton');

            homeButton.href = 'admin.html';
            homeButton.innerHTML = 'Orders';

            shopButton.classList.remove('dropdown');
            shopButton.innerHTML = '<a class="nav-link active" id="homeButton" aria-current="page" href="products.html">Products</a>';

            cart.classList.add('d-none');
        }
    }
});

function signOut() {
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('id');
    localStorage.removeItem('username');
    localStorage.removeItem('jwt');

    window.location.replace('index.html');
}