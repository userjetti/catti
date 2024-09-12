const hamMenu = document.querySelector(".hamburger");
const cartBtn = document.querySelector('.cart-btn')
const cards = document.querySelectorAll(".card");
const close = document.querySelector('.close');
const panel = document.querySelector('.panel');
const sizeOptions = panel.querySelector('.size-info');
const sizeButtons = sizeOptions.querySelectorAll('.size-btn');
const overlay = document.querySelector('.overlay');
const panelImage = panel.querySelector('.img-container img');
const panelName = panel.querySelector('.product-info h1');
const panelPrice = panel.querySelector('.product-info h3');
const cardParents = document.querySelectorAll('.card-container')
const body = document.querySelector('body')
const menuBar = document.querySelectorAll('.bar')
const addToCart = document.querySelector('.add-cart')
const buyNow = document.querySelector('.buy-now')
const cartContainer = document.querySelector('#cart-container')
const emptyText = document.querySelector('.empty-text')
const mainLinks = document.querySelector('.main-links')
const otherLinks = document.querySelector('.other-links')
const showOtherLinks = document.querySelector('.show-other')
const hideOtherLinks = document.querySelector('.hide-other')

const offScreenMenu = document.querySelector(".off-screen-menu");
const offScreenCart = document.querySelector(".off-screen-cart");

const cartTotalElement = document.getElementById('cart-total');
const cartMessage = document.querySelector('.cart-msg')
const cartMsgText = cartMessage.querySelector('h2')

let sizeSelected = false;

function initializeSizeButtons() {
  sizeButtons.forEach(button => {
      button.addEventListener('click', () => {
          sizeButtons.forEach(btn => btn.classList.remove('active'));
          button.classList.add('active');
          selectedSize = button.getAttribute('data-size');
          sizeSelected = true;
      });
  });
}

function reinitializeEvents() {
  initializeCardEvents();
  initializeSizeButtons();
}

function initializeCardEvents() {
  const cards = document.querySelectorAll(".card");

  cards.forEach((card) => {
      card.addEventListener('click', function () {
          const name = this.getAttribute('data-name');
          const productState = JSON.parse(localStorage.getItem('products')) || {};
          const savedProduct = productState[name];

          // Verifica si los datos del producto están actualizados
          if (savedProduct) {
              const sizes = savedProduct.sizes;
              const stockData = savedProduct.stockData;

              // Sincroniza la tarjeta con los datos guardados
              card.setAttribute('data-size', sizes.join(','));
              sizes.forEach((size, i) => {
                  const stockAttribute = `data-stock-size${i + 1}`;
                  if (stockData[stockAttribute] !== undefined) {
                      card.setAttribute(stockAttribute, stockData[stockAttribute]);
                  } else {
                      card.removeAttribute(stockAttribute);
                  }
              });
          }

          // Ahora, actualiza el panel con los datos sincronizados
          const price = this.getAttribute('data-price');
          const image = this.getAttribute('data-image');
          const panelSizes = this.getAttribute('data-size').split(',');
          const stockSizes = panelSizes.map((_, i) => parseInt(this.getAttribute(`data-stock-size${i + 1}`)) || 0);

          panelName.textContent = name;
          panelPrice.textContent = price;
          panelImage.src = image;

          sizeButtons.forEach(button => {
              const size = button.getAttribute('data-size');
              const stockSize = stockSizes[panelSizes.indexOf(size)] || 0;

              if (stockSize > 0) {
                  button.style.display = 'flex';
                  button.setAttribute('data-stock', stockSize);
                  button.classList.remove('disabled');
              } else {
                  button.classList.add('disabled');
              }
          });

          panel.classList.remove('disable');
          overlay.classList.remove('disable');
      });
  });
}

function addItemToCart() {
  cartCount++;
  updateCartCount();
  updateCartTotal();
}

function removeItemFromCart() {
  if (cartCount > 0) {
      cartCount--;
  }
  updateCartCount();
  updateCartTotal();
}

