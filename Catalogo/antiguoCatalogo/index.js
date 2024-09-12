// Prueba de guardado
const testData = { sizes: ['S', 'M'], stockData: { 'data-stock-size1': 10, 'data-stock-size2': 5 } };
localStorage.setItem('testProduct', JSON.stringify(testData));
console.log('Stored:', localStorage.getItem('testProduct'));

// Prueba de carga
const loadedData = JSON.parse(localStorage.getItem('testProduct'));
console.log('Loaded:', loadedData);