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

//Logo
const siteLogo = document.querySelector("#site_logo");

// Different Views of the nav bar
const homeView = document.querySelector("#home_view");
const browseView = document.querySelector("#browse_view");
const productView = document.querySelector("#product_view");
const cartView = document.querySelector("#cart_view");

const aboutPopup = document.querySelector("#about_popup")
const closeAbout = document.querySelector("#close_about")
const aboutX = document.querySelector("#close_about_x");

// Home page
const featuredProductsHouse = document.querySelector("#featured_products");

// Browse page 
const nameFilter = document.querySelector("#name_filter");
const categoryFilter = document.querySelector("#category_filter");
const ratingFilter = document.querySelector("#rating_filter");
const priceFilter = document.querySelector("#price_filter");
const sortFilter = document.querySelector("#sort_filter");
const clearFiltersButton = document.querySelector("#clear_filters");

//toaster message
const toast = document.querySelector("#toaster");

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

    updateNavigation(homeButton);
}

function showBrowseView() {
    hideViews();

    browseView.classList.remove("hidden");

    updateNavigation(browseButton);
}

function showCartView() {
    hideViews();

    cartView.classList.remove("hidden");

    updateNavigation(cartButton);
}

function showProductView() {
    hideViews();

    productView.classList.remove("hidden");
}

//which page is the user on based on button
function updateNavigation(button) {
    homeButton.classList.remove("active_page");
    browseButton.classList.remove("active_page");
    cartButton.classList.remove("active_page");
    button.classList.add("active_page");
}