// En el manejo de eventos de "Añadir al carrito"
addToCart.addEventListener('click', (e) => {
  // Asegúrate de que la talla ha sido seleccionada
  if (!checkSizeSelected()) {
      cartMessage.classList.remove('disable');
      cartMsgText.textContent = 'Por favor, selecciona una talla antes de continuar.';
      addToCart.classList.add('disabled');
      e.preventDefault();
      return;
  }

  const selectedButton = sizeOptions.querySelector('.size-btn.active');
  const size = selectedButton.getAttribute('data-size');
  const name = panelName.textContent;
  const price = parseFloat(panelPrice.textContent.replace('$', '').replace(' USD', ''));
  const image = panelImage.src;

  // Encuentra la tarjeta del producto actual
  const productCard = document.querySelector(`.card[data-name="${name}"]`);
  
  // Mapea cada talla a su índice correspondiente
  const sizeIndexMapping = {
      'S': '1',
      'M': '2',
      'L': '3',
      'XL': '4',
      'XXL': '5'
  };
  
  // Obtén el índice correspondiente a la talla seleccionada
  const sizeIndex = sizeIndexMapping[size];
  const stockAttribute = `data-stock-size${sizeIndex}`;

  // Verifica si el atributo existe en el producto
  if (!productCard.hasAttribute(stockAttribute)) {
      console.error(`El atributo ${stockAttribute} no existe en el producto.`);
      return;
  }

  // Obtén el stock disponible para la talla seleccionada
  const stock = parseInt(productCard.getAttribute(stockAttribute));

  // Verifica si el producto ya está en el carrito con la misma talla
  if (isProductInCart(name, size)) {
      cartMessage.classList.remove('disable');
      cartMsgText.textContent = 'Este Producto ya está en el Carrito con la misma talla.';
      addToCart.classList.add('disabled');
      removeCartMessage();
      return; 
  }

  // Lógica para agregar el producto al carrito
  const cartItem = document.createElement('div');
  cartItem.classList.add('cart-item');
  cartItem.innerHTML = `
      <div class="item-data">
          <img src="${image}" alt="${name}">
          <div class="cart-item-info">
              <h4 class="cart-item-name">${name}</h4>
              <p class="cart-item-price">$${price.toFixed(2)} USD</p>
              <p class="cart-item-size">Size: ${size}</p>
              <div class="cart-item-controls">
                  <span class="decrement disabled">
                      <i class="fa-solid fa-circle-minus"></i>
                  </span>
                  <span class="cart-item-quantity">1</span>
                  <span class="increment">
                      <i class="fa-solid fa-circle-plus"></i>
                  </span>
              </div>
          </div>
      </div>
      <span class="remove-item">
          <i class="fa-solid fa-trash-can"></i>
      </span>
  `;

  cartContainer.appendChild(cartItem);

  addItemToCart();
  cartIsEmpty();
  updateCartTotal();

  // Eventos para incrementar y decrementar cantidad
  const decrementButton = cartItem.querySelector('.decrement');
  const incrementButton = cartItem.querySelector('.increment');
  const quantityElement = cartItem.querySelector('.cart-item-quantity');
  const priceElement = cartItem.querySelector('.cart-item-price');
  const removeButton = cartItem.querySelector('.remove-item');

  let quantity = 1;

  function updateButtonState(quantity, stock, decrementButton, incrementButton) {
      if (quantity <= 1) {
          decrementButton.classList.add('disabled');
      } else {
          decrementButton.classList.remove('disabled');
      }

      if (quantity >= stock) {
          incrementButton.classList.add('disabled');
      } else {
          incrementButton.classList.remove('disabled');
      }
  }

  decrementButton.addEventListener('click', () => {
      if (quantity > 1) {
          quantity--;
          quantityElement.textContent = quantity;
          priceElement.textContent = `$${(price * quantity).toFixed(2)} USD`;
          updateButtonState(quantity, stock, decrementButton, incrementButton);
      }
      updateCartTotal();
  });

  incrementButton.addEventListener('click', () => {
      if (quantity < stock) {
          quantity++;
          quantityElement.textContent = quantity;
          priceElement.textContent = `$${(price * quantity).toFixed(2)} USD`;
          updateButtonState(quantity, stock, decrementButton, incrementButton);
      }
      updateCartTotal();
  });

  removeButton.addEventListener('click', () => {
      cartContainer.removeChild(cartItem);
      removeItemFromCart();
      cartIsEmpty();
      updateCartTotal();
  });

  // Cierra el panel y restablece la selección de talla
  panel.classList.add('disable');
  overlay.classList.add('disable');

  updateCartTotal();
  resetSizeSelection();
});

// Modificación de isProductInCart para incluir la talla en la verificación
function isProductInCart(name, size) {
  const cartItems = cartContainer.querySelectorAll('.cart-item');
  for (let item of cartItems) {
      const itemName = item.querySelector('.cart-item-name').textContent;
      const itemSize = item.querySelector('.cart-item-size').textContent.replace('Size: ', '');

      if (itemName === name && itemSize === size) {
          return true;
      }
  }
  
  return false;
}

