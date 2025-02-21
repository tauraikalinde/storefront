// src/app.ts

interface Product {
    id: number;
    title: string;
    description: string;
    price: number;
    image: string;
  }
  
  interface CartItem {
    id: number;
    title: string;
    price: number;
    quantity: number;
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    const productContainer = document.getElementById('product-container') as HTMLElement;
    const cartList = document.getElementById('cart-list') as HTMLElement;
    const totalPriceSpan = document.getElementById('total-price') as HTMLElement;
    const checkoutButton = document.getElementById('checkout-button') as HTMLButtonElement;
    
    let cart: CartItem[] = []; // Array to store cart items
    let totalPrice: number = 0; // To keep track of the total cart value
  
    // Fetch products from the Fake Store API
    fetch('https://fakestoreapi.com/products')
      .then(response => response.json())
      .then((data: Product[]) => {
        // Loop through each product and create a product card
        data.forEach((product: Product) => {
          const productCard = document.createElement('div');
          productCard.classList.add('product-card');
  
          productCard.innerHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>${product.description}</p>
            <div class="price">$${product.price}</div>
            <button class="add-to-cart" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}">Add to Cart</button>
          `;
  
          productContainer.appendChild(productCard);
  
          // Add event listener to "Add to Cart" button
          const addToCartButton = productCard.querySelector('.add-to-cart') as HTMLButtonElement;
          addToCartButton.addEventListener('click', () => {
            addToCart(product); // Add product to the cart
          });
        });
      })
      .catch(error => {
        console.error('Error fetching products:', error);
      });
  
    // Function to add product to the cart
    function addToCart(product: Product): void {
      const existingProductIndex = cart.findIndex(item => item.id === product.id);
      
      if (existingProductIndex === -1) {
        // If product not in cart, add new product
        cart.push({
          id: product.id,
          title: product.title,
          price: product.price,
          quantity: 1
        });
      } else {
        // If product already in cart, increase quantity
        cart[existingProductIndex].quantity += 1;
      }
      
      updateCart();
    }
  
    // Function to remove product from the cart
    function removeFromCart(productId: number): void {
      const productIndex = cart.findIndex(item => item.id === productId);
      
      if (productIndex !== -1) {
        // Remove the item from the cart
        cart.splice(productIndex, 1);
        updateCart();
      }
    }
  
    // Function to increase quantity of a product
    function increaseQuantity(productId: number): void {
      const productIndex = cart.findIndex(item => item.id === productId);
      if (productIndex !== -1) {
        cart[productIndex].quantity += 1;
        updateCart();
      }
    }
  
    // Function to decrease quantity of a product
    function decreaseQuantity(productId: number): void {
      const productIndex = cart.findIndex(item => item.id === productId);
      if (productIndex !== -1 && cart[productIndex].quantity > 1) {
        cart[productIndex].quantity -= 1;
        updateCart();
      }
    }
  
    // Function to update the cart display
    function updateCart(): void {
      // Clear the cart list
      cartList.innerHTML = '';
      
      // Recalculate the total price
      totalPrice = 0;
  
      cart.forEach((item: CartItem) => {
        // Create a list item for each product in the cart
        const listItem = document.createElement('li');
        listItem.innerHTML = `
          ${item.title} - $${item.price} x ${item.quantity}
          <button class="increase-quantity" data-id="${item.id}">+</button>
          <button class="decrease-quantity" data-id="${item.id}">-</button>
          <button class="remove-item" data-id="${item.id}">Remove</button>
        `;
        cartList.appendChild(listItem);
        
        // Add event listener to the "Increase" button
        const increaseButton = listItem.querySelector('.increase-quantity') as HTMLButtonElement;
        increaseButton.addEventListener('click', () => {
          increaseQuantity(item.id); // Increase quantity
        });
  
        // Add event listener to the "Decrease" button
        const decreaseButton = listItem.querySelector('.decrease-quantity') as HTMLButtonElement;
        decreaseButton.addEventListener('click', () => {
          decreaseQuantity(item.id); // Decrease quantity
        });
  
        // Add event listener to the "Remove" button
        const removeButton = listItem.querySelector('.remove-item') as HTMLButtonElement;
        removeButton.addEventListener('click', () => {
          removeFromCart(item.id); // Remove item from the cart
        });
  
        totalPrice += item.price * item.quantity;
      });
  
      // Update the total price
      totalPriceSpan.textContent = totalPrice.toFixed(2);
    }
  
    // Checkout button functionality (just for show in this simple version)
    checkoutButton.addEventListener('click', () => {
      if (cart.length === 0) {
        alert('Your cart is empty. Please add items to the cart before checking out.');
      } else {
        alert(`Checkout successful! Total: $${totalPrice.toFixed(2)}`);
        cart = []; // Empty the cart after checkout
        updateCart(); // Update cart display
      }
    });
  });