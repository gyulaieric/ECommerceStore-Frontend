const url = 'http://192.168.0.248:8080/api/cart/';
const orderUrl = 'http://192.168.0.248:8080/api/orders/'

let orderedItems = [];

function getCart() {
    let sum = 0;

    const request = new Request(url, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    fetch(request)
    .then(response => response.json().then(list => {
        list.forEach(cartItem => {
            const orderedItem = {
                quantity: cartItem.quantity,
                product: cartItem.product
            }

            orderedItems.push(orderedItem);

            sum += cartItem.product.price * cartItem.quantity;

            const total = document.getElementById('total');
            total.innerText = '$' + sum;

            const cartContainer = document.getElementById('cartContainer');
            const cartProduct = document.createElement('li');
            cartProduct.className = 'list-group-item d-flex justify-content-between lh-condensed';
            cartProduct.innerHTML = '<div><h6 class="my-0">' + cartItem.product.name + '</h6><small class="text-muted">x' + cartItem.quantity + '</small></div><span class="text-muted">$' + cartItem.product.price + '</span>';
            cartContainer.appendChild(cartProduct);
        });
    }));
}

window.addEventListener('load', getCart());

const form = document.getElementById('form');

form.addEventListener('submit', event => {
    event.preventDefault();

    const firstName = document.getElementById('firstName');
    const lastName = document.getElementById('lastName');
    const email = document.getElementById('email');
    const address = document.getElementById('address');
    const address2 = document.getElementById('address2');
    const country = document.getElementById('country');
    const state = document.getElementById('state');
    const city = document.getElementById('city');
    const zip = document.getElementById('zip');

    const orderRequest = new Request(orderUrl, {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "userId": localStorage.getItem('id'),
            "firstName": firstName.value,
            "lastName": lastName.value,
            "email": email.value,
            "address": address.value + ' ' + address2.value,
            "country": country.value,
            "state": state.value,
            "city": city.value,
            "zipCode": zip.value,
            "orderedItems": orderedItems,
            "orderStatus": 0
        })
    });

    if (form.checkValidity() === true) {
        fetch(orderRequest).then(response => response.json()).then(response => {
            document.getElementById('formContainer').classList.add('d-none');

            document.getElementById('successText').innerText = 'Successfully placed order with id #' + response;
            document.getElementById('orderSuccessful').classList.remove('d-none');
        });
    }
});