// En el manejo de eventos de "Añadir al carrito"
/**addToCart.addEventListener('click', (e) => {
  if (!checkSizeSelected()) {
      cartMessage.classList.remove('disable')
      cartMsgText.textContent = 'Por favor, selecciona una talla antes de continuar.'
      addToCart.classList.add('disabled')
      e.preventDefault();
      return;
  } else {
      const name = panelName.textContent;
      const price = parseFloat(panelPrice.textContent.replace('$', '').replace(' USD', ''));
      const image = panelImage.src;
      const card = document.querySelector(`.card[data-name="${name}"]`);
      const stock = parseInt(card.getAttribute('data-stock'));
      const size = selectedSize;
      
      if (isProductInCart(name, size)) {
          cartMessage.classList.remove('disable');
          cartMsgText.textContent = 'Este Producto ya está en el Carrito con la misma talla.';
          addToCart.classList.add('disabled');
          removeCartMessage();
          return; 
      }

      const cartItem = document.createElement('div');
      cartItem.classList.add('cart-item');
      cartItem.innerHTML = `
          <div class="item-data">
            <img src="${image}" alt="${name}">
            <div class="cart-item-info">
              <h4 class="cart-item-name">${name}</h4>
              <p class="cart-item-price">$${price.toFixed(2)} USD</p>
              <p class="cart-item-size">Size: <b>${size}</b></p>
              <div class="cart-item-controls">
                <span class="decrement disabled">
                  <i class="fa-solid fa-circle-minus"></i>
                </span>
                <span class="cart-item-quantity">1</span>
                <span class="increment">
                  <i class="fa-solid fa-circle-plus"></i>
                </span>
            </div>
          </div>
          </div>
          <span class="remove-item">
            <i class="fa-solid fa-trash-can"></i>
          </span>
      `;
    
      cartContainer.appendChild(cartItem);
    
      addItemToCart();
      cartIsEmpty();
    
      updateCartTotal();
    
      const decrementButton = cartItem.querySelector('.decrement');
      const incrementButton = cartItem.querySelector('.increment');
      const quantityElement = cartItem.querySelector('.cart-item-quantity');
      const priceElement = cartItem.querySelector('.cart-item-price');
      const removeButton = cartItem.querySelector('.remove-item');
    
      let quantity = 1;
    
      function updateButtonState(quantity, stock, decrementButton, incrementButton) {
        if (quantity <= 1) {
            decrementButton.classList.add('disabled');
        } else {
            decrementButton.classList.remove('disabled');
        }
    
        if (quantity >= stock) {
            incrementButton.classList.add('disabled');
        } else {
            incrementButton.classList.remove('disabled');
        }
      }
      
      decrementButton.addEventListener('click', () => {
          if (quantity > 1) {
              quantity--;
              quantityElement.textContent = quantity;
              priceElement.textContent = `$${(price * quantity).toFixed(2)} USD`;
              updateButtonState(quantity, stock, decrementButton, incrementButton);
          }
          updateCartTotal();
      });
    
      incrementButton.addEventListener('click', () => {
          if (quantity < stock) {
            quantity++;
            quantityElement.textContent = quantity;
            priceElement.textContent = `$${(price * quantity).toFixed(2)} USD`;
            updateButtonState(quantity, stock, decrementButton, incrementButton);
          }
          updateCartTotal();
      });
    
      removeButton.addEventListener('click', () => {
          cartContainer.removeChild(cartItem);
    
          removeItemFromCart();
    
          cartIsEmpty();
    
          updateCartTotal();
      });
    
      panel.classList.add('disable');
      overlay.classList.add('disable');
    
      updateCartTotal();

      resetSizeSelection();

      resetSizeSelection();
  }
});**/

// Llamada inicial para asegurar que los eventos estén activos
reinitializeEvents();

document.addEventListener("DOMContentLoaded", () => {
  reinitializeEvents(); // Asegura que todos los eventos estén configurados desde el inicio
});

// Verificación de selección de talla
function checkSizeSelected() {
    if (!sizeSelected) {
        // Mostrar mensaje de advertencia
        cartMessage.classList.remove('disable')
        cartMsgText.textContent = 'Por favor, selecciona una talla antes de continuar.'
        addToCart.classList.add('disabled')
        buyNow.classList.add('disabled')
        removeCartMessage()
        return false;
    }
    return true;
}

