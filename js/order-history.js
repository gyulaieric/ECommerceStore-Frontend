const url = 'http://192.168.0.248:8080/api/orders/';

function getOrders() {
    const request = new Request(url, {
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('jwt'), 
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    });

    const tableBody = document.getElementById('tbody');

    fetch(request).then(response => response.json().then(list => {
        list.forEach(order => {
            const row = document.createElement('tr');

            row.appendChild(document.createElement('td')).innerText = order.id;
            row.appendChild(document.createElement('td')).innerText = order.orderStatus;
            row.appendChild(document.createElement('td')).innerText = order.date;
            row.appendChild(document.createElement('td')).innerText = order.orderedItems.length;
            row.appendChild(document.createElement('td')).innerText = order.firstName + ' ' + order.lastName;

            let total = 0;

            order.orderedItems.forEach(orderedItem => {
                total += orderedItem.product.price * orderedItem.quantity;
            });

            row.appendChild(document.createElement('td')).innerText = '$' + total; 
            
            const viewButton = document.createElement('a');
            viewButton.href = 'order.html?orderId=' + order.id;
            viewButton.className = 'btn btn-primary';
            viewButton.innerHTML = '<i class="bi bi-eye-fill"></i>';

            row.appendChild(document.createElement('td')).appendChild(viewButton);

            tableBody.append(row);
        });
    }));
}



window.addEventListener('load', event => {
    event.preventDefault();
    
    getOrders();
});