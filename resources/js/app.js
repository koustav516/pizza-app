import axios from 'axios'
import Noty from 'noty'
import { admin } from './admin'
import { allStores } from './stores'
import moment from 'moment'

const addToCartBtn = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#item-Counter')
const alertMsg = document.querySelector('#success-alert')
let hiddenInput = document.querySelector('#order-hidden')
let statuses = document.querySelectorAll('.status-line')

function updateCart(product) {
    axios.post('/update-cart', product).then(res =>{
        cartCounter.innerText = res.data.totalQuantity;
        new Noty({
            type: 'success',
            timeout: 1000,
            text: 'Item Added to cart',
            progressBar: false
        }).show();
    }).catch(err =>{
        new Noty({
            type: 'error',
            timeout: 2000,
            text: 'Something went wrong',
            progressBar: false
        }).show();
    })
}

addToCartBtn.forEach((btn)=>{
    btn.addEventListener('click', (event)=>{
       let pizza = JSON.parse(btn.dataset.pizza)   //coming from home.ejs
       updateCart(pizza);
    });
})

//Deleting success message after 2 seconds
if(alertMsg) {
    setTimeout(() => {
        alertMsg.remove()
    },2000)
}


//Update status
let order = hiddenInput ? hiddenInput.value : null;
order = JSON.parse(order);
let time = document.createElement('small');
const updateStatus = order => {
    statuses.forEach((status) => {
        status.classList.remove('step-completed')
        status.classList.remove('current')
    })
    let stepCompleted = true
    statuses.forEach((status) => {
        let dataStat = status.dataset.status
        if(stepCompleted) {
            status.classList.add('step-completed')
        }
        if(dataStat === order.orderStatus) {
            stepCompleted = false;
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            status.appendChild(time);
            if(status.nextElementSibling) {
                status.nextElementSibling.classList.add('current')
            }
        }
    });
}

updateStatus(order);

//Socket 
let socket = io()

if(order){
    socket.emit('join',`order_${order._id}`)
}

let adminAreaPath = window.location.pathname;
if(adminAreaPath.includes('admin')) {
    admin(socket);
    socket.emit('join', 'adminRoom')
}

socket.on('orderUpdated', (data)=>{
    const updatedOrder = { ...order } //Copy of order
    updatedOrder.updatedAt = moment().format()
    updatedOrder.orderStatus = data.orderStatus
    updateStatus(updatedOrder);
    new Noty({
        type: 'success',
        timeout: 2000,
        text: 'Order Updated',
        progressBar: false
    }).show();
})    

//All stores

const myMap = L.map('map').setView([22.9074872, 79.07306671], 5);
const tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution =
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';
const tileLayer = L.tileLayer(tileUrl, { attribution });
tileLayer.addTo(myMap); 
const storeList = allStores();

function generateList() {
    const ul = document.querySelector('.list');
    storeList.forEach((shop) => {
        const li = document.createElement('li');
        const div = document.createElement('div');
        const a = document.createElement('a');
        const p = document.createElement('p');
        a.addEventListener('click', () => {
            flyToStore(shop);
    });
    div.classList.add('shop-item');
    a.innerText = shop.properties.name;
    a.href = '#';
    p.innerText = shop.properties.address;

    div.appendChild(a);
    div.appendChild(p);
    li.appendChild(div);
    ul.appendChild(li);
  });
}

generateList();

function makePopupContent(shop) {
  return `
    <div>
        <h4>${shop.properties.name}</h4>
        <p>${shop.properties.address}</p>
        <div class="phone-number">
            <a href="tel:${shop.properties.phone}">${shop.properties.phone}</a>
        </div>
    </div>
  `;
}
function onEachFeature(feature, layer) {
    layer.bindPopup(makePopupContent(feature), { closeButton: false, offset: L.point(0, -8) });
}

var myIcon = L.icon({
    iconUrl: '/assets/images/marker.png',
    iconSize: [30, 40]
});

const shopsLayer = L.geoJSON(storeList, {
    onEachFeature: onEachFeature,
    pointToLayer: function(feature, latlng) {
        return L.marker(latlng, { icon: myIcon });
    }
});
shopsLayer.addTo(myMap);

function flyToStore(store) {
    const lat = store.geometry.coordinates[1];
    const lng = store.geometry.coordinates[0];
    myMap.flyTo([lat, lng], 14, {
        duration: 3
    });
    setTimeout(() => {
        L.popup({closeButton: false, offset: L.point(0, -8)})
        .setLatLng([lat, lng])
        .setContent(makePopupContent(store))
        .openOn(myMap);
    }, 3000);
}



