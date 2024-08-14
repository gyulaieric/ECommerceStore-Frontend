const url = 'http://192.168.0.248:8080/api/products/';
const addToCartUrl = 'http://192.168.0.248:8080/api/cart/';

function getProducts(url) {
    const request = new Request(url);
    fetch(request)
    .then(response => response.json().then(list => {
        list.forEach(product => {
            const productContainer = document.getElementById('productContainer');

            const column = document.createElement('div');
            column.classList.add('col', 'mb-5');

            const card = document.createElement('div');
            card.classList.add('card', 'h-100');
            column.appendChild(card);

            const cardTop = document.createElement('img');
            cardTop.className = 'card-img-top';
            cardTop.src = product.imageUrl;
            cardTop.alt = '...';
            card.appendChild(cardTop);
            

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body', 'p-4');
            if (product.onSale) {
                const saleBadge = document.createElement('div');
                saleBadge.className = 'badge bg-dark text-white position-absolute';
                saleBadge.style = 'top: 0.5rem; right: 0.5rem';
                saleBadge.innerText = 'Sale';
                card.appendChild(saleBadge);

                cardBody.innerHTML = '<div class="text-center"><a class="text-dark text-decoration-none" href="product.html?productId=' + product.id + '"><h5 class="fw-bolder">' + product.name + '</h5></a><span class="text-muted text-decoration-line-through">$' + product.oldPrice + '</span> $' + product.price + '</div>';
            } else {
                cardBody.innerHTML = '<div class="text-center"><a class="text-dark text-decoration-none" href="product.html?productId=' + product.id + '"><h5 class="fw-bolder">' + product.name + '</h5></a>$' + product.price + '</div>';
            }
            card.appendChild(cardBody);

            const cardFooter = document.createElement('div');
            cardFooter.classList.add('card-footer', 'p-4', 'pt-0', 'border-top-0', 'bg-transparent');
            
            const addToCartButton = document.createElement('div');
            addToCartButton.className = 'text-center';
            addToCartButton.innerHTML = '<a class="btn btn-outline-dark mt-auto" data-bs-toggle="modal" data-bs-target="#cartModal"" href="#">Add to cart</a>';

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
                        },
                        body: 1
                    });

                    fetch(addToCartRequest).then(response => console.log('response status: ' + response.status));

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

            cardFooter.appendChild(addToCartButton);
            card.appendChild(cardFooter);

            productContainer.appendChild(column);
        });
    }));
}

window.addEventListener('load', getProducts(url));