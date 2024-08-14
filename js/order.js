const url = 'http://192.168.0.248:8080/api/orders/';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const orderId = urlParams.get('orderId');

const tableBodyDetails = document.getElementById('tbodyDetails');
const tableBodyAddresses = document.getElementById('tbodyAddresses');
const tableBodyProducts = document.getElementById('tbodyProducts');

const request = new Request(url + orderId, {
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem('jwt'),
        'Accept': 'application/json',
        'Content-Type': 'application/json'
    }
});

fetch(request).then(response => response.json().then(order => {
    const detailsRow = document.createElement('tr');

    detailsRow.appendChild(document.createElement('td')).innerHTML = '<p><b>Order ID: </b>' + order.id + '</p><p><b>Date: </b>' + order.date + '</p>';
    detailsRow.appendChild(document.createElement('td')).innerHTML = '<p><b>Payment method: </b>Online with card</p>' +
                                                                     '<p><b>Delivery Method: </b>Free shipping via Fan Courier</p>' + 
                                                                     '<p><b>AWB Number: </b>9485435710154</p>' + 
                                                                     '<p><b>Tracking: </b><a href="https://www.fancourier.ro/en/awb-tracking/">https://www.fancourier.ro/en/awb-tracking/</a></p>';


    tableBodyDetails.appendChild(detailsRow);

    const addressesRow = document.createElement('tr');

    addressesRow.appendChild(document.createElement('td')).innerHTML = '<p>' + order.firstName + ' ' + order.lastName + '</p>' + 
                                                                       '<p>' + order.address + '</p>' + 
                                                                       '<p>' + order.city + ' ' + order.zipCode + '</p>' +
                                                                       '<p>' + order.state + '</p>' +
                                                                       '<p>' + order.country + '</p>';

    addressesRow.appendChild(document.createElement('td')).innerHTML = '<p>' + order.firstName + ' ' + order.lastName + '</p>' + 
                                                                       '<p>' + order.address + '</p>' + 
                                                                       '<p>' + order.city + ' ' + order.zipCode + '</p>' +
                                                                       '<p>' + order.state + '</p>' +
                                                                       '<p>' + order.country + '</p>';

    tableBodyAddresses.appendChild(addressesRow);

    let subtotal = 0;

    order.orderedItems.forEach(orderedItem => {
        const productsRow = document.createElement('tr');

        const totalPrice = orderedItem.product.price * orderedItem.quantity;

        subtotal += totalPrice;

        productsRow.innerHTML = '<td>' + orderedItem.product.name + '</td>' + 
                                '<td>' + orderedItem.product.id + '</td>' +
                                '<td>' + orderedItem.quantity + '</td>' +
                                '<td>' + '$' + orderedItem.product.price + '</td>' +
                                '<td>' + '$' + totalPrice + '</td>';

        tableBodyProducts.appendChild(productsRow);
    });

    const subtotalRow = document.createElement('tr');
    
    subtotalRow.innerHTML = '<td colspan="3"></td>' +
                    '<td>Subtotal</td>' +
                    '<td>' + '$' + subtotal + '</td>';

    const deliveryRow = document.createElement('tr');

    deliveryRow.innerHTML = '<td colspan="3"></td>' +
                            '<td>Delivery</td>' +
                            '<td>' + '$' + '0' + '</td>';

    const totalRow = document.createElement('tr');
    
    totalRow.innerHTML = '<td colspan="3"></td>' +
                         '<td>Total</td>' +
                         '<td>' + '$' + subtotal + '' + '</td>';

    tableBodyProducts.append(subtotalRow, deliveryRow, totalRow);
}));