const resetSizeSelection = () => {
  sizeSelected = false;
  sizeButtons.forEach(btn => btn.classList.remove('active'));
};

let selectedSize = null;

// Manejar clic en los botones de talla
sizeButtons.forEach(button => {
    button.addEventListener('click', () => {
        // Restablecer el diseño de todos los botones
        sizeButtons.forEach(btn => btn.classList.remove('active'));

        // Marcar el botón clickeado como seleccionado
        button.classList.add('active');
        selectedSize = button.getAttribute('data-size'); // O button.textContent

        // Indicar que una talla ha sido seleccionada
        sizeSelected = true;
    });
});

// Seleccionar todos los sistemas de ordenamiento
document.querySelectorAll('.sort').forEach(sortElement => {
  const dropParent = sortElement.querySelector('.drop-parent');
  const dropParentTitle = dropParent.querySelector('h3');
  const dropdown = sortElement.querySelector('.dropdown');
  const sortAscButton = sortElement.querySelector('.sort-asc');
  const sortDescButton = sortElement.querySelector('.sort-desc');

  // Función para alternar las flechas
  /*unction toggleArrows(direction) {
      const downArrow = sortElement.querySelector('.fa-caret-down');
      const upArrow = sortElement.querySelector('.fa-caret-up');

      if (direction === 'down') {
          downArrow.classList.add('active');
          upArrow.classList.remove('active');
      } else {
          downArrow.classList.remove('active');
          upArrow.classList.add('active');
      }
  }*/

  // Mostrar/Ocultar el dropdown y alternar flechas
  dropParent.addEventListener('click', () => {
      dropdown.classList.toggle('active');
      const isDropdownOpen = dropdown.classList.contains('active');
      //toggleArrows(isDropdownOpen ? 'up' : 'down');
  });

  // Ocultar el dropdown y restablecer las flechas al seleccionar una opción
  dropdown.querySelectorAll('li').forEach(option => {
      option.addEventListener('click', () => {
          dropdown.classList.remove('active');
          //toggleArrows('down');
      });
  });

  // Función para ordenar las cartas dentro de una sección específica
  function sortCards(container, sortType) {
      const cardContainers = Array.from(container.querySelectorAll('.card-container'));

      // Reordenar los contenedores de las cartas
      cardContainers.sort((a, b) => {
          const priceA = parseFloat(a.querySelector('.card').getAttribute('data-price').replace(/[^0-9.-]+/g, ""));
          const priceB = parseFloat(b.querySelector('.card').getAttribute('data-price').replace(/[^0-9.-]+/g, ""));

          return sortType === 'asc' ? priceA - priceB : priceB - priceA;
      });

      // Vaciar el contenedor principal y reinsertar los contenedores ordenados
      container.innerHTML = '';
      cardContainers.forEach(cardContainer => {
          container.appendChild(cardContainer);
      });
  }

  // Agregar funcionalidad de ordenamiento
  sortAscButton.addEventListener('click', () => {
      const sectionContainer = sortElement.closest('section').querySelector('.cards');
      sortCards(sectionContainer, 'asc');
      dropParent.classList.add('active')
      dropParentTitle.textContent = 'Price, Lower to High'
      //toggleArrows('down');
  });

  sortDescButton.addEventListener('click', () => {
      const sectionContainer = sortElement.closest('section').querySelector('.cards');
      sortCards(sectionContainer, 'desc');
      dropParent.classList.add('active')
      dropParentTitle.textContent = 'Price, Higher to Low'
      //toggleArrows('down');
  });
});

hideOtherLinks.addEventListener('click', () => {
  mainLinks.style.animation = 'mainLinksIn 0.5s forwards';
  otherLinks.style.animation = 'otherLinksOut 0.5s forwards';
});

showOtherLinks.addEventListener('click', () => {
  otherLinks.style.animation = 'otherLinksIn 0.5s forwards';
  mainLinks.style.animation = 'mainLinksOut 0.5s forwards';
});

function removeCartMessage() {
  cartMessage.classList.add('slide-down');
  cartMessage.classList.remove('slide-up');

  if (!cartMessage.classList.contains('disable')) {
    setTimeout(() => {
      cartMessage.classList.remove('slide-down');
      cartMessage.classList.add('slide-up');
    }, 2000);

    setTimeout(() => {
      addToCart.classList.remove('disabled')
      buyNow.classList.remove('disabled')
    }, 2100);
  }
}

let cartCount = 0;
const cartCounterElement = document.querySelector('.counter-cart'); // Selecciona el span del contador

