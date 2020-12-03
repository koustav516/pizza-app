import axios from 'axios'
import Noty from 'noty'
import { admin } from './admin'
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
admin(socket);
if(order){
    socket.emit('join',`order_${order._id}`)
}

let adminAreaPath = window.location.pathname;
if(adminAreaPath.includes('admin')) {
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