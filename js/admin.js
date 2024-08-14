const url = 'http://192.168.0.248:8080/admin/api/orders/';
const productsUrl = 'http://192.168.0.248:8080/api/products/';
const addToCartUrl = 'http://192.168.0.248:8080/admin/api/cart/add/';

function getOrders(url) {
    const request = new Request(url, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    fetch(request)
    .then(response => response.json().then(list => {
        list.forEach(order => {
            
            let tableBody = document.getElementById('tbody');
        
            if (order.orderStatus == 'SHIPPED') {
                tableBody = document.getElementById('tbody_SHIPPED');
            } else if (order.orderStatus == 'AWAITING_SHIPMENT') {
                tableBody = document.getElementById('tbody_AWAITING');
            }

            const row = document.createElement('tr');
            tableBody.appendChild(row);

            const id = document.createElement('td');

            id.className = 'col-md-auto';
            id.innerHTML = order.id;

            row.appendChild(id);

            const date = document.createElement('td');

            date.className = 'col-md-auto';
            date.innerText = order.date;

            row.appendChild(date);

            const name = document.createElement('td');

            name.className = 'col-md-auto';
            name.innerHTML = order.firstName + ' ' + order.lastName;

            row.appendChild(name);

            const email = document.createElement('td');

            email.className = 'col-md-auto';
            email.innerHTML = order.email;

            row.appendChild(email);

            const address = document.createElement('td');

            address.className = 'col-md-auto';
            address.innerHTML = order.address;

            row.appendChild(address);

            const country = document.createElement('td');

            country.className = 'col-md-auto';
            country.innerHTML = order.country;

            row.append(country);

            const state = document.createElement('td');

            state.className = 'col-md-auto';
            state.innerHTML = order.state;

            row.appendChild(state);

            const city = document.createElement('td');
            city.className = 'col-md-auto';
            city.innerText = order.city;

            row.appendChild(city);

            const products = document.createElement('td');

            products.className = 'col-md-auto';

            let cartItems = [];
            let addedItems = [];
            let removedItems = [];

            order.orderedItems.forEach(cartItem => {
                cartItems.push(cartItem);
                products.innerHTML += '<small class="text-muted">(id: ' + cartItem.product.id + ')</small> ' + cartItem.product.name + ' <small class="text-muted">(qty) ' + cartItem.quantity + '</small><br>';
            })

            row.appendChild(products);

            const status = document.createElement('td');

            status.className = 'col-md-auto';
            status.innerHTML = order.orderStatus;

            row.appendChild(status);

            const editButton = document.createElement('td');

            editButton.className = 'col-md-auto';
            editButton.innerHTML = '<a class="btn btn-outline-dark mt-auto" data-bs-toggle="modal" data-bs-target="#editModal" href="#"><i class="bi bi-pencil-fill"></i></a>';

            const modalTitle = document.getElementById('editModalLabel');
            const firstNameInput = document.getElementById('firstNameInput');
            const lastNameInput = document.getElementById('lastNameInput');
            const emailInput = document.getElementById('emailInput');
            const addressInput = document.getElementById('addressInput');
            const countryInput = document.getElementById('countryInput');
            const cityInput = document.getElementById('cityInput');
            const stateInput = document.getElementById('stateInput');
            const zipInput = document.getElementById('zipInput');
            const statusSelect = document.getElementById('statusSelect');
            const productContainer = document.getElementById('productContainer');
            const total = document.getElementById('total');
            const addProductButton = document.getElementById('addProductButton');
            const modalButton = document.getElementById('editModalButton');

            editButton.addEventListener('click', event => {
                event.preventDefault();

                modalTitle.innerText = 'Edit order #' + order.id;
                
                firstNameInput.value = order.firstName;
                lastNameInput.value = order.lastName;
                emailInput.value = order.email;
                addressInput.value = order.address;
                countryInput.value = order.country;
                stateInput.value = order.state;
                cityInput.value = order.city;
                zipInput.value = order.zipCode;
                statusSelect.value = order.orderStatus;

                productContainer.innerHTML = '';

                let sum = 0;

                cartItems.forEach(cartItem => {
                    sum += cartItem.product.price * cartItem.quantity;

                    const productLi = document.createElement('li');
                    productLi.className = 'list-group-item d-flex justify-content-between lh-condensed';
                    productLi.innerHTML = '<div><h6 class="my-0">' + cartItem.product.name + '</h6><small class="text-muted">x' + cartItem.quantity + '</small></div><span class="text-muted">' + cartItem.quantity + ' x $' + cartItem.product.price + ' = ' + cartItem.product.price * cartItem.quantity + '</span>';

                    const deleteButton = document.createElement('a');
                    deleteButton.href = '#';
                    deleteButton.innerHTML = '<i class="bi bi-x-lg text-danger"></i>';

                    productLi.appendChild(deleteButton);

                    deleteButton.addEventListener('click', event => {
                        event.preventDefault();

                        productLi.classList.add('d-none');
                        sum -= cartItem.product.price * cartItem.quantity;

                        const removedItem = {
                            orderId: order.id,
                            orderedItemId: cartItem.id
                        }

                        removedItems.push(removedItem);
                    });

                    productContainer.appendChild(productLi);
                });

                total.innerText = '$' + sum;

                addProductButton.addEventListener('click', event => {
                    event.preventDefault();

                    document.getElementById('toBeAddedTable').classList.remove('d-none');
                    document.getElementById('addProductTable').classList.remove('d-none');

                    const idSelect = document.getElementById('idSelect');

                    const getProductsRequest = new Request(productsUrl);
                    fetch(getProductsRequest)
                    .then(response => response.json().then(productList => productList.forEach(product => {
                        const option = document.createElement('option');
                        option.value = product.id;
                        option.innerText = product.id;

                        idSelect.appendChild(option);
                    })));

                    let productToAdd;

                    idSelect.addEventListener('change', event => {
                        event.preventDefault();
                        
                        const request = new Request(productsUrl + idSelect.value);
                        fetch(request).then(response => response.json().then(product => {
                            productToAdd = product;

                            document.getElementById('productName').innerHTML = product.name;
                            document.getElementById('productPrice').innerHTML = product.price;
                            document.getElementById('productQuantity').innerHTML = '<input type="number" placeholder="(max ' + product.quantity + ')" id="quantityInput"></input>';
                        }));
                    });

                    const addButton = document.getElementById('addButton');

                    addButton.addEventListener('click', event => {
                        event.preventDefault();

                        const quantity = document.getElementById('quantityInput')

                        let orderedItemId = null;

                        order.orderedItems.forEach(item => {
                            if (item.product.id == productToAdd.id) {
                                orderedItemId = item.id;
                            }
                        });

                        const addedItem = {
                            orderId: order.id,
                            orderedItemId: orderedItemId,
                            productId: productToAdd.id,
                            quantity: parseInt(quantity.value)
                        }

                        const toBeAddedProductContainer = document.getElementById('toBeAddedProductContainer');

                        const toBeAddedProductLi = document.createElement('li');
                        toBeAddedProductLi.className = 'list-group-item d-flex justify-content-between lh-condensed';
                        toBeAddedProductLi.innerHTML = '<div><h6 class="my-0">' + productToAdd.name + '</h6><small class="text-muted">x' + quantity.value + '</small></div><span class="text-muted">' + quantity.value + ' x $' + productToAdd.price + ' = ' + productToAdd.price * quantity.value + '</span>';
    
                        const deleteButton = document.createElement('a');
                        deleteButton.href = '#';
                        deleteButton.innerHTML = '<i class="bi bi-x-lg text-danger"></i>';

                        deleteButton.addEventListener('click', event => {
                            event.preventDefault();

                            addedItems.splice(addedItems.indexOf(addedItem), 1);

                            toBeAddedProductLi.classList.add('d-none');
                        });
                        
                        toBeAddedProductLi.appendChild(deleteButton);

                        toBeAddedProductContainer.appendChild(toBeAddedProductLi);

                        addedItems.push(addedItem);
                    });
    
                });

                modalButton.innerText = 'Save';

                modalButton.addEventListener('click', event => {
                   event.preventDefault();

                    addedItems.forEach(addedItem => {
                        const request = new Request(url + 'addProduct', {
                            method: 'POST',
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(addedItem)
                        });

                        console.log("Body: \n" + JSON.stringify(addedItem));

                        fetch(request).then(addedItems = []);
                    });

                    removedItems.forEach(removedItem => {
                        const request = new Request(url + 'removeProduct', {
                            method: 'DELETE',
                            headers: {
                                'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
                                'Accept': 'application/json',
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify(removedItem)
                        });
                        
                        fetch(request).then(removedItems = []);
                    });

                   const request = new Request(url + order.id, {
                        method: 'PUT',
                        headers: {
                            'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
                            'Accept': 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            "userId": order.userId,
                            "firstName": firstNameInput.value,
                            "lastName": lastNameInput.value,
                            "email": emailInput.value,
                            "address": addressInput.value,
                            "country": countryInput.value,
                            "state": stateInput.value,
                            "city": cityInput.value,
                            "zipCode": zipInput.value,
                            "orderStatus": statusSelect.value
                        })
                   });

                   fetch(request).then(window.location.reload());
                });
            });

            row.append(editButton);

            const deleteButton = document.createElement('a');

            deleteButton.className = 'btn btn-outline-dark mt-auto';
            deleteButton.href = '#';
            deleteButton.innerHTML = '<i class="bi bi-trash-fill"></i>'

            deleteButton.addEventListener('click', event => {
                event.preventDefault();

                const request = new Request(url + order.id, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    }
                })

                fetch(request).then(window.location.reload());
            })

            editButton.append(' ', deleteButton);
        });
    }));
}

window.addEventListener('load', event => {
    event.preventDefault();

    if (localStorage.getItem('username') != 'admin') {
        window.location.replace('index.html');
    } else {
        getOrders(url);
    }
});