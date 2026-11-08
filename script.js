/*
COMP 3512
Assignment 1
Ethan Law
*/

import data from "./data-minifed.json" with {type: "json"};

const products = data.products;
const first20 = products.slice(0, 20); //only take the first 20 products from the json

const container = document.querySelector("#product-container");

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
    alert(product.id);
});

//Add to cart button
const button = document.createElement("button");
button.textContent = "Add to cart";

//Display the product id and the title when the thumbnail is clicked
button.addEventListener("click", () => {
    alert(`${product.id} - ${product.title}`);
});

/*
is it fine to add these lines here or would it make more sense for them 
to be with the code where the elements are actually created? Or does it not matter?
*/
item_card.appendChild(image);
item_card.appendChild(title);
item_card.appendChild(price);
item_card.appendChild(button);

}