//displays a message for a set amount of time
function showToaster(message) { 
    toast.textContent = message;
    toast.classList.remove("hidden");

    setTimeout (() => {
        toast.classList.add("hidden");
    }, 3000);
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
        displayFeaturedProducts();
        applyFilters();

        return;
    }
    try { // requesting products data from the api
        const response = await fetch("https://dummyjson.com/products?limit=100");

        if (response.ok) {
            console.log("fetching");
            const data = await response.json(); 

            products = data.products;
            
            updateProductsToStorage();
            displayCategories();
            displayFeaturedProducts();
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
// site logo
siteLogo.addEventListener("click", () => {
    showHomeView();
})

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

//******* about popup ***************

closeAbout.addEventListener("click", () => {
    aboutPopup.close();
})

aboutX.addEventListener("click", () => {
    aboutPopup.close();
})

//*******shipping *****************

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

//******************** home page **********************************************************************************************

// display products on home page by calling createProductCard
function displayFeaturedProducts() {
    featuredProductsHouse.replaceChildren();

    //randomize which products appear
    const randomProducts = [...products];
    randomProducts.sort(() => {
        return Math.random() - 0.5;
    });

    const featuredProducts = randomProducts.slice(0, 4);

    for (const product of featuredProducts) {
        const card = createProductCard(product);

        featuredProductsHouse.appendChild(card);
    }

}

//************** Individual Product ******************************************************************************************

// creates the individual view for a single product
function displayIndividualProduct(product) {

        // BREADCRUMB NAVIGATION
        const breadcrumb = document.querySelector("#breadcrumb");
        breadcrumb.replaceChildren();

        const homeCrumb = document.createElement("a")
        homeCrumb.textContent = "HOME";
        homeCrumb.href = "#"

        homeCrumb.addEventListener("click", (e) => {
            e.preventDefault();
            showHomeView();
        });

        const browseCrumb = document.createElement("a");
        browseCrumb.textContent = "BROWSE";
        browseCrumb.href = "#";

        browseCrumb.addEventListener("click", (e) => {
            e.preventDefault();
            showBrowseView();
        });

        const categoryCrumb = document.createElement("span");
        categoryCrumb.textContent = product.category;

        const nameCrumb = document.createElement("span");
        nameCrumb.textContent = product.title;

        breadcrumb.appendChild(homeCrumb);
        breadcrumb.append("  >  ");
        breadcrumb.appendChild(browseCrumb);
        breadcrumb.append("  >  ");
        breadcrumb.appendChild(categoryCrumb);
        breadcrumb.append("  >  ");
        breadcrumb.appendChild(nameCrumb);


        //PRODUCT INFORMATION
        singleProductContainer.replaceChildren();
        showProductView();

        //item title
        const title = document.createElement("h2");
        title.textContent = product.title;

        //item rating
        const rating = document.createElement("p");
        const ratingStars = Math.floor(product.rating);

        let stars = "";

        for (let i=0; i < ratingStars; i++) {
            stars += "⭐"
        }

        rating.textContent = `${stars} (${product.rating} Stars)`;

        //item price 
        const price = document.createElement("p");
        price.textContent = `$${product.price}`;

        //image
        const image = document.createElement("img");
        image.src = product.thumbnail;
        image.classList.add("product_image")

        //item description
        const description = document.createElement("p");
        description.textContent = product.description;

        // item sku
        const sku = document.createElement("p");
        sku.textContent = `SKU: ${product.sku}`;

        //item tags - display tags as pills instead of text
        const tags = document.createElement("div");
        for (const tag of product.tags) {
            const tagPill = document.createElement("span");

            tagPill.textContent = tag;
            tagPill.classList.add("tag_pill");
            tags.appendChild(tagPill);
        }

        //item stock
        const stock = document.createElement("p")
        if (product.stock > 0) {
            stock.textContent = `${product.availabilityStatus}: (${product.stock} available)`;
        } else {
            stock.textContent = "Out of Stock";
        }; 

        //item quantity
        const quantityInput = document.createElement("input");
        quantityInput.type = "number";
        quantityInput.value = 1;
        quantityInput.min = 1;

        //add to cart button
        const addToCartButton = document.createElement("button");
        addToCartButton.textContent = "Add to Cart";

        addToCartButton.addEventListener("click", () => {
            const quantity= Number(quantityInput.value);
            addToCart(product, quantity);
        });

        price.classList.add("product_price");
        
        const productHeader = document.createElement("div");
        productHeader.classList.add("product_header");
        
        const productInfo = document.createElement("div");
        productInfo.classList.add("product_info");

        productInfo.appendChild(title);
        productInfo.appendChild(price);
        productInfo.appendChild(rating);
        productInfo.appendChild(sku);
        productInfo.appendChild(tags);
        productInfo.appendChild(stock);
        productInfo.appendChild(description);
        productInfo.appendChild(quantityInput);
        productInfo.appendChild(addToCartButton);

        productHeader.appendChild(image);
        productHeader.appendChild(productInfo);

        //SEPARATE BOX START**************
        const tabBox = document.createElement("div");
        tabBox.classList.add("tab_box");
        const specificationsButton = document.createElement("button");
        const reviewsButton = document.createElement("button");

        specificationsButton.textContent = "Specifications";
        reviewsButton.textContent = "Reviews";

        tabBox.appendChild(specificationsButton);
        tabBox.appendChild(reviewsButton);

        specificationsButton.addEventListener("click", () => {
            specifications.classList.remove("hidden");
            reviewSection.classList.add("hidden");
        });

        reviewsButton.addEventListener("click", () => {
            reviewSection.classList.remove("hidden");
            specifications.classList.add("hidden");
        })


        //SPECIFICATIONS SECTION
        const specifications = document.createElement("section");
        const specificationsHeading = document.createElement("h3");

        specificationsHeading.textContent = "Specifications"

        //item weight
        const weight = document.createElement("p");
        weight.textContent = `Weight: ${product.weight} mystery units`;

        //item dimensions
        const dimensions = document.createElement("p");
        dimensions.textContent = `Dimensions: ${product.dimensions.width}" x ${product.dimensions.height}"
        x ${product.dimensions.depth}"`;

        //item warranty
        const warranty = document.createElement("p");
        warranty.textContent = `Warranty: ${product.warrantyInformation}`;

        //item shipping information
        const shippingInfo = document.createElement("p");
        shippingInfo.textContent = `${product.shippingInformation}!`;

        //item return policy
        const returnPolicy = document.createElement("p");
        returnPolicy.textContent = `${product.returnPolicy}`;

        specifications.appendChild(specificationsHeading);
        specifications.appendChild(weight);
        specifications.appendChild(dimensions);
        specifications.appendChild(warranty);
        specifications.appendChild(shippingInfo);
        specifications.appendChild(returnPolicy);

        //REVIEWS SECTION
        const reviewSection = document.createElement("section");
        reviewSection.classList.add("hidden", "review_section");

        const reviewHeading = document.createElement("h3");
        reviewHeading.textContent = "Reviews";
        reviewSection.appendChild(reviewHeading);

        for (const review of product.reviews) {
            const reviewBlock = document.createElement("div");
            reviewBlock.classList.add("review_block");

            // Name
            const reviewerName = document.createElement("p");
            reviewerName.textContent = review.reviewerName

            // Rating
            const reviewerRating = document.createElement("p");
            let reviewStars = "";
            for (let i=0; i < review.rating; i++) {
                reviewStars += "⭐";
            }
            reviewerRating.textContent = reviewStars;

            // Comments
            const reviewerComment = document.createElement("p");
            reviewerComment.textContent = review.comment;
            // Date 
            const reviewDate = document.createElement("p");
            const date = new Date(review.date); //changes to a readable format
            reviewDate.textContent = date.toLocaleDateString();

            reviewBlock.appendChild(reviewerName);
            reviewBlock.appendChild(reviewerRating);
            reviewBlock.appendChild(reviewerComment);
            reviewBlock.appendChild(reviewDate);

            reviewSection.appendChild(reviewBlock);
        }


        //display order: 1.product --> info 2.specs+reviews --> 3.add to cart
        singleProductContainer.appendChild(productHeader);

        singleProductContainer.appendChild(tabBox);
        singleProductContainer.appendChild(specifications);
        singleProductContainer.appendChild(reviewSection);

}

//******************** browse page********************************************************************************************
// create a product card
function createProductCard(product) {
    const itemCard = document.createElement("div");
    itemCard.classList.add("product-card");

    //title
    const title = document.createElement("h2");
    title.textContent = product.title;

    //thumbnail
    const image = document.createElement("img");
    image.src = product.thumbnail;

    //price
    const price = document.createElement("p");
    price.textContent = `$${product.price}`;
        
    //Add to cart button
    const button = document.createElement("button");
    button.textContent = "Add to cart";

    //opens the individual product page when the image or title is clicked
    image.addEventListener("click", () => {
        displayIndividualProduct(product);
    });
    title.addEventListener("click", () => {
        displayIndividualProduct(product);
    })

    //Adds 1 item to the cart when clicked
    button.addEventListener("click", () => {
        addToCart(product, 1);
    });

    itemCard.appendChild(image);
    itemCard.appendChild(title);
    itemCard.appendChild(price);
    itemCard.appendChild(button);

    return itemCard;
}

//displays all of the products by calling createProductCard
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
    
        const card = createProductCard(product);
        container.appendChild(card);
    }
}

