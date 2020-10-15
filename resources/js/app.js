import axios from 'axios'
import Noty from 'noty'

const addToCartBtn = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#item-Counter')

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