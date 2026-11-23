/*
COMP 3512
Assignment 2
*/

// data import
import data from "./data-minifed.json" with {type: "json"};
const products = data.products;
const first20 = products.slice(0, 20); //only take the first 20 products from the json

//specific containers
// ******* USED FOR ASSIGNMENT 1 ********
const container = document.querySelector("#product-container");
// **************************************
const singleProductContainer = document.querySelector("#single_product_container");

//all buttons
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
//2. buttons
//3. browse page
//4. individual product page
//5. shopping cart page
//6. about popup

//**************view stuff****************

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

        //display order
        singleProductContainer.appendChild(image);
        singleProductContainer.appendChild(title);
        singleProductContainer.appendChild(price);
        singleProductContainer.appendChild(description);

}

//****************Buttons******************

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

//product page

//cart page


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
    alert(`${product.id} - ${product.title}`);
});

item_card.appendChild(image);
item_card.appendChild(title);
item_card.appendChild(price);
item_card.appendChild(button);

}

showHomeView();