/*
COMP 3512
Assignment 1
Ethan Law
*/

import data from "./data-minifed.json" with {type: "json"};

const products = data.products;
const first20 = products.slice(0, 20);

const container = document.querySelector("#product-container");

//loop time yay
first20.forEach(product => {
//card 
const item_card = document.createElement("div");
item_card.classList.add("product-card");
container.appendChild(item_card);

//title of the item
const title = document.createElement("h2");
title.textContent = product.title;
item_card.appendChild(title);

//the price
const price = document.createElement("p");
price.textContent = `$${product.price}`;
item_card.appendChild(price);

//the product image
const image = document.createElement("img");
image.src = product.thumbnail;

//on click display alert
image.addEventListener("click", () => {
    alert(product.id);
});

item_card.appendChild(image);

//the add to cart button
const button = document.createElement("button");
button.textContent = "+";

// on click display alert
button.addEventListener("click", () => {
    alert(`${product.id} - ${product.title}`);
});

item_card.appendChild(button);
});



