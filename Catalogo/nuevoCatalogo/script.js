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
const panelStock = panel.querySelector('.product-info h5');
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

const passwordPanel = document.querySelector('.password-panel');
const allContent = document.querySelector('.all')
const closePasswordPanel = document.querySelector('.close2')
const passwordPanelLinkDisplayer = document.querySelector('.manager')

let sizeSelected = false;

let msgActive = false;

function gatherProducts() {
    const productsSections = document.querySelectorAll('.products'); // Selecciona todas las secciones de productos
    const uniqueProducts = {}; // Objeto para almacenar productos únicos

    productsSections.forEach(section => {
        const cards = section.querySelectorAll('.card'); // Selecciona todas las tarjetas de productos dentro de cada sección

        cards.forEach(card => {
            const productName = card.getAttribute('data-name'); // Obtiene el nombre del producto

            if (!uniqueProducts[productName]) { // Si el producto no ha sido añadido aún
                // Extrae atributos del producto
                const productData = {
                    name: productName,
                    price: card.getAttribute('data-price'),
                    image: card.getAttribute('data-image'),
                    stock: card.getAttribute('data-stock'),
                    size: card.getAttribute('data-size')
                };

                uniqueProducts[productName] = productData; // Almacena el producto en el objeto
            }
        });
    });

    return uniqueProducts;
}

function createManagementSection() {
    const managerSection = document.querySelector('.manager-section'); // Selecciona la sección de gestión
    const products = gatherProducts(); // Obtiene los productos únicos

    for (let productName in products) {
        const productData = products[productName];

        // Crea un contenedor para cada producto
        const productContainer = document.createElement('div');
        productContainer.classList.add('man-product');

        // Establece los atributos del producto en el contenedor
        productContainer.setAttribute('data-name', productData.name);
        productContainer.setAttribute('data-price', productData.price);
        productContainer.setAttribute('data-image', productData.image);
        productContainer.setAttribute('data-stock', productData.stock);
        productContainer.setAttribute('data-size', productData.size);

        // Usar innerHTML para estructurar el contenido
        productContainer.innerHTML = `
            <div class="product-card-manager">
                <div class="product-img">
                    <img src="${productData.image}" alt="${productData.name}">
                </div>
                <div class="product-info">
                    <h2 class="product-name">${productData.name}</h2>
                </div>
            </div>
        `;

        // Añadir el contenedor de producto a la sección de gestión
        managerSection.appendChild(productContainer);

        productContainer.addEventListener('click', function() {
            console.log('despliega')
        })
    }

    
}

document.addEventListener('DOMContentLoaded', () => {
    createManagementSection(); // Llama a la función para crear la sección de gestión
});

function passwordPanelDisabled() {
    if (!passwordPanel.classList.contains('disabled')) {
        const password = document.getElementById('pass').value = '';
        const passwordText = document.querySelector('label');
        passwordPanel.classList.add('disabled')

        passwordText.textContent = 'Introduce la contraseña para continuar'
    }
}

passwordPanelLinkDisplayer.addEventListener('click', function() {
    passwordPanel.classList.remove('disabled')
})

closePasswordPanel.addEventListener('click', function() {
    passwordPanelDisabled()
})

passwordPanel.addEventListener('submit', function (event) {
    event.preventDefault();

    const password = document.getElementById('pass').value;
    const passwordText = document.querySelector('label');


    const realPassword = 'certifiedM';

    if (password === realPassword) {
        allContent.style.display = "none"
        const password = document.getElementById('pass').value = '';
        passwordPanelDisabled()
    } else {
        passwordText.textContent = 'Contraseña incorrecta, Intentelo nuevamente'
        const password = document.getElementById('pass').value = '';
    }

})

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
  
            // Actualiza el panel con los datos sincronizados
            const price = this.getAttribute('data-price');
            const image = this.getAttribute('data-image');
            const panelSizes = this.getAttribute('data-size').split(',');
            const stock = parseInt(this.getAttribute('data-stock')) || 0; // Stock general del producto
  
            panelName.textContent = name;
            panelPrice.textContent = price;
            panelImage.src = image;
            panelStock.textContent = `Unidades Disponibles: ${stock}`;
  
            // Oculta todos los botones de talla inicialmente
            sizeButtons.forEach(button => {
                button.style.display = 'none';
            });
  
            // Muestra solo los botones de las tallas disponibles
            panelSizes.forEach(size => {
                const button = sizeOptions.querySelector(`.size-btn[data-size="${size.trim()}"]`);
                if (button) {
                    button.style.display = 'flex';
                }
            });
  
            panel.classList.remove('disable');
            overlay.classList.remove('disable');
        });
    });
}