document.addEventListener("DOMContentLoaded", () => {

  const buyNowButton = document.querySelector('.buy-now');
  const checkoutButton = document.querySelector('.checkout');
  const cartContainer = document.getElementById('cart-container');
  const contactUsLink = document.querySelector('.link-contact');
  const ownerPhoneNumber = "995579209365"; // Reemplaza con el número de teléfono del dueño

  function getProductDetailsFromPanel() {
      const panel = document.querySelector('.panel');
      const name = panel.querySelector('.product-info h1').textContent;
      const price = panel.querySelector('.product-info h3').textContent;
      const quantity = 1; // Por defecto 1, ya que es un producto individual

      return `Producto: ${name}, Precio: ${price}, Cantidad: ${quantity}`;
  }

  // Funciones centralizadas para interactuar con localStorage
// Funciones centralizadas para interactuar con localStorage
function getSavedProducts() {
    return JSON.parse(localStorage.getItem('products')) || {};
}

function saveProductsToStorage(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Función para sincronizar el estado en todas las tarjetas relacionadas
function updateProductStates(name) {
    const savedProducts = JSON.parse(localStorage.getItem('products')) || {};
    const relatedCards = document.querySelectorAll(`.card[data-name="${name}"]`);
  
    if (savedProducts[name]) {
      const { sizes, stockData } = savedProducts[name];
  
      relatedCards.forEach(card => {
        // Actualiza los atributos en todas las tarjetas relacionadas
        card.setAttribute('data-size', sizes.join(','));
  
        Object.keys(stockData).forEach(attr => {
          const stockValue = stockData[attr];
          
          // Asegura que el valor se mantenga en 0 si es necesario
          if (stockValue === 0) {
            card.setAttribute(attr, '0');
          } else if (stockValue !== undefined) {
            card.setAttribute(attr, stockValue);
          } else {
            card.removeAttribute(attr);
          }
        });
  
        // Verifica si el producto tiene tallas disponibles
        if (sizes.length === 0) {
          card.classList.add('disabled');
        } else {
          card.classList.remove('disabled');
        }
      });
    }
  }

// Función para guardar el estado de un producto
function saveProductState(name, sizes, stockData) {
    const savedProducts = getSavedProducts();

    // Filtrar para que solo se guarden valores de stock >= 0 y evitar reinicios
    Object.keys(stockData).forEach(attr => {
        if (stockData[attr] < 0) {
            delete stockData[attr];
        }
    });

    savedProducts[name] = { sizes, stockData };
    saveProductsToStorage(savedProducts);

    // Actualizar todas las tarjetas relacionadas
    updateProductStates(name);
}

// Función para cargar todos los estados de productos al iniciar la página
function loadProductStates() {
    const savedProducts = getSavedProducts();

    Object.keys(savedProducts).forEach(productName => {
        const { sizes, stockData } = savedProducts[productName];
        if (!sizes || !stockData) return;

        const relatedCards = document.querySelectorAll(`.card[data-name="${productName}"]`);

        relatedCards.forEach(card => {
            card.setAttribute('data-size', sizes.join(','));

            // Actualiza los atributos relacionados al stock
            Object.keys(stockData).forEach(attr => {
                if (stockData[attr] !== undefined) {
                    card.setAttribute(attr, stockData[attr]);
                } else {
                    card.removeAttribute(attr);
                }
            });

            // Verifica si la tarjeta debe estar deshabilitada
            card.classList.toggle('disabled', sizes.length === 0);
        });
    });
}

// Evento de checkout: manejar el stock y actualizar el estado guardado
checkoutButton.addEventListener('click', (e) => {
    e.preventDefault();

    const cartItems = cartContainer.querySelectorAll('.cart-item');

    cartItems.forEach(cartItem => {
        const itemName = cartItem.querySelector('.cart-item-name').textContent;
        const itemSize = cartItem.querySelector('.cart-item-size').textContent.replace('Size: ', '');
        const itemQuantity = parseInt(cartItem.querySelector('.cart-item-quantity').textContent);

        const matchingCard = document.querySelector(`.card[data-name="${itemName}"]`);

        if (matchingCard) {
            const sizeIndexMapping = { 'S': '1', 'M': '2', 'L': '3', 'XL': '4', 'XXL': '5' };
            const sizeIndex = sizeIndexMapping[itemSize];

            const stockSizeAttr = `data-stock-size${sizeIndex}`;
            const stockSize = parseInt(matchingCard.getAttribute(stockSizeAttr));
            const stockAll = parseInt(matchingCard.getAttribute('data-stock-all'));

            // Reducir el stock y asegurarse de que el valor se mantenga en 0 si llega a 0
            const newStockSize = Math.max(stockSize - itemQuantity, 0);
            matchingCard.setAttribute(stockSizeAttr, newStockSize);
            matchingCard.setAttribute('data-stock-all', stockAll - itemQuantity);

            // Gestionar y guardar el estado del producto
            let updatedSizes = matchingCard.getAttribute('data-size').split(',').filter(size => size.trim() !== '');
            if (newStockSize <= 0) {
                updatedSizes = updatedSizes.filter(size => size !== itemSize);
            }

            const stockData = { 'data-stock-all': stockAll - itemQuantity };
            updatedSizes.forEach((size, index) => {
                const sizeAttr = `data-stock-size${index + 1}`;
                stockData[sizeAttr] = parseInt(matchingCard.getAttribute(sizeAttr)) || 0;
            });

            saveProductState(itemName, updatedSizes, stockData);
        }
    });

    const cartDetails = getCartDetails();
    sendMessage(cartDetails);
});

// Evento "Buy Now": manejar la compra y actualizar el estado guardado
buyNow.addEventListener('click', (e) => {
    e.preventDefault();

    if (!checkSizeSelected()) {
        cartMessage.classList.remove('disable');
        cartMsgText.textContent = 'Por favor, selecciona una talla antes de continuar.';
        buyNow.classList.add('disabled');
        removeCartMessage();
        return;
    }

    const selectedButton = sizeOptions.querySelector('.size-btn.active');
    const size = selectedButton.getAttribute('data-size');
    const name = panelName.textContent;
    const productCard = document.querySelector(`.card[data-name="${name}"]`);

    const sizeIndexMapping = { 'S': '1', 'M': '2', 'L': '3', 'XL': '4', 'XXL': '5' };
    const sizeIndex = sizeIndexMapping[size];

    if (isProductInCart(name, size)) {
        cartMessage.classList.remove('disable');
        cartMsgText.textContent = 'Este Producto ya está en el Carrito con la misma talla.';
        buyNow.classList.add('disabled');
        removeCartMessage();
        return;
    }

    const stockSize = parseInt(productCard.getAttribute(`data-stock-size${sizeIndex}`));
    const stockAll = parseInt(productCard.getAttribute('data-stock-all'));

    const newStockSize = Math.max(stockSize - 1, 0);
    productCard.setAttribute(`data-stock-size${sizeIndex}`, newStockSize);
    productCard.setAttribute('data-stock-all', stockAll - 1);

    let updatedSizes = productCard.getAttribute('data-size').split(',').filter(size => size.trim() !== '');
    if (newStockSize <= 0) {
        updatedSizes = updatedSizes.filter(s => s !== size);
    }

    const stockData = { 'data-stock-all': stockAll - 1 };
    updatedSizes.forEach((size, index) => {
        const sizeAttr = `data-stock-size${index + 1}`;
        stockData[sizeAttr] = parseInt(productCard.getAttribute(sizeAttr)) || 0;
    });

    saveProductState(name, updatedSizes, stockData);

    const price = parseFloat(panelPrice.textContent.replace('$', '').replace(' USD', ''));
    const productDetails = `Producto: ${name}, Talla: ${size}, Precio: $${price.toFixed(2)} USD`;
    sendMessage(productDetails);

    panel.classList.add('disable');
    overlay.classList.add('disable');
    resetSizeSelection();
});

window.addEventListener('load', loadProductStates);
  

cards.forEach((card) => {
    card.addEventListener('click', function () {
      const name = this.getAttribute('data-name');
      updateProductStates(name);
  
      // Obtén la información del producto actual
      const price = this.getAttribute('data-price');
      const image = this.getAttribute('data-image');
      const sizes = this.getAttribute('data-size').split(',');
  
      // Actualiza la información del panel
      panelName.textContent = name;
      panelPrice.textContent = price;
      panelImage.src = image;
  
      // Oculta todos los botones de talla inicialmente
      sizeButtons.forEach(button => {
        button.style.display = 'none';
      });
  
      // Muestra solo los botones de las tallas disponibles
      sizes.forEach(size => {
        const button = sizeOptions.querySelector(`.size-btn[data-size="${size.trim()}"]`);
        if (button) {
          button.style.display = 'flex';
        }
      });
  
      // Muestra el panel
      panel.classList.remove('disable');
      overlay.classList.remove('disable');
    });
  });


  function getCartDetails() {
      const cartItems = cartContainer.querySelectorAll('.cart-item');
      let cartDetails = '';

      cartItems.forEach(item => {
          const name = item.querySelector('.cart-item-name').textContent;
          const price = item.querySelector('.cart-item-price').textContent;
          const quantity = item.querySelector('.cart-item-quantity').textContent;

          cartDetails += `Producto: ${name}, Precio: ${price}, Cantidad: ${quantity}\n`;
      });

      return cartDetails.trim();
  }

  function sendMessage(details) {
      const message = encodeURIComponent(`Hola, me gustaría comprar los siguientes productos:\n\n${details}`);
      const whatsappUrl = `https://wa.me/${ownerPhoneNumber}?text=${message}`;

      window.open(whatsappUrl, '_blank');
  }

  function contactOwner() {
    const whatsappUrl = `https://wa.me/${ownerPhoneNumber}`;

    window.open(whatsappUrl, '_blank');
}

  contactUsLink.addEventListener('click', (e) => {
    e.preventDefault();
    contactOwner();
  });

/*checkoutButton.addEventListener('click', (e) => {
    e.preventDefault(); // Previene que el botón de checkout recargue la página

    const cartItems = cartContainer.querySelectorAll('.cart-item');

    cartItems.forEach(cartItem => {
        const itemName = cartItem.querySelector('.cart-item-name').textContent;
        const itemSize = cartItem.querySelector('.cart-item-size').textContent.replace('Size: ', '');
        const itemQuantity = parseInt(cartItem.querySelector('.cart-item-quantity').textContent);
  
        // Encuentra la tarjeta correspondiente al producto en el carrito
        const matchingCard = Array.from(cards).find(card => 
            card.getAttribute('data-name') === itemName
        );

        if (matchingCard) {
            // Mapea cada talla a su índice correspondiente
            const sizeIndexMapping = {
                'S': '1',
                'M': '2',
                'L': '3',
                'XL': '4',
                'XXL': '5'
            };

            // Obtén el índice correspondiente a la talla seleccionada
            const sizeIndex = sizeIndexMapping[itemSize];

            // Accede al atributo de stock de la talla seleccionada
            const stockSizeAttr = `data-stock-size${sizeIndex}`;
            const stockSize = parseInt(matchingCard.getAttribute(stockSizeAttr));
            const stockAll = parseInt(matchingCard.getAttribute('data-stock-all'));

            // Reducir stock basado en la cantidad
            matchingCard.setAttribute(stockSizeAttr, stockSize - itemQuantity);
            matchingCard.setAttribute('data-stock-all', stockAll - itemQuantity);
        }
    });

    const cartDetails = getCartDetails();
    sendMessage(cartDetails);

    updateStockAndSizes();
});
buyNow.addEventListener('click', (e) => {
    e.preventDefault(); // Previene que el enlace redirija la página

    // Asegúrate de que la talla ha sido seleccionada
    if (!checkSizeSelected()) {
        cartMessage.classList.remove('disable');
        cartMsgText.textContent = 'Por favor, selecciona una talla antes de continuar.';
        buyNow.classList.add('disabled');
        removeCartMessage();
        return;
    }

    const selectedButton = sizeOptions.querySelector('.size-btn.active');
    const size = selectedButton.getAttribute('data-size');
    const name = panelName.textContent;

    // Encuentra la "card" que corresponde al producto en el panel
    const productCard = document.querySelector(`.card[data-name="${name}"]`);

    // Mapea cada talla a su índice correspondiente
    const sizeIndexMapping = {
        'S': '1',
        'M': '2',
        'L': '3',
        'XL': '4',
        'XXL': '5'
    };

    // Obtén el índice correspondiente a la talla seleccionada
    const sizeIndex = sizeIndexMapping[size];

    // Verifica si el producto ya está en el carrito con la misma talla
    if (isProductInCart(name, size)) {
        cartMessage.classList.remove('disable');
        cartMsgText.textContent = 'Este Producto ya está en el Carrito con la misma talla.';
        buyNow.classList.add('disabled');
        removeCartMessage();
        return;
    }

    // Extrae y reduce el stock específico de la talla y el stock general del producto
    const stockSize = parseInt(productCard.getAttribute(`data-stock-size${sizeIndex}`));
    const stockAll = parseInt(productCard.getAttribute('data-stock-all'));

    productCard.setAttribute(`data-stock-size${sizeIndex}`, stockSize - 1);
    productCard.setAttribute('data-stock-all', stockAll - 1);

    // Simular la compra (puedes hacer el proceso de enviar a WhatsApp aquí)
    const price = parseFloat(panelPrice.textContent.replace('$', '').replace(' USD', ''));
    const productDetails = `Producto: ${name}, Talla: ${size}, Precio: $${price.toFixed(2)} USD`;
    sendMessage(productDetails); // Esta función abre la API de WhatsApp

    // Cerrar el panel y restablecer la selección de talla
    panel.classList.add('disable');
    overlay.classList.add('disable');
    resetSizeSelection();

    updateStockAndSizes();
});**/
    
});


document.querySelectorAll('.scroll-link').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href').substring(1);
      const targetElement = document.getElementById(targetId);

      offScreenMenu.classList.remove("active");
      body.style.overflow = 'visible'
      hamMenu.classList.remove("active");
      mainLinks.style.animation = 'mainLinksIn 0.5s forwards'
      otherLinks.style.animation = 'otherLinksOut 0.5s forwards'

      if (targetElement) {
          window.scrollTo({
              top: targetElement.offsetTop,
              behavior: 'smooth'
          });
      }
  });
});


