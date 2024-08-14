const addToCartUrl = 'http://192.168.0.248:8080/api/cart/';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get('productId');

const request = new Request('http://localhost:8080/api/products/' + productId);

fetch(request)
.then(response => response.json())
.then(product => {
    document.title = product.name;

    document.getElementById('productName').innerText = product.name;

    document.getElementById('productId').innerText = 'ID: ' + product.id;

    const priceContainer = document.getElementById('productPrice');

    if (product.onSale) {
        priceContainer.innerHTML += '<span class="text-decoration-line-through">$' + product.oldPrice + '</span> ';
    }

    priceContainer.innerHTML += '<span>$' + product.price + '</span>';

    document.getElementById('productDescription').innerText = product.description;

    const addToCartButton = document.getElementById('addToCartButton');

    const modalTitle = document.getElementById('cartModalLabel');
    const modalBody = document.getElementById('cartModalBody');
    const modalButton = document.getElementById('cartModalButton');
    const modalButtonWrapper = document.getElementById('cartModalButtonWrapper');

    addToCartButton.addEventListener('click', event => {
        event.preventDefault();

        if(localStorage.getItem('jwt')) {     
            const addToCartRequest = new Request(addToCartUrl + product.id, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });

            fetch(addToCartRequest);

            modalTitle.innerText = 'Sucess!';
            modalBody.innerText = 'Item successfully added to cart!';
            modalButtonWrapper.href = 'cart.html';
            modalButton.innerHTML = '<i class="bi-cart-fill me-1"></i> View Cart';
        } else {
            modalTitle.innerText = 'Cannot add item to cart.';
            modalBody.innerText = 'Please Log In!';
            modalButtonWrapper.href = 'login.html';
            modalButton.innerText = 'Log In';
        }
    });
});