const url = 'http://192.168.0.248:8080/api/products/';
const productUrl = 'http://192.168.0.248:8080/admin/api/product/';

function getProducts() {
    const request = new Request(url);

    const tableBody = document.getElementById('tbody');

    fetch(request)
    .then(response => response.json().then(products => {
        products.forEach(product => {
            const row = document.createElement('tr');
            tableBody.appendChild(row);

            const id = document.createElement('td');
            id.innerHTML = '<h5>' + product.id + '</h5>';
            row.appendChild(id);

            const element = document.createElement('td');

            element.className = 'row';
            element.innerHTML = '<div class="col-md-auto"><img width="225" height="150" src=' + product.imageUrl +'></div>' +
            '<div class="col-md-auto"><h5>' + product.name +'</h5></div>';

            row.appendChild(element);

            const price = document.createElement('td');
            price.innerHTML = '<h5>' + product.price + '$</h5>';

            row.appendChild(price);

            const quantity = document.createElement('td');

            quantity.innerHTML = '<h5>' + product.quantity + '</h5>';
            
            row.appendChild(quantity);

            const sale = document.createElement('td');
            
            sale.innerHTML = '<h5>' + product.onSale + '</h5>';

            row.appendChild(sale);

            const oldPrice = document.createElement('td');

            oldPrice.innerHTML = '<h5>' + product.oldPrice + '$</h5>';

            row.appendChild(oldPrice);

            const container = document.createElement('td');

            const editButton = document.createElement('button');
            editButton.className = 'btn btn-outline-dark mt-auto';
            editButton.setAttribute('data-bs-toggle', 'modal');
            editButton.setAttribute('data-bs-target', '#editModal')
            editButton.href = '#';
            editButton.innerHTML = '<i class="bi bi-pencil-fill"></i>';
            

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-outline-dark mt-auto';
            deleteButton.setAttribute('data-bs-toggle', 'modal');
            deleteButton.setAttribute('data-bs-target', '#deleteModal')
            deleteButton.href = '#';
            deleteButton.innerHTML = '<i class="bi bi-trash-fill"></i>';

            container.appendChild(editButton);
            container.appendChild(deleteButton);

            row.appendChild(container);

            const modalTitle = document.getElementById('editModalLabel');
            const nameInput = document.getElementById('nameInput');
            const imageInput = document.getElementById('imageInput');
            const priceInput = document.getElementById('priceInput');
            const quantityInput = document.getElementById('quantityInput');
            const saleSelect = document.getElementById('saleSelect');
            const oldPriceInput = document.getElementById('oldPriceInput');
            const modalButton = document.getElementById('editModalButton');

            editButton.addEventListener('click', event => {
                event.preventDefault();

                modalTitle.innerText = 'Edit product #' + product.id;

                nameInput.value = product.name;
                imageInput.value = product.imageUrl;
                priceInput.value = product.price;
                quantityInput.value = product.quantity;
                saleSelect.value = product.onSale;
                oldPriceInput.value = product.oldPrice;

                modalButton.innerText = 'Save';

                modalButton.addEventListener('click', event => {
                    event.preventDefault();

                    const request = new Request(productUrl + product.id, {
                        method: 'PUT',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "name": nameInput.value,
                            "imageUrl": imageInput.value,
                            "price": priceInput.value,
                            "oldPrice": oldPriceInput.value,
                            "quantity": quantityInput.value,
                            "onSale": saleSelect.value,
                        })
                    });

                    fetch(request).then(window.location.reload());
                });
            });

            const deleteModalBody = document.getElementById('deleteModalBody');
            const deleteModalButton = document.getElementById('deleteModalButton');            

            deleteButton.addEventListener('click', event => {
                event.preventDefault();

                deleteModalBody.innerText = 'Are you sure you want to delete ' + product.name + '(id: ' + product.id + ')?';
                deleteModalButton.addEventListener('click', event => {
                    event.preventDefault();

                    const request = new Request(productUrl + product.id, {
                        method: 'DELETE',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        }
                    });

                    fetch(request).then(window.location.reload());
                });
            });
        });
    }));
}

window.addEventListener('load', getProducts);


const addNameInput = document.getElementById('addNameInput');
const addImageInput = document.getElementById('addImageInput');
const addPriceInput = document.getElementById('addPriceInput');
const addQuantityInput = document.getElementById('addQuantityInput');
const addSaleSelect = document.getElementById('addSaleSelect');
const addOldPriceInput = document.getElementById('addOldPriceInput');
const addModalButton = document.getElementById('addModalButton');

document.getElementById('addProductButton').addEventListener('click', event => {
    event.preventDefault();

    addModalButton.addEventListener('click', event => {
        event.preventDefault();
        
        const request = new Request(productUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                "name": addNameInput.value,
                "imageUrl": addImageInput.value,
                "price": addPriceInput.value,
                "oldPrice": addOldPriceInput.value,
                "quantity": addQuantityInput.value,
                "onSale": addSaleSelect.value,
            })
        });

        fetch(request).then(window.location.reload());
    });
});

