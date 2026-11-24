/*
COMP 3512
Assignment 2
*/

//all data
import data from "./data-minifed.json" with {type: "json"};
const products = data.products;
const first20 = products.slice(0, 20); //only take the first 20 products from the json
let cart = [];

//specific containers
// ******* USED FOR ASSIGNMENT 1 ********
const container = document.querySelector("#product-container");
// **************************************

//single product accessed through the browse page
const singleProductContainer = document.querySelector("#single_product_container");

//shopping cart
const cartContainer = document.querySelector("#cart_container");
const cartCount = document.querySelectorAll("#cart_count");
const cartTotal = document.querySelector("#cart_total")

//Navigation buttons
const homeButton = document.querySelector("#home_button");
const browseButton = document.querySelector("#browse_button");
const cartButton = document.querySelector("#cart_button");
const aboutButton = document.querySelector("#about_button");

// Different Views of the nav bar
const homeView = document.querySelector("#home_view");
const browseView = document.querySelector("#browse_view");
const productView = document.querySelector("#product_view");
const cartView = document.querySelector("#cart_view");

const aboutPopup = document.querySelector("#about_popup")
const closeAbout = document.querySelector("#close_about")

//organizaion for the features
//1. views
//2. local storage
//3. buttons
//4. browse page
//5. individual product page
//6. shopping cart page
//7. about popup

//************** view stuff ****************

function hideViews() {
    homeView.classList.add("hidden");
    browseView.classList.add("hidden");
    productView.classList.add("hidden");
    cartView.classList.add("hidden");
}

function showHomeView() {
    hideViews();

    homeView.classList.remove("hidden");
}

function showBrowseView() {
    hideViews();

    browseView.classList.remove("hidden");
}

function showCartView() {
    hideViews();

    cartView.classList.remove("hidden");
}

function showProductView() {
    hideViews();

    productView.classList.remove("hidden");
}

//******************* local storage *****************
function retrieveStorage() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function updateStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

function removeStorage() {
    localStorage.removeItem("cart");
}

//************** Individual Product ****************

function displayProduct(product) {
        singleProductContainer.replaceChildren();
        showProductView();

        // title
        const title = document.createElement("h2");
        title.textContent = product.title;

        //price 
        const price = document.createElement("p");
        price.textContent = `$${product.price}`;

        //image
        const image = document.createElement("img");
        image.src = product.thumbnail;

        //item description
        const description = document.createElement("p");
        description.textContent = product.description;

        //add to cart button
        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Add to Cart";

        addToCartButton.addEventListener("click", () => {
        alert(product.title);
        });

        //display order
        singleProductContainer.appendChild(image);
        singleProductContainer.appendChild(title);
        singleProductContainer.appendChild(price);
        singleProductContainer.appendChild(description);
        singleProductContainer.appendChild(addToCartButton);

}

//**************** Nav Buttons ******************

homeButton.addEventListener("click", () => {
    showHomeView();
});

browseButton.addEventListener("click", () => {
    showBrowseView();
});

cartButton.addEventListener("click", () => {
    showCartView();
});
/*
aboutButton.addEventListener("click", () => {
    //dont forget about the about popup
});
*/

//browse page

//************* cart page ****************
function addToCart(product) { //this function and displayCart are based on the code from lab9 test 03.
    let existingItem = null;

    for (const item of cart) {
        if (item.product.id === product.id) {
            existingItem = item;
        }
    }

    if (existingItem) {
        existingItem.quantity++;
    } else {
        const newItem = {
            product: product,
            quantity: 1
        };
        
        cart.push(newItem);
    }
    updateStorage();
    displayCart();
}

function displayCart() {
    cartContainer.replaceChildren();

    let totalItems = 0;
    let totalPrice = 0;

    for (const item of cart) {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        const title = document.createElement("p");
        title.textContent = `${item.product.title} x ${item.quantity}`;

        const price = document.createElement("p");
        price.textContent = `$${(item.product.price * item.quantity).toFixed(2)}`;

        cartItem.appendChild(title);
        cartItem.appendChild(price);

        cartContainer.appendChild(cartItem);

        totalItems += item.quantity;
        totalPrice += item.product.price * item.quantity;
    }

    cartCount.textContent = `Items: ${totalItems}`;
    cartTotal.textContent = `Total: $${totalPrice.toFixed(2)}`;
}


//loop time yay
for (const product of first20) {
console.log(product.title);

//Individual Product Card
const item_card = document.createElement("div");
item_card.classList.add("product-card");
container.appendChild(item_card);

//Product Title
const title = document.createElement("h2");
title.textContent = product.title;

//Product Price
const price = document.createElement("p");
price.textContent = `$${product.price}`;

//Product Image
const image = document.createElement("img");
image.src = product.thumbnail;

//Display the product id when the thumbnail is clicked
image.addEventListener("click", () => {
    displayProduct(product);
});

//Add to cart button
const button = document.createElement("button");
button.textContent = "Add to cart";

//Display the product id and the title when the thumbnail is clicked
button.addEventListener("click", () => {
    addToCart(product);
});

item_card.appendChild(image);
item_card.appendChild(title);
item_card.appendChild(price);
item_card.appendChild(button);

}

cart = retrieveStorage();
displayCart();
showHomeView();