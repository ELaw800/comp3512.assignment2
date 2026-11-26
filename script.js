/*
COMP 3512
Assignment 2
*/

//data arrays

// holds the contents of the shopping cart
let cart = [];
// stores all the products retrieved from local storage or the products api
let products = [];

//containers for each of the products
const container = document.querySelector("#product-container");

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

// Browse page 
const nameFilter = document.querySelector("#name_filter");
const categoryFilter = document.querySelector("#category_filter");
const ratingFilter = document.querySelector("#rating_filter");
const priceFilter = document.querySelector("#price_filter");
const sortFilter = document.querySelector("#sort_filter");
const clearFiltersButton = document.querySelector("#clear_filters");

//organizaion for the features
//1. views
//2. local storage
//3. nav buttons
//4. event listeners
//4. browse page
//5. individual product page
//6. shopping cart page
//7. about popup

//************** view stuff *************************************************************************************************

//hides all of the different views first, each view will display a different page
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

//******************* local cart storage *************************************************************************************

// retrieves the saved cart that is in local storage
function retrieveStorage() {
    return JSON.parse(localStorage.getItem("cart")) || [];
}

function updateStorage() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ************** local all product storage **********************************************************************************

// retrieves products from local storage
function retrieveProductFromStorage() {
    return JSON.parse(localStorage.getItem("products")) || [];
}
//saves products to local storage
function updateProductsToStorage() {
    localStorage.setItem("products", JSON.stringify(products));
}

//load all of the products from the url rather than directly from the json
async function loadAllProducts() {
    console.log("getting products");
    products = retrieveProductFromStorage();

    if (products.length > 0) {
        console.log("local storage");
        displayCategories();
        applyFilters();

        return;
    }
    try { // requesting products data from the api
        const response = await fetch("https://dummyjson.com/products?limit=100");

        if (response.ok) {
            console.log("fetching");
            const data = await response.json(); 

            products = data.products;
            console.log(products);
            updateProductsToStorage();
            displayCategories();
            applyFilters();
        } else {
            console.error("fetch not working");
        }
    }
    catch (error){
        console.error(error);
    }
}

//************ event listeners **********************************************************************************************

//****** Nav Buttons **********

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

//******* other ***************

closeAbout.addEventListener("click", () => {
    aboutPopup.close();
})

shippingMethod.addEventListener("change", () => {
    displayCart();
});

shippingDestination.addEventListener("change", () => {
    displayCart();
});

checkoutButton.addEventListener("click", () => {
    checkout();
});

//******* filters **********
nameFilter.addEventListener("input", applyFilters);
ratingFilter.addEventListener("change", applyFilters);
priceFilter.addEventListener("change", applyFilters);
sortFilter.addEventListener("change", applyFilters);
clearFiltersButton.addEventListener("click", clearFilters);

//************** Individual Product ******************************************************************************************

// creates the individual view for a single product
function displayIndividualProduct(product) {
        singleProductContainer.replaceChildren();
        showProductView();

        // title
        const title = document.createElement("h2");
        title.textContent = product.title;

        // rating
        const rating = document.createElement("p");
        rating.textContent = `Rating: ${product.rating} / 5 Stars`;

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
        singleProductContainer.appendChild(rating);
        singleProductContainer.appendChild(price);
        singleProductContainer.appendChild(description);
        singleProductContainer.appendChild(addToCartButton);

}

//******************** browse page********************************************************************************************

