const url = 'http://192.168.0.248:8080/api/cart/';

function getCart(userId) {
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
        if (list.length == 0) {
            document.getElementById('emptyCart').classList.remove('d-none');
            document.getElementById('tableContainer').classList.add('d-none');
            return;
        }

        list.forEach(cartItem => {
            sum += cartItem.product.price * cartItem.quantity;
            
            const caption = document.getElementById('caption');
            caption.innerText = 'Total: $' + sum;

            const tableBody = document.getElementById('tbody');

            const row = document.createElement('tr');
            tableBody.appendChild(row);

            const element = document.createElement('td');

            element.className = 'row';
            element.innerHTML = '<div class="col-md-auto"><img width="225" height="150" src=' + cartItem.product.imageUrl +'></div>' +
                                '<div class="col-md-auto"><h5>' + cartItem.product.name +'</h5></div>';

            row.appendChild(element);
            row.appendChild(document.createElement('td')).innerHTML = '$' + cartItem.product.price;

            const quantityInputTd = document.createElement('td');

            const quantityInput = document.createElement('input');
            quantityInput.type = 'number';
            quantityInput.value = cartItem.quantity;
            quantityInput.min = '1';
            quantityInput.max = '99';

            quantityInputTd.appendChild(quantityInput);
            
            row.appendChild(quantityInputTd);

            const buttonContainer = document.createElement('td');

            const deleteButton = document.createElement('button');
            deleteButton.className = 'btn btn-danger float-end';
            deleteButton.innerHTML = '<i class="bi bi-x-lg"/>'
            buttonContainer.appendChild(deleteButton);

            const refreshButton = document.createElement('button');
            refreshButton.className = 'btn btn-primary float-end';
            refreshButton.innerHTML = '<i class="bi bi-arrow-clockwise"/>'
            buttonContainer.appendChild(refreshButton);

            row.appendChild(buttonContainer);

            refreshButton.addEventListener('click', event => {
                event.preventDefault();
                console.log('id' + cartItem.id);

                const request = new Request(url + cartItem.id, {
                    method: 'PUT',
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: quantityInput.value
                });

                fetch(request).then(window.location.reload());
            });
            
            deleteButton.addEventListener('click', event => {
                event.preventDefault();
                const request = new Request(url + cartItem.id, {
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
    }));
}

window.addEventListener('load', getCart(localStorage.getItem('id')));