function updateProductStock() {
    const cards = document.querySelectorAll(".card");

    cards.forEach((card) => {

        const stock = parseInt(card.getAttribute('data-stock')) || 0; // Stock general del producto

        if (stock <= 0) {
            card.classList.add('disabled');
        } else {
            card.classList.remove('disabled');
        }
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

    // Encuentra todas las tarjetas del producto actual
    const productCards = document.querySelectorAll(`.card[data-name="${name}"]`);

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

    // Obtener los botones de control de cantidad y el elemento de cantidad
    const decrementButton = cartItem.querySelector('.decrement');
    const incrementButton = cartItem.querySelector('.increment');
    const quantityElement = cartItem.querySelector('.cart-item-quantity');
    const priceElement = cartItem.querySelector('.cart-item-price');
    const removeButton = cartItem.querySelector('.remove-item');

    let quantity = 1;
    const productCard = productCards[0];
    let stock = parseInt(productCard.getAttribute('data-stock')) || 0;


    // Verifica cuántas tallas tiene el producto
    const availableSizes = productCard.getAttribute('data-size').split(',').length;

    // Actualiza el estado de los incrementadores basado en la cantidad de tallas
    function updateButtonState(quantity, stock, decrementButton, incrementButton, availableSizes) {
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

    // Inicializa el estado de los botones
    updateButtonState(quantity, stock, decrementButton, incrementButton, availableSizes);

    // Eventos de incremento y decremento
    decrementButton.addEventListener('click', () => {
        if (quantity > 1) {
            quantity--;
            quantityElement.textContent = quantity;
            priceElement.textContent = `$${(price * quantity).toFixed(2)} USD`;
            updateButtonState(quantity, stock, decrementButton, incrementButton, availableSizes);
        }
        updateCartTotal();
    });

    incrementButton.addEventListener('click', () => {
        if (msgActive) return; // Evitar que se ejecute si el mensaje está activo
    
        if (availableSizes === 1 && quantity < stock) { // Permitir incremento solo si hay una talla
            quantity++;
            quantityElement.textContent = quantity;
            priceElement.textContent = `$${(price * quantity).toFixed(2)} USD`;
            updateButtonState(quantity, stock, decrementButton, incrementButton, availableSizes);
        } else if (availableSizes > 1) {
            cartMessage.classList.remove('disable');
            cartMsgText.textContent = 'Solo puedes agregar una unidad por talla.';
            incrementButton.classList.add('disabled');
            msgActive = true;
            
            // Deshabilitar todos los botones de incremento
            disableAllIncrementButtons();
    
            removeCartMessageFromCart(); // Llamar a la función para eliminar el mensaje
        }
        updateCartTotal();
    });
    
    function disableAllIncrementButtons() {
        const cartItems = cartContainer.querySelectorAll('.cart-item'); // Obtener todos los elementos .cart-item
        cartItems.forEach(item => {
            const increment = item.querySelector('.increment');
            increment.style.pointerEvents = "none"; // Deshabilitar clic
        });
    }
    
    function enableAllIncrementButtons() {
        const cartItems = cartContainer.querySelectorAll('.cart-item'); // Obtener todos los elementos .cart-item
        cartItems.forEach(item => {
            const increment = item.querySelector('.increment');
            increment.style.pointerEvents = "auto"; // Habilitar clic
        });
    }

    // Evento para eliminar el producto del carrito
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

    function removeCartMessageFromCart() {
        cartMessage.classList.add('slide-down');
        cartMessage.classList.remove('slide-up');
    
        if (!cartMessage.classList.contains('disable')) {
            setTimeout(() => {
                cartMessage.classList.remove('slide-down');
                cartMessage.classList.add('slide-up');
            }, 2000);
    
            setTimeout(() => {
                msgActive = false;
                // Rehabilitar todos los botones de incremento después de que el mensaje desaparezca
                enableAllIncrementButtons();
            }, 2300);
        }
    }
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

  // Mostrar/Ocultar el dropdown y alternar flechas
  dropParent.addEventListener('click', () => {
      dropdown.classList.toggle('active');
      const isDropdownOpen = dropdown.classList.contains('active');
  });

  // Ocultar el dropdown y restablecer las flechas al seleccionar una opción
  dropdown.querySelectorAll('li').forEach(option => {
      option.addEventListener('click', () => {
          dropdown.classList.remove('active');
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
  });

  sortDescButton.addEventListener('click', () => {
      const sectionContainer = sortElement.closest('section').querySelector('.cards');
      sortCards(sectionContainer, 'desc');
      dropParent.classList.add('active')
      dropParentTitle.textContent = 'Price, Higher to Low'
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

    //localStorage.clear();
    loadStockData();
    updateProductStock()

  const buyNowButton = document.querySelector('.buy-now');
  const checkoutButton = document.querySelector('.checkout');
  const cartContainer = document.getElementById('cart-container');
  const contactUsLink = document.querySelector('.link-contact');
  const ownerPhoneNumber = "995579209365"; // Reemplaza con el número de teléfono del dueño

  function saveStockData() {
    const productCards = document.querySelectorAll('.card'); // Selecciona todas las tarjetas de productos
    const stockData = {};

    productCards.forEach(card => {
        const productName = card.getAttribute('data-name'); // Obtiene el nombre del producto
        const stock = card.getAttribute('data-stock'); // Obtiene el stock actual del producto
        stockData[productName] = stock; // Guarda el stock en un objeto con el nombre como clave
    });

    updateProductStock();
        localStorage.setItem('stockData', JSON.stringify(stockData)); // Guarda el objeto en Local Storage
    }

    function loadStockData() {
        const stockData = JSON.parse(localStorage.getItem('stockData')); // Obtiene el objeto de Local Storage
    
        if (stockData) {
            const productCards = document.querySelectorAll('.card'); // Selecciona todas las tarjetas de productos
    
            productCards.forEach(card => {
                const productName = card.getAttribute('data-name'); // Obtiene el nombre del producto
    
                if (stockData[productName]) { // Verifica si hay datos de stock guardados para este producto
                    card.setAttribute('data-stock', stockData[productName]); // Establece el stock desde Local Storage
    
                    // Actualiza la interfaz de usuario (UI) con el stock actualizado
                    const stockElement = card.querySelector('.stock-info'); // Ajusta este selector a la clase de tu elemento de stock
                    if (stockElement) {
                        stockElement.textContent = `Unidades Disponibles: ${stockData[productName]}`;
                    }
                }
            });
        }
    }

  function getProductDetailsFromPanel() {
      const panel = document.querySelector('.panel');
      const name = panel.querySelector('.product-info h1').textContent;
      const price = panel.querySelector('.product-info h3').textContent;
      const quantity = 1; // Por defecto 1, ya que es un producto individual

      return `Producto: ${name}, Precio: ${price}, Cantidad: ${quantity}`;
  }

  function getCartDetails() {
    const cartItems = cartContainer.querySelectorAll('.cart-item');
    let cartDetails = '';

    cartItems.forEach(item => {
        const name = item.querySelector('.cart-item-name').textContent;
        const price = item.querySelector('.cart-item-price').textContent;
        const size = item.querySelector('.cart-item-size').textContent.replace('Size: ', '');
        const quantity = parseInt(item.querySelector('.cart-item-quantity').textContent);

        cartDetails += `Producto: ${name}, Talla: ${size}, Cantidad: ${quantity}, Precio: ${price}. \n`;
    });

        return cartDetails.trim();
    }

checkoutButton.addEventListener('click', (e) => {
    e.preventDefault();

    // Recorrer todos los elementos del carrito
    const cartItems = document.querySelectorAll('.cart-item');

    cartItems.forEach((cartItem) => {
        const name = cartItem.querySelector('.cart-item-name').textContent; // Nombre del producto
        const quantity = parseInt(cartItem.querySelector('.cart-item-quantity').textContent); // Cantidad seleccionada

        // Obtener todas las tarjetas del producto correspondiente por su "data-name"
        const productCards = document.querySelectorAll(`.card[data-name="${name}"]`);

        productCards.forEach((productCard) => {
            // Obtener el stock actual del producto
            let stock = parseInt(productCard.getAttribute('data-stock')) || 0;

            // Restar la cantidad seleccionada del stock del producto
            if (stock > 0) {
                stock -= quantity;  // Restar la cantidad seleccionada del stock
                stock = Math.max(stock, 0); // Asegurar que el stock no sea negativo
                productCard.setAttribute('data-stock', stock);  // Actualizar el stock en la tarjeta

                // Actualizar el texto de stock en el panel si es necesario
                if (panelName.textContent === name) {
                    panelStock.textContent = `Unidades Disponibles: ${stock}`;
                }
            }
        });
    });

    const cartDetails = getCartDetails();
    sendMessage(cartDetails);

    // Limpiar el carrito después del checkout
    cartContainer.innerHTML = '';  // Remueve todos los elementos del carrito
    cartCount -= cartItems.length;
    cartIsEmpty();  // Verifica si el carrito está vacío y actualiza la interfaz de usuario
    updateCartTotal();  // Actualiza el total del carrito
    updateProductStock();  // Actualiza visualmente el stock de productos después del checkout
    saveStockData();

    location.reload();
});

// Evento "Buy Now": manejar la compra y actualizar el estado guardado
buyNowButton.addEventListener('click', (e) => {
    e.preventDefault();

    // Asegúrate de que una talla esté seleccionada antes de continuar
    if (!checkSizeSelected()) {
        cartMessage.classList.remove('disable');
        cartMsgText.textContent = 'Por favor, selecciona una talla antes de continuar.';
        buyNow.classList.add('disabled');
        removeCartMessage();
        return;
    }

    // Obtener el nombre del producto y todos los elementos que tienen el mismo data-name
    const name = panelName.textContent;
    const productCards = document.querySelectorAll(`.card[data-name="${name}"]`);

    // Restar 1 del stock de cada tarjeta correspondiente
    productCards.forEach((productCard) => {
        let stock = parseInt(productCard.getAttribute('data-stock')) || 0;

        // Si hay stock disponible, se reduce en 1
        if (stock > 0) {
            stock -= 1;
            productCard.setAttribute('data-stock', stock);

            // Actualizar el texto de stock en el panel si es necesario
            if (panelName.textContent === name) {
                panelStock.textContent = `Unidades Disponibles: ${stock}`;
            }
        }

        // Si el stock llega a 0, podrías agregar lógica adicional aquí si es necesario
    });

    // Continuar con el flujo de añadir al carrito
    const selectedButton = sizeOptions.querySelector('.size-btn.active');
    const size = selectedButton.getAttribute('data-size');
    const price = parseFloat(panelPrice.textContent.replace('$', '').replace(' USD', ''));

    // Generar el mensaje del producto
    const productDetails = `Producto: ${name}, Talla: ${size}, Precio: $${price.toFixed(2)} USD`;
    sendMessage(productDetails);

    // Cerrar el panel de compra
    panel.classList.add('disable');
    overlay.classList.add('disable');
    resetSizeSelection();
    updateProductStock();
    saveStockData();

    location.reload();
});

// Manejador de clic en las tarjetas de productos
cards.forEach((card) => {
    card.addEventListener('click', function () {
        const name = this.getAttribute('data-name');

        // Obtén la información del producto actual
        const price = this.getAttribute('data-price');
        const image = this.getAttribute('data-image');
        const sizes = this.getAttribute('data-size').split(',');
        const stock = this.getAttribute('data-stock');

        // Actualiza la información del panel
        panelName.textContent = name;
        panelPrice.textContent = price;
        panelImage.src = image;
        panelStock.textContent = `Unidades Disponibles: ${stock}`;

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
updateProductStock();