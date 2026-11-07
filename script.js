

import data from "./data-minifed.json" with {type: "json"};

const products = data.products;
const product = products[0];
const container = document.querySelector("#product-container");

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

image.addEventListener("click", () => {
    alert(product.id);
});

item_card.appendChild(image);


// playing around with the elemts
/*
const title = document.createElement("h2");
title.textContent = products[0].title;

const price = document.createElement("p");
price.textContent = `$${products[0].price}`;

container.appendChild(title);
container.appendChild(price);
*/

