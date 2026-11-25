/*
COMP 3512
Assignment 2
*/

//data arrays
let cart = [];
let products = [];

//specific containers
// ******* USED FOR ASSIGNMENT 1 ********
const container = document.querySelector("#product-container");
// **************************************

//single product accessed through the browse page
const singleProductContainer = document.querySelector("#single_product_container");

//shopping cart
const cartContainer = document.querySelector("#cart_container");
const cartCount = document.querySelector("#cart_count");
const cartTotal = document.querySelector("#cart_total")
const merchandiseTotal = document.querySelector("#merchandise_total");
const shippingTotal = document.querySelector("#shipping_total");
const taxTotal = document.querySelector("#tax_total");

const shippingMethod = document.querySelector("#shipping_method");
const shippingDestination = document.querySelector("#shipping_destination");

const checkoutButton = document.querySelector("#checkout_button");

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
//3. nav buttons
//4. event listeners
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

//******************* local cart storage *****************
function retrieveStorage() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function updateStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ************** local all product storage ***************

function retrieveProductFromStorage() {
    return JSON.parse(localStorage.getItem("products")) || [];
}

function updateProductsToStorage() {
    localStorage.setItem("products", JSON.stringify(products));
}

async function loadAllProducts() {
    console.log("getting products");
    products = retrieveProductFromStorage();

    if (products.length > 0) {
        displayProducts(products);

        return;
    }
    try {
        const response = await fetch("https://dummyjson.com/products?limit=100");

        if (response.ok) {
            const data = await response.json(); 

            products = data.products;
            console.log(products);
            updateProductsToStorage();

            displayProducts(products);
        } else {
            console.error(error);
        }
    }
    catch {
        console.error(error);
    }
}

//************** Individual Product ****************

function displayIndividualProduct(product) {
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
            addToCart(product);
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

aboutButton.addEventListener("click", () => {
    aboutPopup.showModal();
});

closeAbout.addEventListener("click", () => {
    aboutPopup.close();
})



//************ event listeners *********
shippingMethod.addEventListener("change", () => {
    displayCart();
});

shippingDestination.addEventListener("change", () => {
    displayCart();
});

checkoutButton.addEventListener("click", () => {
    checkout();
});

//******************** browse page********************

// function to display all of the products
function displayProducts(products) {

    container.replaceChildren();

    for (const product of products) {

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
        displayIndividualProduct(product);
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
}


//************* cart page ****************
function addToCart(product) { //this function and displayCart are based on the code from labs
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

        const imageSection = document.createElement("div");
        const titleSection = document.createElement("div");
        const priceSection = document.createElement("div");
        const quantitySection = document.createElement("div");
        const subtotalSection = document.createElement("div");

        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");

        const title = document.createElement("p"); //item name
        title.textContent = item.product.title;

        const price = document.createElement("p"); //price per item
        price.textContent = `Price: $${(item.product.price)}`;

        const quantity = document.createElement("p"); //quantity of item
        quantity.textContent = `Quantity: ${item.quantity}`;

        const subtotal = document.createElement("p"); //subtotal of items
        subtotal.textContent = `Subtotal: $${(item.product.price * item.quantity).toFixed(2)}`;

        const image = document.createElement("img"); //item thumbnail
        image.src = item.product.thumbnail;

        // Delete button 
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "DELETE"
        deleteButton.dataset.id = item.product.id;

        deleteButton.addEventListener("click", deleteCartItem);

        imageSection.appendChild(image);
        titleSection.appendChild(title);
        priceSection.appendChild(price);
        quantitySection.appendChild(quantity);
        subtotalSection.appendChild(subtotal);

        cartItem.appendChild(deleteButton);
        cartItem.appendChild(imageSection);
        cartItem.appendChild(titleSection);
        cartItem.appendChild(priceSection);
        cartItem.appendChild(quantitySection);
        cartItem.appendChild(subtotalSection);

        imageSection.classList.add("cart_image");
        titleSection.classList.add("cart_title");
        priceSection.classList.add("cart_price");
        quantitySection.classList.add("cart_quantity");
        subtotalSection.classList.add("cart_subtotal");

        cartContainer.appendChild(cartItem);

        totalItems += item.quantity;
        totalPrice += item.product.price * item.quantity;

    }

    const shippingCost = calculateShipping(totalPrice);
    const tax = calculateTax(totalPrice, shippingCost);
    const finalTotal = totalPrice + shippingCost + tax;

    cartCount.textContent = `Total Items: ${totalItems}`;
    merchandiseTotal.textContent = `Merchandise: $${totalPrice.toFixed(2)}`;
    shippingTotal.textContent = `Shipping: $${shippingCost.toFixed(2)}`;
    taxTotal.textContent = `Tax: $${tax.toFixed(2)}`;
    cartTotal.textContent = `Total: $${finalTotal.toFixed(2)}`;
}

function deleteCartItem(e) {
    const id = Number(e.currentTarget.dataset.id);

    cart = cart.filter(item => item.product.id !== id);

    updateStorage();
    displayCart();
}

//shipping
function calculateShipping(merchandiseTotal) {
    if (merchandiseTotal > 500) {
        return 0;
    }

    const method = shippingMethod.value;
    const destination = shippingDestination.value;

    if (method === "standard") {
        if (destination === "canada") {
            return 10;
        }

        if (destination === "usa") {
            return 15;
        }

        return 20; //standard international 
    }

    if (method === "express") {
        if (destination === "canada") {
            return 25;
        }

        if (destination === "usa") {
            return 25;
        }

        return 30; // express international
    }

    if (destination === "canada") { //prio canada
        return 35;
    }

    if (destination === "usa") { //prio usa
        return 50;
    }

    return 50; //prio international
}

//taxes :(
function calculateTax(merchandiseTotal, shippingCost) { 
    if (shippingDestination.value === "canada") { //add tax only if the shipping destrination is canada
        return (merchandiseTotal + shippingCost) * 0.05;
    }

    return 0;
}

//checkout time
function checkout() {
    alert("Checkout complete. Purchase successful!")

    cart =[];

    updateStorage();
    displayCart();
    showHomeView();
}









cart = retrieveStorage();
displayCart();
loadAllProducts();
showHomeView();