function cartIsEmpty() {
  if (cartContainer.children.length == 0) {
    emptyText.classList.remove('no-display')
  } else {
    emptyText.classList.add('no-display')
  }
}

function updateCartTotal() {
  let total = 0;
  const cartItems = cartContainer.querySelectorAll('.cart-item');
  cartItems.forEach(item => {
      const priceText = item.querySelector('.cart-item-price').textContent.replace('$', '').replace(' USD', '');
      const price = parseFloat(priceText);
      total += price;
  });
  cartTotalElement.textContent = total.toFixed(2);
}

function updateCartCount() {
    cartCounterElement.textContent = cartCount;
}

// Función para incrementar el contador
function addItemToCart() {
    cartCount++;
    updateCartCount();

    updateCartTotal();
}

// Función para decrementar el contador
function removeItemFromCart() {
    if (cartCount > 0) {
        cartCount--;
    }
    updateCartCount();

    updateCartTotal();
}

hamMenu.addEventListener("click", () => {
  hamMenu.classList.toggle("active");
  offScreenMenu.classList.toggle("active");

  menuBar.forEach(bar => {
    bar.classList.remove('cart-active')
  });
  
  if (offScreenMenu.classList.contains("active")) {
    body.style.overflow = 'hidden'
  } else {
    body.style.overflow = 'visible'
  }

  if (!offScreenMenu.classList.contains('active')) {
    mainLinks.style.animation = 'mainLinksIn 0.5s forwards'
    otherLinks.style.animation = 'otherLinksOut 0.5s forwards'
  }
});

