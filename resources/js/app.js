import axios from 'axios'
const addToCartBtn = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#item-Counter')

function updateCart(product) {
    axios.post('/update-cart', product).then(res =>{
        cartCounter.innerText = res.data.totalQuantity;
    });
}

addToCartBtn.forEach((btn)=>{
    btn.addEventListener('click', (event)=>{
       let pizza = JSON.parse(btn.dataset.pizza)   //coming from home.ejs
       updateCart(pizza);
    });
})