//builds the category checkboxes and their labels
function displayCategories() {

    const categories = new Set();
    for (const product of products) {
        categories.add(product.category);
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
            if (a.category < b.category) {
                return -1;
            } else if (a.category > b.category) {
                return 1;
            } else {
                return 0;
            }
        });
    }

    displayProducts(filteredProducts);
}
//gets rid of all filters applied on the browse page
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

//cart number badge (# of items in the cart updates automatically)
function updateCartBadge() {
    let totalItems = 0;
    for (const item of cart) {
        totalItems += item.quantity;
    }

    cartButton.textContent = `CART (${totalItems})`;
}
//************* cart page **********************************************************************************************

//adds a product to the cart and if the item is a duplicate, increase the quantity
function addToCart(product, quantity) { //this function and displayCart are based on the code from labs
    let existingItem = null;

    for (const item of cart) {
        if (item.product.id === product.id) {
            existingItem = item;
        }
    }
    
    let currentQuantity = 0;
        if (existingItem) {
        currentQuantity = existingItem.quantity
        }

    if (currentQuantity + quantity > product.stock) {
        alert(`Only ${product.stock} available in stock`);

        return;
    }

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        const newItem = {product: product, quantity: quantity};
        
        cart.push(newItem);
    }

    updateStorage();
    updateCartBadge();
    displayCart();

    showToaster(`${quantity} ${product.title} added to cart`);
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
    updateCartBadge();
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
    if (cart.length === 0) {
        alert("Your cart is empty. Please add items before checking out.");

        return;
    }

    alert("Checkout complete. Purchase successful!")

    cart =[];

    updateStorage();
    displayCart();
    updateCartBadge();
    showHomeView();
}








// make sure everything is loaded 
cart = retrieveStorage();
updateCartBadge();
displayCart();
loadAllProducts();
showHomeView();