//displays all of the products by generating cards for each. 
function displayProducts(products) {

    container.replaceChildren();

    if (products.length === 0) {
        const message = document.createElement("p");
        message.textContent = "No products match your current filters."

        container.appendChild(message);

        return;
    }

    //for each product in the array it generates a card
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

/*features that need to be part of the browse page 
- Different ways of filtering:
    - by name D
    - by category D
    - by rating D
    - by price D
- Different ways to change sort order: (default is product name)
    - name (a-z) D
    - price D
    - category D
- Clear all filters button D
*/

//builds the category checkboxes and their labels
function displayCategories() {
    const categories = [];

    for( const product of products) {
        if (!categories.includes(product.category)) {
            categories.push(product.category);
        }
    }
    // console.log("categories running");
    // console.log(products.length);

    categoryFilter.replaceChildren();

    for (const category of categories) {
        const label = document.createElement("label");
        const checkbox = document.createElement("input");

        checkbox.type = "checkbox";
        checkbox.value = category;

        checkbox.addEventListener("change", applyFilters);

        label.appendChild(checkbox);
        label.append(` ${category}`);

        categoryFilter.appendChild(label);
        categoryFilter.appendChild(document.createElement("br"));
    }
}

/*
Applies filters based on what a user has chosen.
Options: Typing text, choosing a category, choosing a minimmum rating, based on price 

Also in charge of sorting the order in which the products appear
Options: Name(A-Z), price, category
*/
function applyFilters() {
    let filteredProducts = [...products]; //creating a new array from the products array

    // Name filter -- filters products based on the text entered in the box
    const searchText = nameFilter.value.toLowerCase();

    filteredProducts = filteredProducts.filter(product => product.title.toLowerCase().includes(searchText));

    // Category filter -- filters products based on which checkboxes are checked
    const checkedCategories = [];
    const checkboxes = categoryFilter.querySelectorAll('input[type="checkbox"]');
    
    for (const checkbox of checkboxes) {
        if (checkbox.checked) {
            checkedCategories.push(checkbox.value);
        }
    }

    if (checkedCategories.length > 0) {
        filteredProducts = filteredProducts.filter(product => checkedCategories.includes(product.category));
    }

    // Rating filter -- filter products based on their rating out of five
    const minimumRating = Number(ratingFilter.value);
    filteredProducts = filteredProducts.filter(product => product.rating >= minimumRating);

    // Price filter -- filter products based on their price (dropdown menu for products under xyz amount)
    const maxPrice = Number(priceFilter.value);

    if (maxPrice > 0) {
        filteredProducts = filteredProducts.filter(product => product.price <= maxPrice);
    }

    // Sorting
    const sortType = sortFilter.value;

    // Sort by name
    if (sortType === "name") {
        filteredProducts.sort(function(a, b) {
            if (a.title < b.title) {
                return -1;
            } else if (a.title > b.title) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    // Sort by price
    if( sortType === "price") {
        filteredProducts.sort(function(a, b) {
            if (a.price < b.price) {
                return -1;
            } else if (a.price > b.price) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    //Sort by category
    if (sortType === "category") {
        filteredProducts.sort(function(a, b) {
            if (a.category < b.categories) {
                return -1;
            } else if (a.category > b.categories) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    displayProducts(filteredProducts);
}

function clearFilters() {
    nameFilter.value ="";
    ratingFilter.value ="0";
    priceFilter.value ="0";
    sortFilter.value ="name"

    const checkboxes = categoryFilter.querySelectorAll('input[type="checkbox"]');
    for (const checkbox of checkboxes) {
        checkbox.checked = false;
    }

    applyFilters();
}
//************* cart page **********************************************************************************************

//adds a product to the cart and if the item is a duplicate, increase the quantity
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

//in charge of displaying the shopping cart and also does the money math
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

// removes a product from the cart
function deleteCartItem(e) {
    const id = Number(e.currentTarget.dataset.id);

    cart = cart.filter(item => item.product.id !== id);

    updateStorage();
    displayCart();
}

//calculates shipping based on item total, shipping method, and destination
function calculateShipping(merchandiseTotal) {
    if (merchandiseTotal > 500) {
        return 0;
    }

    const method = shippingMethod.value;
    const destination = shippingDestination.value;

    if (method === "none") {
        return 0;
    }

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

//taxes :( are applied on canadian orders only
function calculateTax(merchandiseTotal, shippingCost) { 
    if (shippingDestination.value === "canada" && shippingMethod.value !== "none") 
        { //add tax only if the shipping destrination is canada
        return (merchandiseTotal + shippingCost) * 0.05;
    }

    return 0;
}

//checkout time clears the cart, updates storage, and returns you to the home page
function checkout() {
    alert("Checkout complete. Purchase successful!")

    cart =[];

    updateStorage();
    displayCart();
    showHomeView();
}








// make sure everything is loaded 
cart = retrieveStorage();
displayCart();
loadAllProducts();
showHomeView();