cartBtn.addEventListener("click", () => {
  offScreenCart.classList.add("active");
  offScreenMenu.classList.add("active");
  hamMenu.classList.add('active')


  if (offScreenCart.classList.contains("active")) {
    body.style.overflow = 'hidden'

    hamMenu.addEventListener("click", () => {
      offScreenCart.classList.remove("active")
    })

    menuBar.forEach(bar => {
      bar.classList.add('cart-active')
    });

  } else {
    body.style.overflow = 'visible'
  }
});

close.addEventListener("click", () => {
  panel.classList.add('disable')
  overlay.classList.add('disable')
  sizeButtons.forEach(btn => btn.classList.remove('active'));
  resetSizeSelection();
});


// Itera sobre cada botón de talla
sizeButtons.forEach(button => {
  button.addEventListener('click', () => {
      // Restablece el diseño predeterminado para todos los botones de talla
      sizeButtons.forEach(btn => btn.classList.remove('active'));

      // Aplica el diseño de seleccionado al botón clickeado
      button.classList.add('active');
  });
});

/*document.addEventListener("DOMContentLoaded", () => {
  const cardContainers = document.querySelectorAll('.card-container');
  const observerOptions = {
      root: null,
      rootMargin: '-50px',
      threshold: 0.8
  };

  const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              const card = entry.target.querySelector('.card');
              if (card) {
                  card.classList.add('show');
              }
              observer.unobserve(entry.target);  // Deja de observar una vez que la tarjeta se muestra
          }
      });
  }, observerOptions);

  cardContainers.forEach(container => {
      observer.observe(container);
  });
});*/

updateCartCount();
cartIsEmpty();